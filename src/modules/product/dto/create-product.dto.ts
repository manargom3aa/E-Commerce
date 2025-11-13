import { DiscountType } from "@model/index";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { Types } from "mongoose";

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name: string;

    
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    description: string

    
    @IsString()
    @IsNotEmpty()
    categoryId: Types.ObjectId;
    
    @IsString()
    @IsNotEmpty()
    brandId:Types.ObjectId;
    
    @IsNumber()
    @IsNotEmpty()
    price:number

    @IsNumber()
    @IsNotEmpty()
    discountAmount:number

    @IsString()
    @IsNotEmpty()
    @IsEnum(DiscountType)
    discountType:DiscountType

    @IsNumber()
    @IsNotEmpty()
    stock:number

    @IsArray()
    @IsString({ each: true })
    colors: string[]

    @IsArray()
    @IsString({ each: true })
    size: string[]
    
}
