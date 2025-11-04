import { Module, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserMongoModule } from '@shared/index';
import { AuthFactoryService } from './factory';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthService } from './strategies/google.strategy';

@Module({
  imports: [
    UserMongoModule,
  
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthFactoryService,
    JwtService,
    GoogleAuthService,
  
  ],
})
export class AuthModule {}
