import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type UserDocument = User & Document;

@Schema({
  timestamps: true, 
  discriminatorKey: 'role',
  toJSON : { virtuals: true }
})
export class User {
  readonly _id : Types.ObjectId;
  @Prop({
    required: true,
    type: String,
  })
  userName: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    minlength: 6,
  })
  password: string;

  @Prop({
    default: 'user', // role can be 'user' or 'admin'
    enum: ['user', 'admin'],
  })
  role: string;

  @Prop({ type: String })
  otp: string;

  @Prop({ type: Date })
  otpExpiry: Date;

  @Prop({ type: Boolean , default: true })
  isVerified: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
