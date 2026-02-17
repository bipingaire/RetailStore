import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tenantService: TenantService,
    private tenantPrisma: TenantPrismaService,
    private prisma: PrismaService,
  ) { }

  async validateSuperAdmin(email: string, password: string) {
    const admin = await this.prisma.superAdmin.findUnique({ where: { email } });

    if (!admin || !await bcrypt.compare(password, admin.password)) {
      throw new UnauthorizedException('Invalid superadmin credentials');
    }

    // Check if user also exists in tenant DB? Not needed for master console.
    // We strictly use the Master DB SuperAdmin table.

    // But wait, the previous seed combined User and SuperAdminUser in Master DB.
    // The SuperAdmin model I verified in schema-master is `model SuperAdmin`.
    // So this is correct.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = admin;
    return result;
  }

  async loginSuperAdmin(admin: any) {
    const payload = {
      email: admin.email,
      sub: admin.id,
      role: 'SUPERADMIN',
      // No tenantId or subdomain for superadmin
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: admin,
    };
  }

  async validateUser(subdomain: string, email: string, password: string) {
    console.log(`[AuthService] Validating user for subdomain: ${subdomain}, email: ${email}`);

    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    console.log(`[AuthService] Found tenant:`, tenant.id, tenant.subdomain);

    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    console.log(`[AuthService] Got tenant client for database:`, tenant.databaseUrl);

    // Check if table exists? If not migrated, this will fail.

    const user = await client.user.findUnique({ where: { email } });
    console.log(`[AuthService] User lookup result:`, user ? `Found user ${user.id}` : 'User not found');

    if (!user) {
      console.log(`[AuthService] User not found for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(`[AuthService] Password hash starts with:`, user.password.substring(0, 10));
    console.log(`[AuthService] Password is hashed:`, user.password.startsWith('$2b$'));

    // If password is bcrypt hashed, compare with bcrypt
    if (user.password.startsWith('$2b$')) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`[AuthService] Bcrypt comparison result:`, isPasswordValid);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      // Fallback for plain text if any legacy data
      console.log(`[AuthService] Using plain text comparison`);
      if (user.password !== password) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    console.log(`[AuthService] Authentication successful for user: ${email}`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return { ...result, tenantId: tenant.id, subdomain };
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role, // role from Tenant DB User
      tenantId: user.tenantId, // ID from Master Tenant table
      subdomain: user.subdomain,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(subdomain: string, email: string, password: string, name: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    const existingUser = await client.user.findUnique({ where: { email } });
    if (existingUser) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await client.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'CASHIER', // Default
      },
    });

    return this.login({ ...user, tenantId: tenant.id, subdomain });
  }
}
