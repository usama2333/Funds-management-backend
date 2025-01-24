import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) //Inject the User repository
        private userRepository: Repository<User>
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
            password: hashedPassword
        })

        return this.userRepository.save(newUser)
    }
}
