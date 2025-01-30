import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guards';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/roles.enum';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('create')
    @Roles(UserRole.SuperAdmin)
    async createAdmin(@Body() createAdminDto: CreateAdminDto, @Req() req: any) {
        const currentUser = req.user
        return this.adminService.createAdmin(createAdminDto,currentUser)
    }
}
