import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    // Ensure the user exists and has the role
    const request = context.switchToHttp().getRequest();
    const user = request.user; // this comes from the middleware

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!requiredRoles) {
      return true;
    }

    // Check if user has one of the required roles
    if (requiredRoles.some((role) => user.role === role)) {
      return true;
    } else {
      throw new ForbiddenException('Access denied');
    }
  }
}
