import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tenantService: TenantService,
    private tenantPrisma: TenantPrismaService,
  ) { }

  async validateUser(subdomain: string, email: string, password: string) {
    console.log(`[AuthService] Validating user for subdomain: ${subdomain}, email: ${email}`);
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    // Check if table exists? If not migrated, this will fail.

    const user = await client.user.findUnique({ where: { email } });

    if (!user || user.password.startsWith('$2b$') && !await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Fallback for plain text if any legacy data
    if (user && !user.password.startsWith('$2b$') && user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

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
