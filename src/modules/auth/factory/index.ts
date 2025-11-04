import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register';
import { Customer } from '../entities/auth.entity';

@Injectable()
export class AuthFactoryService {
  async createCustomer(registerDto: RegisterDto): Promise<Customer> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);  
 
    const dob = new Date(registerDto.dob);

    return {
      userName: registerDto.userName,
      email: registerDto.email,
      password: hashedPassword,
      dob: dob,
      otp,
      otpExpiry,
      isVerified: false,
     
    } as Customer;
  }
}