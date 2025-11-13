import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategoryRepository, categorySchema } from '@model/index';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryFactoryService } from './factory';
import { JwtService } from '@nestjs/jwt';
import { UserMongoModule } from '@shared/index';

@Module({
  imports: [
    UserMongoModule,
    MongooseModule.forFeature([
    { name: Category.name, schema: categorySchema },
  ]),
],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, CategoryFactoryService,JwtService],
  exports: [CategoryService, CategoryRepository, CategoryService],
})
export class CategoryModule {}
