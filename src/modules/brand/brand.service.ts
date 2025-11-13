import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Brand } from "./entities/brand.entity";
import { BrandRepository } from "@model/index";
import { message } from "@common/constant";
import { Types } from "mongoose";
import slugify from "slugify";

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async create(brand: Brand) {
    const brandExist = await this.brandRepository.getOne({ slug: brand.slug });
    if (brandExist) throw new ConflictException(message.Brand.alreadyExist);
    return await this.brandRepository.create(brand);
  }

  async findOne(id: string | Types.ObjectId) {
    const brandExist = await this.brandRepository.getOne({ _id: id });
    if (!brandExist) throw new NotFoundException(message.Brand.notFound);
    return brandExist;
  }

  async update(id: string | Types.ObjectId, data: Partial<Brand>) {
    const brandExist = await this.brandRepository.getOne({ _id: id });
    if (!brandExist) throw new NotFoundException(message.Brand.notFound);

    
    if (data.name) {
      const slug = slugify(data.name, { lower: true, trim: true });
      const duplicate = await this.brandRepository.getOne({ slug });
      if (duplicate && duplicate._id.toString() !== id.toString()) {
        throw new ConflictException(message.Brand.alreadyExist);
      }
      data.slug = slug;
    }

    const updated = await this.brandRepository.updateOne({ _id: id }, data, { new: true });
    return updated;
  }


async delete(id: string | Types.ObjectId) {
  const brandExist = await this.brandRepository.getOne({ _id: id });
  if (!brandExist) throw new NotFoundException(message.Brand.notFound);

  await this.brandRepository.deleteOne({ _id: id });
  return { success: true, message: message.Brand.deleted };
}

  async findById(id: string | Types.ObjectId) {
    const brand = await this.brandRepository.getOne({ _id: id });
    if (!brand) throw new NotFoundException(message.Brand.notFound);
    return brand;
  }

  async findAll() {
  const brands = await this.brandRepository.getAll({});
  return brands;
}


}
