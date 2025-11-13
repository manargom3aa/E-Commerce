import { DiscountType } from "@model/index";
import { Types } from "mongoose";

export class Product {
        readonly _id:Types.ObjectId;
        name: string;
        slug: string;
        description: string    
        categoryId: Types.ObjectId;
        brandId:Types.ObjectId;
        createdBy: Types.ObjectId;
        updatedBy: Types.ObjectId;
        price:number
        discountAmount:number
        discountType:DiscountType    
        finalPrice:number    
        stock:number  
        sold:number
        colors: string[]
        size: string[]
}