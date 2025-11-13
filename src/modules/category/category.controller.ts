import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryFactoryService } from './factory';
import { Auth, Public, User } from '@common/decorators';
import { success } from 'zod';

@Controller('category')
@Auth(['Admin'])
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryFactoryService: CategoryFactoryService,
    
  ) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @User() user: any) {
      const category= this.categoryFactoryService.createCategory(
        createCategoryDto,
        user,
      );
    const createdCategory =  await this.categoryService.create(category)
    return {
      success: true,
      message: 'category created successfully',
      data: createdCategory,
    }
  }

  @Get()
  findAll(@Query() query: any) {
    this.categoryService.findAll(query)
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
   const category = await this.categoryService.findOne(id);
   return {
    success: true,
    data: category,
   }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user:any,
    
  ) {
      const category = await this.categoryFactoryService.updateCategory(
          id,
          updateCategoryDto,
          user,
        );
        const updatedCategory = await this.categoryService.update(id, category);
        return{
          success:true,
          message: 'category updated successfully',
          data: { updatedCategory },
        }
    }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
