import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Customer extends Document {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  dob: Date;

  @Prop()
  otp: string;

  @Prop()
  otpExpiry: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

    @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpiry: Date;

    @Prop()
  googleId: string;

  @Prop()
  avatar: string;

  @Prop({ default: 'local' })
  provider: string; // 'local' أو 'google'
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);