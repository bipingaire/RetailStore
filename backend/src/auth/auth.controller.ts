import { Controller, Post, Body, Headers, UseGuards, Request, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Headers('x-tenant') subdomain: string, @Body() dto: LoginDto) {
    const user = await this.authService.validateUser(subdomain, dto.email, dto.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Headers('x-tenant') subdomain: string, @Body() dto: RegisterDto) {
    return this.authService.register(subdomain, dto.email, dto.password, dto.name);
  }

  @Post('super-admin/login')
  async loginSuperAdmin(@Body() dto: LoginDto) {
    const admin = await this.authService.validateSuperAdmin(dto.email, dto.password);
    return this.authService.loginSuperAdmin(admin);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Headers('x-tenant') subdomain: string, @Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('forgot-password')
  forgotPassword(@Headers('x-tenant') subdomain: string, @Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Headers('x-tenant') subdomain: string, @Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @Post('login-owner')
  loginOwner(@Body() body: LoginDto) {
    return this.authService.loginOwner(body);
  }

  @Post('register-owner')
  async registerOwner(@Body() body: any) {
    // Generate subdomain from company name
    const subdomain = body.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
    const dto: RegisterDto = {
      email: body.email,
      password: body.password,
      name: body.companyName,
      role: body.role || 'OWNER'
    };
    return this.authService.registerOwner(subdomain, dto);
  }
}
