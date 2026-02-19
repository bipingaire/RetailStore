import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { LocalPrismaService } from '../prisma/local-prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Prisma } from '../generated/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tenantPrisma: TenantPrismaService,
    private prisma: PrismaService,
    private localPrisma: LocalPrismaService,
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

    const tenant = await this.prisma.tenant.findUnique({ where: { subdomain } });
    if (!tenant) {
      throw new UnauthorizedException('Tenant not found');
    }
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
    const tenant = await this.prisma.tenant.findUnique({ where: { subdomain } });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }
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

  async getProfile(userId: string) {
    if (!userId) return null;
    let user = await this.localPrisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      // Check super admin
      const superAdmin = await this.prisma.superAdmin.findUnique({
        where: { id: userId } // Assuming ID matches or finding by some other means if ID not UUID
      });
      if (superAdmin) return superAdmin;
    }
    return user;
  }

  async forgotPassword(email: string) {
    const user = await this.localPrisma.user.findUnique({ where: { email } });
    if (!user) return { success: false }; // Silent fail

    // Generate token
    const token = this.jwtService.sign({ email: user.email, sub: user.id, type: 'reset' }, { expiresIn: '1h' });
    // In real app, send email with link: /auth/reset-password?token=XYZ
    console.log(`Reset Token for ${email}: ${token}`);
    return { success: true };
  }

  async resetPassword(token: string, newPass: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'reset') throw new BadRequestException('Invalid token type');

      const hashedPassword = await bcrypt.hash(newPass, 10);

      await this.localPrisma.user.update({
        where: { id: payload.sub },
        data: { password: hashedPassword }
      });
      return { success: true };
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async registerOwner(subdomain: string, dto: RegisterDto) {
    // 1. Check if tenant exists in Master DB
    let existingTenant = await this.prisma.tenant.findUnique({
      where: { subdomain }
    });

    if (!existingTenant) {
      // Create Tenant in Master DB
      // Use a default tenant DB URL or env var
      const defaultDbUrl = process.env.TENANT_DATABASE_URL || process.env.DATABASE_URL;

      existingTenant = await this.prisma.tenant.create({
        data: {
          storeName: dto.name,
          subdomain: subdomain,
          isActive: true,
          adminEmail: dto.email,
          databaseUrl: defaultDbUrl! // TODO: Provision real DB
        }
      });
    }

    // 2. Create User in Local DB (User table)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Create RetailStoreTenant in Local DB
    const tenantData = {
      tenantId: existingTenant.id,
      storeName: dto.name || subdomain,
      subdomain: subdomain,
      isActive: true,
      ownerUserId: 'temp', // Will update
      type: 'RETAILER' // Default type
    };

    const newTenant = await this.localPrisma.retailStoreTenant.create({
      data: tenantData
    });

    const newUser = await this.localPrisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'OWNER',
        tenantId: newTenant.tenantId
      }
    });

    // Update tenant owner
    await this.localPrisma.retailStoreTenant.update({
      where: { tenantId: newTenant.tenantId },
      data: { ownerUserId: newUser.id }
    });

    const payload = { email: newUser.email, sub: newUser.id, role: newUser.role, tenantId: newUser.tenantId };
    return {
      access_token: this.jwtService.sign(payload),
      user: newUser
    };
  }

  async loginOwner(dto: LoginDto) {
    const user = await this.localPrisma.user.findUnique({
      where: { email: dto.email },
      include: { RetailStoreTenants: true }
    });

    if (user && await bcrypt.compare(dto.password, user.password)) {
      // Validate Tenant
      // If user has tenantId, we are good.
      const tenant = user.RetailStoreTenants[0]; // Assuming one tenant per owner for now

      const payload = { email: user.email, sub: user.id, role: user.role, tenantId: tenant?.tenantId };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          ...user,
          tenantId: tenant?.tenantId
        },
        tenant: tenant
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
