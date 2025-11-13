import { Injectable } from "@nestjs/common";
import { CreateBrandDto } from "../dto/create-brand.dto";
import { Brand } from "@model/index";
import slugify from "slugify";

@Injectable()
export class BrandFactoryService{
  createBrand(createBrandDto: CreateBrandDto, user: any){
    const brand = new Brand();
    brand.name = createBrandDto.name;
    brand.slug= slugify(createBrandDto.name)
    brand.createdBy = user._id;
    brand.updatedBy = user._id;
    brand.logo = createBrandDto.logo

    return brand;
  }
}