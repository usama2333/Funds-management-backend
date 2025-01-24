import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('admin')
    @Roles('admin', 'super admin')
    adminDashboard() {
        return this.dashboardService.getAdminDashboard()
    }

    @Get('user')
    @Roles('user')
    userDashboard() {
        return this.dashboardService.getUserDashboard()
    }
}
