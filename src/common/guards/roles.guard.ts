
import { PUBLIC, ROLES } from '@common/decorators';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
   
    const publicVal = this.reflector.get(PUBLIC  , context.getHandler())
    if (publicVal) {
        return true
    }
     const request = context.switchToHttp().getRequest();
    const roles =this.reflector.getAllAndOverride(ROLES, [context.getHandler(), context.getClass()])
    
    
      if (!roles.includes(request.user.role)) {
        throw new UnauthorizedException('not allowed')
      }
        return true
  }
}
