import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enum/user/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles?.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('You do not have permission!');
    }
    if (user.role === 'admin') {
      return true;
    }
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission!');
    }
    return true;
  }
}
