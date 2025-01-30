import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from 'src/common/enums/roles.enum';
import * as crypto from 'crypto';
import { CreatePasswordResetDto } from './dto/create-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordReset } from './entities/password-reset.entity';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) //Inject the User repository
        private userRepository: Repository<User>,

        @InjectRepository(PasswordReset)
        private passwordResetRepository: Repository<PasswordReset>,

        private jwtService: JwtService,
        private mailerService: MailerService  //inject mailer service
    ) {}

    // Signup logic
    async signup(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password } = createUserDto;

        // check if the email exists
        const existingUser = await this.userRepository.findOne({ where: {email} })
        if(existingUser) {
            throw new BadRequestException('Email is already Registered')
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user
        const newUser = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            role: UserRole.User,
            isDeleted: false
        })

        return this.userRepository.save(newUser)
    }

    // Login Logic
    async login(loginDto: LoginDto): Promise<{ accessToken: string}> {
        const { email, password } = loginDto

        const user = await this.userRepository.findOne({ where: { email }})

        if(!user) {
            throw new UnauthorizedException('Invalid Credentials')
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid Credentials')
        }

        // Generate JWT token
        const payload = { email: user.email, role: user.role, id: user.id}
        const accessToken = this.jwtService.sign(payload)

        return { accessToken }
    }

    // Forgot Password - Generate reset token and send email
    async forgotPassword(createPasswordResetDto: CreatePasswordResetDto) {
        const { email } = createPasswordResetDto;

        // check email in the user table
        const user = await this.userRepository.findOne({ where: { email }})
        if(!user) {
            throw new BadRequestException('Email does not exist')
        }
         // Generate a unique token for the password reset
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 1)

        // Save the token and expiration in the password_resets table
        const passwordReset = this.passwordResetRepository.create({
            email: user.email,
            token,
            expiresAt
        })

        await this.passwordResetRepository.save(passwordReset)

         // Send an email with the reset link
         const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;
         await this.mailerService.sendMail({
             to: email,
             subject: 'Password Reset Request',
             text: `Click this link to reset your password: ${resetLink}`,
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
         });
         return { message: 'Password reset email sent' };

    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { token, newPassword} = resetPasswordDto

        // check if token is vaild and expired
        const passwordReset = await this.passwordResetRepository.findOne({ where: { token }})
        if(!passwordReset || new Date() > passwordReset.expiresAt) {
            throw new BadRequestException('Invalid or expired token')
        }

        const user = await this.userRepository.findOne({ where: { email: passwordReset.email}})
        if(!user) {
            throw new BadRequestException('User not found')
        }

        // Hashed password
        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword;

        await this.userRepository.save(user);

        // Optionally, delete the token after it's been used
        await this.passwordResetRepository.delete(passwordReset.id);
        return { message: 'Updated password successfully' };
    }
}


