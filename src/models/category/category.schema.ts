import {  Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {  SchemaTypes, Types } from 'mongoose';


@Schema({
  timestamps: true, 
  discriminatorKey: 'role',
  toJSON : { virtuals: true }
})
export class Category {
    readonly _id : Types.ObjectId;
    
    @Prop ({ type: String, required: true, unique: true, trim: true })
    name: string;

    @Prop ({ type: String, required: true, unique: true, trim: true })
    slug: string;

    @Prop ({ type: mongoose.Schema.Types.ObjectId, required: true, ref:'Admin' })
    createdBy: Types.ObjectId;
    @Prop ({ type: Types.ObjectId, required: true, ref:'Admin' })
    updatedBy: Types.ObjectId;
    logo: Object;


}

export const categorySchema = SchemaFactory.createForClass(Category);
