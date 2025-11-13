import { AbstractRepository } from "@model/abstract.repository";
import { Injectable } from "@nestjs/common";
import { Product } from "./product.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class ProductRepository extends AbstractRepository<Product>{
    constructor(@InjectModel(Product.name) productModel:Model<Product>){
        super (productModel)
    }
}