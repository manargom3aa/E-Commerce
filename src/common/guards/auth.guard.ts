import { CustomerRepository } from '@model/index';
import { Injectable, CanActivate, ExecutionContext, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly customerRepository: CustomerRepository,
   

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    const customerExist = await this.customerRepository.getOne({ _id: payload._id }, {}, {});
    if (!customerExist) throw new NotFoundException('user not found');

    request.user = customerExist;
    return true;
  }
}
