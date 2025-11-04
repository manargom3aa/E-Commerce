export interface ICustomer {
  _id?: string;
  userName: string;
  email: string;
  password: string;
  dob: Date;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  googleId?: string;
  avatar?: string;
  provider?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Customer implements ICustomer {
  _id?: string;
  userName: string;
  email: string;
  password: string;
  dob: Date;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  googleId?: string;
  avatar?: string;
  provider?: string;
  createdAt?: Date;
  updatedAt?: Date;
}