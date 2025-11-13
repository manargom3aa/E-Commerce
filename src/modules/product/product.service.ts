import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ConfigService } from '@nestjs/config';
import { AdminRepository, BrandRepository, CustomerRepository, Product, ProductRepository, SellerRepository } from '@model/index';
import { CategoryService } from '@modules/category/category.service';
import { BrandService } from '@modules/brand/brand.service';
import { Types } from 'mongoose';
import { message } from '@common/constant';
import slugify from 'slugify';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository ,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    
  ) {}

  async create(product: Product) {
    await this.categoryService.findOne(product.categoryId);

    await this.brandService.findOne(product.brandId);
    return await this.productRepository.create(product)
  }

  async findAll() {
    return await this.productRepository.getAll({});
  }

  async findById(id: string | Types.ObjectId) {
    const product = await this.productRepository.getOne({ _id: id });
    if (!product) throw new NotFoundException(message.Product.notFound);
    return product;
  }

  async update(id: string | Types.ObjectId, data: any) {
    const productExist = await this.productRepository.getOne({ _id: id });
    if (!productExist) throw new NotFoundException(message.Product.notFound);

    if (data.name) {
      const slug = slugify(data.name, { lower: true, trim: true });
      const duplicate = await this.productRepository.getOne({ slug });
      if (duplicate && duplicate._id.toString() !== id.toString()) {
        throw new ConflictException(message.Product.alreadyExist);
      }
      data.slug = slug;
    }

    return await this.productRepository.updateOne({ _id: id }, data, { new: true });
  }

  async delete(id: string | Types.ObjectId) {
    const productExist = await this.productRepository.getOne({ _id: id });
    if (!productExist) throw new NotFoundException(message.Product.notFound);

    await this.productRepository.deleteOne({ _id: id });
    return { success: true, message: message.Product.deleted };
  }
}
