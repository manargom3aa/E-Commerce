import { 
  ConflictException, 
  Injectable, 
  UnauthorizedException, 
  BadRequestException 
} from '@nestjs/common';
import { CustomerRepository } from '@model/index';
import { ConfigService } from '@nestjs/config';
import { Customer } from './entities/auth.entity';
import { sendMail } from '@common/helpers';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import { GoogleAuthService } from './strategies/google.strategy'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly customerRepository: CustomerRepository,
    private readonly jwtService: JwtService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async register(customer: Customer) {
    const customerExist = await this.customerRepository.getOne(
      { email: customer.email },
      {},
      {}
    );
    if (customerExist) throw new ConflictException('user already exist');
    
    const createCustomer = await this.customerRepository.create(customer);
    
  
    if (!customer.otp) {
      throw new BadRequestException('OTP is required');
    }
    await this.sendConfirmationEmail(customer.email, customer.otp);
    
    const { password, otp, otpExpiry, ...customerObj } = JSON.parse(
      JSON.stringify(createCustomer)
    );

    return customerObj as Customer;
  }

  async login(loginDto: LoginDto) {
    const customerExist = await this.customerRepository.getOne({
      email: loginDto.email
    }, {}, {});
    
    if (!customerExist) throw new UnauthorizedException('invalid credentials');
    

    if (!customerExist.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }
    
    const match = await bcrypt.compare(
      loginDto.password,
      customerExist?.password || 'cuxc',
    );
    
    if (!match) throw new UnauthorizedException('invalid credentials');
    
    const token = this.jwtService.sign({
      _id: customerExist._id,
      role: 'Customer',
      email: customerExist.email,
    },
    { secret: this.configService.get('access').jwt_secret, expiresIn:'1d' },
    );
    return token;
  }

  


async googleSignup(accessToken: string) {
  try {
      
    const googleUser = await this.googleAuthService.verifyGoogleToken(accessToken);


    const existingCustomer = await this.customerRepository.getOne(
      { email: googleUser.email },
      {},
      {}
    );

    if (existingCustomer) {
      throw new ConflictException('User already exists. Please login instead.');
    }


    const newCustomer = await this.customerRepository.create({
      userName: googleUser.userName,
      email: googleUser.email,
      password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10),
      dob: new Date('1990-01-01'),
      googleId: googleUser.googleId,
      avatar: googleUser.avatar,
      provider: 'google',
      isVerified: true,
    } as Customer);


    const customerData = JSON.parse(JSON.stringify(newCustomer));

    const jwtToken = this.jwtService.sign({
      _id: customerData._id,
      role: 'Customer',
      email: customerData.email,
    }, {
      secret: this.configService.get('access').jwt_secret,
      expiresIn: '1d'
    });

    return {
      token: jwtToken,
      user: {
        _id: customerData._id,
        userName: customerData.userName,
        email: customerData.email,
        avatar: customerData.avatar,
      },
      message: 'Account created successfully 🎉'
    };

  } catch (error) {
    if (error instanceof ConflictException) {
      throw error;
    }
    throw new BadRequestException('Invalid Google token');
  }
}

async googleLogin(accessToken: string) {
  try {

    const googleUser = await this.googleAuthService.verifyGoogleToken(accessToken);

    const customer = await this.customerRepository.getOne(
      { email: googleUser.email },
      {},
      {}
    );


    if (!customer) {
      throw new BadRequestException('No account found. Please sign up first.');
    }


    const customerData = JSON.parse(JSON.stringify(customer));

    const jwtToken = this.jwtService.sign({
      _id: customerData._id,
      role: 'Customer',
      email: customerData.email,
    }, {
      secret: this.configService.get('access').jwt_secret,
      expiresIn: '1d'
    });

    return {
      token: jwtToken,
      user: {
        _id: customerData._id,
        userName: customerData.userName,
        email: customerData.email,
        avatar: customerData.avatar,
      },
      message: 'Login successful with Google ✅'
    };

  } catch (error) {
    throw new BadRequestException('Invalid Google token');
  }
}


async googleAuth(accessToken: string) {
  try {
    const googleUser = await this.googleAuthService.verifyGoogleToken(accessToken);


    const existingCustomer = await this.customerRepository.getOne(
      { email: googleUser.email },
      {},
      {}
    );

    if (existingCustomer) {
 
      return await this.googleLogin(accessToken);
    } else {
 
      return await this.googleSignup(accessToken);
    }
  } catch (error) {
    throw new BadRequestException('Invalid Google token');
  }
}


  async confirmEmail(email: string, otp: string) {
    const customer = await this.customerRepository.getOne(
      { email },
      {},
      {}
    );

    if (!customer) {
      throw new BadRequestException('User not found');
    }

    if (customer.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    if (customer.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > customer.otpExpiry) {
      throw new BadRequestException('OTP has expired');
    }


    await this.customerRepository.updateOne(
      { email },
      { 
        $set: {
          isVerified: true,
          otp: undefined,
          otpExpiry: undefined
        }
      }
    );

    return { message: 'Email verified successfully' };
  }

  async resendConfirmationEmail(email: string) {
    const customer = await this.customerRepository.getOne(
      { email },
      {},
      {}
    );

    if (!customer) {
      throw new BadRequestException('User not found');
    }

    if (customer.isVerified) {
      throw new BadRequestException('Email already verified');
    }
 
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 دقيقة

    await this.customerRepository.updateOne(
      { email },
      { 
        $set: {
          otp: newOtp,
          otpExpiry
        }
      }
    );

    await this.sendConfirmationEmail(email, newOtp);

    return { message: 'Confirmation email sent successfully' };
  }

  async forgetPassword(email: string) {
   
    if (!email || typeof email !== 'string') {
      return { message: 'a reset link has been sent' };
    }

    const customer = await this.customerRepository.getOne(
      { email: email.trim().toLowerCase() },
      {},
      {}
    );

    if (!customer) {
    
      return { message: 'a reset link has been sent' };
    }
 
    const customerId = String(customer._id);
    const resetToken = this.jwtService.sign(
      { 
        _id: customerId,
        email: customer.email,
        type: 'password_reset'
      },
      { 
        secret: this.configService.get('access').jwt_secret + '_reset',
        expiresIn: '15m' 
      }
    );

    await this.sendResetPasswordEmail(customer.email, resetToken);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
 
    if (!token || typeof token !== 'string') {
      throw new BadRequestException('Valid token is required');
    }

    if (!newPassword || typeof newPassword !== 'string') {
      throw new BadRequestException('Valid new password is required');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    try {
   
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('access').jwt_secret + '_reset'
      });

      if (payload.type !== 'password_reset') {
        throw new BadRequestException('Invalid token type');
      }

      const customer = await this.customerRepository.getOne(
        { _id: payload._id },
        {},
        {}
      );

      if (!customer) {
        throw new BadRequestException('User not found');
      }

      
      const isSamePassword = await bcrypt.compare(newPassword, customer.password);
      if (isSamePassword) {
        throw new BadRequestException('New password must be different from old password');
      }

  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await this.customerRepository.updateOne(
        { _id: payload._id },
        {
          $set: { password: hashedPassword }
        }
      );

   
      await this.sendPasswordChangedEmail(customer.email);

      return { message: 'Password reset successfully' };

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Reset token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Invalid reset token');
      }
      if (error.name === 'BadRequestException') {
        throw error;
      }
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async verifyResetToken(token: string) {
    if (!token || typeof token !== 'string') {
      throw new BadRequestException('Valid token is required');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('access').jwt_secret + '_reset'
      });

      if (payload.type !== 'password_reset') {
        throw new BadRequestException('Invalid token type');
      }
 
      const customer = await this.customerRepository.getOne(
        { _id: payload._id },
        {},
        {}
      );

      if (!customer) {
        throw new BadRequestException('User not found');
      }

      return { message: 'Token is valid', email: payload.email };

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Reset token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Invalid reset token');
      }
      throw new BadRequestException('Invalid reset token');
    }
  }

  async changePassword(customerId: string, currentPassword: string, newPassword: string) {
    const customer = await this.customerRepository.getOne(
      { _id: customerId },
      {},
      {}
    );

    if (!customer) {
      throw new BadRequestException('User not found');
    }


    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, customer.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

 
    const isSamePassword = await bcrypt.compare(newPassword, customer.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

 
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await this.customerRepository.updateOne(
      { _id: customerId },
      {
        $set: { password: hashedPassword }
      }
    );

 
    await this.sendPasswordChangedEmail(customer.email);

    return { message: 'Password changed successfully' };
  }

  async getProfile(customerId: string) {
    const customer = await this.customerRepository.getOne(
      { _id: customerId },
      { password: 0, otp: 0, otpExpiry: 0, resetPasswordToken: 0, resetPasswordExpiry: 0 },
      {}
    );

    if (!customer) {
      throw new BadRequestException('User not found');
    }

    return customer;
  }

  private async sendConfirmationEmail(email: string, otp: string) {
    const confirmationLink = `${this.configService.get('app.frontendUrl')}/confirm-email?email=${encodeURIComponent(email)}&otp=${otp}`;
    
    await sendMail({
      to: email,
      subject: 'Confirm Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Our Platform!</h2>
          <p>Please confirm your email address by clicking the button below or using the OTP code:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #007bff;">${otp}</h1>
            <p style="color: #666; font-size: 14px;">This OTP will expire in 15 minutes</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${confirmationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirm Email
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `
    });
  }

  private async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `${this.configService.get('app.frontendUrl')}/reset-password?token=${token}`;
    
    await sendMail({
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #dc3545; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This link will expire in 15 minutes. If you didn't request a password reset, please ignore this email.
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Or copy and paste this link in your browser:<br>
            ${resetLink}
          </p>
        </div>
      `
    });
  }

  private async sendPasswordChangedEmail(email: string) {
    await sendMail({
      to: email,
      subject: 'Password Changed Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Changed</h2>
          <p>Your password has been changed successfully.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <p style="color: #666; margin: 0;">
              <strong>Security Tip:</strong> Use a strong, unique password and enable two-factor authentication for better security.
            </p>
          </div>
        </div>
      `
    });
  }
 
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
 
  async generateAuthToken(customer: any) {
    return this.jwtService.sign({
      _id: customer._id,
      role: 'Customer',
      email: customer.email,
    }, {
      secret: this.configService.get('access').jwt_secret,
      expiresIn: '1d'
    });
  }
 
  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('access').jwt_secret
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }



}