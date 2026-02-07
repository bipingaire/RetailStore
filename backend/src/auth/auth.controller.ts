import { Controller, Post, Body, Headers, UseGuards, Request } from '@nestjs/common';
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
}
