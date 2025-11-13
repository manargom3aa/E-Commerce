import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { BrandFactoryService } from "./factory";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { Auth, User } from "@common/decorators";
import { AuthGuard, RolesGuard } from "@common/guards";
import { BrandService } from "./brand.service";
import { message } from "@common/constant";
import { UpdateBrandDto } from "./dto/update-brand.dto";

@Controller('brand')
@Auth(['Admin'])
@UseGuards(AuthGuard, RolesGuard)
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly brandFactoryService: BrandFactoryService
  ) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto, @User() user: any) {
    const brand = this.brandFactoryService.createBrand(createBrandDto, user);
    const createdBrand = await this.brandService.create(brand);
    return {
      success: true,
      message: message.Brand.created,
      data: createdBrand,
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @User() user: any
  ) {
    const updatedBrand = await this.brandService.update(id, {
      ...updateBrandDto,
      updatedBy: user._id,
    });
    return {
      success: true,
      message: message.Brand.updated,
      data: updatedBrand,
    };
  }


  @Delete(':id')
async delete(@Param('id') id: string) {
  return await this.brandService.delete(id);
}

@Get(':id')
async getById(@Param('id') id: string) {
  const brand = await this.brandService.findById(id);
  return {
    success: true,
    data: brand,
  };
}

@Get()
async getAll() {
  const brands = await this.brandService.findAll();
  return {
    success: true,
    data: brands,
  };
}

}
