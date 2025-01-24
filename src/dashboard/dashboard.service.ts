import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
    getAdminDashboard(): { message: string } {
        return { message: 'Welcome to Admin Dashboard'}
    }

    getUserDashboard(): { message: string } {
        return { message: 'Welcome to User Dashboard'}

    }
}
