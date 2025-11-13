import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserMongoModule } from '@shared/index';
import { ProductFactoryService } from './factory';
import { JwtService } from '@nestjs/jwt';
import { Product, ProductRepository, productSchema } from '@model/index';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '@modules/category/category.module';
import { BrandModule } from '@modules/brand/brand.module';

@Module({
  imports: [
      UserMongoModule,
      MongooseModule.forFeature([{ name: Product.name , schema:productSchema }]),
      CategoryModule,
      BrandModule,
  ],
  controllers: [ProductController],
  providers: [ProductService,ProductFactoryService,JwtService, ProductRepository,  ],
})
export class ProductModule {}
