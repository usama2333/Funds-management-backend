import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/common/enums/roles.enum';
import * as bcrypt from "bcrypt";


@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async createAdmin(createAdminDto: CreateAdminDto, currentUser: User): Promise<User> {
        const { email, name, password, role } = createAdminDto;
    
        // Ensure only SuperAdmin can create Admins and SuperAdmins
        if (role === UserRole.SuperAdmin || role === UserRole.Admin) {
            if (currentUser.role !== UserRole.SuperAdmin) {
                throw new ForbiddenException('Only Super Admin can create Admin and Super Admin');
            }
        }
    
        // Check if email is already in use
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('Email is already registered');
        }
    
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new user with the given role
        const newUser = this.userRepository.create({
            email,
            name,
            password: hashedPassword,
            role,
            isDeleted: false
        });
    
        return this.userRepository.save(newUser);
    }
    
}
