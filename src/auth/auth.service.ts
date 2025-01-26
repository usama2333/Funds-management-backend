import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from 'src/common/enums/roles.enum';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) //Inject the User repository
        private userRepository: Repository<User>,
        private jwtService: JwtService
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
}
