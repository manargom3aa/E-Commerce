import { PUBLIC } from '@common/decorators';
import { UserRepository } from '@model/index';
import { Injectable, CanActivate, ExecutionContext, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly reflector: Reflector,
   

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    try {
      const publicVal = this.reflector.get(PUBLIC, context.getHandler())
      if (publicVal) return true;
      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header not provided');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    const payload = this.jwtService.verify<{
      _id: string;
      role: string;
      email: string;
    }>(token, {
      secret: this.configService.get('access').jwt_secret,
    });

    const userExist = await this.userRepository.getOne({ _id: payload._id }, {}, {});
    if (!userExist) throw new NotFoundException('user not found');

    request.user = userExist;
    return true;
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
   
  }
}
