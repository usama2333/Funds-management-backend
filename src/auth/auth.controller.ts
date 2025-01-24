import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';

@Controller('auth') //base route /auth
export class AuthController {
    constructor( private readonly authService:AuthService) {}

    // signup route POST: auth/signup
    @Post('signup')
    async signup(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.signup(createUserDto);
    }
}
