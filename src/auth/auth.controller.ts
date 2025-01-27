import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { CreatePasswordResetDto } from './dto/create-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth') //base route /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // signup route POST: auth/signup
  @Post('signup')
  async signup(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.authService.signup(createUserDto);
  }

  // Login route
  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  // Forgot Password Route
  @Post('forgot-password')
  async forgotPassword(
    @Body(ValidationPipe) createPasswordResetDto: CreatePasswordResetDto,
  ) {
    return await this.authService.forgotPassword(createPasswordResetDto);
  }

  // reset Password Route
  @Post('reset-password')
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protectedRoute() {
    return { message: 'This is a protected route' };
  }
}
