import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Query,
  Logger 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register';
import { AuthFactoryService } from './factory';
import { LoginDto } from './dto/login.dto';
import { ConfirmEmailDto } from './dto/confirm.dto';
import { ResendConfirmationDto } from './dto/resend-confirmation.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly authFactoryService: AuthFactoryService,
  ) {}
@Post('/google/signup')
async googleSignup(@Body() body: { accessToken: string }) {
  const result = await this.authService.googleSignup(body.accessToken);
  return {
    message: result.message,
    success: true,
    data: result
  };
}

@Post('/google/login')
async googleLogin(@Body() body: { accessToken: string }) {
  const result = await this.authService.googleLogin(body.accessToken);
  return {
    message: result.message,
    success: true,
    data: result
  };
}

@Post('/google/auth')
async googleAuth(@Body() body: { accessToken: string }) {
  const result = await this.authService.googleAuth(body.accessToken);
  return {
    message: result.message,
    success: true,
    data: result
  };
}


  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const customer = await this.authFactoryService.createCustomer(registerDto);
    const createdCustomer = await this.authService.register(customer);
    return { 
      message: "Customer created successfully. Please check your email for verification.", 
      success: true, 
      data: createdCustomer 
    };
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return { 
      message: 'Login successfully 👌', 
      success: true, 
      data: { token } 
    };
  }

  @Post('/confirm-email')
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    const result = await this.authService.confirmEmail(
      confirmEmailDto.email, 
      confirmEmailDto.otp
    );
    return { 
      message: result.message, 
      success: true 
    };
  }

  @Post('/resend-confirmation')
  async resendConfirmation(@Body() resendConfirmationDto: ResendConfirmationDto) {
    const result = await this.authService.resendConfirmationEmail(
      resendConfirmationDto.email
    );
    return { 
      message: result.message, 
      success: true 
    };
  }

  @Post('/forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    const result = await this.authService.forgetPassword(forgetPasswordDto.email);
    return { 
      message: result.message, 
      success: true 
    };
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword
    );
    return { 
      message: result.message, 
      success: true 
    };
  }

  @Get('/verify-reset-token')
  async verifyResetToken(@Query('token') token: string) {
    if (!token) {
      return {
        message: 'Token is required',
        success: false
      };
    }

    const result = await this.authService.verifyResetToken(token);
    return { 
      message: result.message, 
      success: true,
      data: { email: result.email }
    };
  }


  

}