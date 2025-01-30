// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/enums/roles.enum';
// import { ROLES_KEY } from '../decorators/roles.decorator';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());
        if (!requiredRoles) {
            return true;  // No roles required, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;  // This user is added by the JWT guard
        if (!user) {
            throw new ForbiddenException('Access denied');
        }

        // Check if user role matches required roles
        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}
