import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth, User } from '@common/decorators';
import { ProductFactoryService } from './factory';
import { message } from '@common/constant';

@Controller('product')
@Auth(['Admin', 'Seller'])
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productFactoryService: ProductFactoryService,
    
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @User() user: any) {
      const product = this.productFactoryService.createProduct(
        createProductDto,
        user,
      )
      const createdProduct = await this.productService.create(product)
      return{
          success: true,
          message: message.Product.created,
          data: {createdProduct}
      }
  }

 
  @Get(':id')
  async getById(@Param('id') id: string) {
    const product = await this.productService.findById(id);
    return { success: true, message: "Product found successfully", data: product };
  }

  @Get()
  async getAll() {
    const products = await this.productService.findAll();
    return { success: true, message: "Products retrieved successfully", data: products };
  }
 
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: any, @User() user: any) {
    const updated = await this.productService.update(id, { ...updateDto, updatedBy: user._id });
    return { success: true, message: "Product updated successfully", data: updated };
  }

    @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }
}
