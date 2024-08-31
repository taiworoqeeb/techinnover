import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { accountRole } from './role.enum';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<accountRole[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) {
      return true;
    }
    //const {user}=context.switchToHttp().getRequest();
    const { user } = context.switchToHttp().getRequest();
    // console.log(user);
    return requireRoles.some((role) => user.role?.includes(role));
  }
}
