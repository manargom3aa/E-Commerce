import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category, CategoryRepository } from '@model/index';
import { Types } from 'mongoose';
import { message } from '@common/constant';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository){}
 
  async create(category: Category) {
    const categoryExist = await this.categoryRepository.getOne({
      slug: category.slug,
    },{},
    { populate: [{ path: 'createdBy'}, {path: 'updatedBy' }]}
  )
    if (categoryExist) throw new ConflictException('category already exist')
      return await this.categoryRepository.create(category)
  }

  findAll(query: any) {
    this.categoryRepository.getAll({}, {},{}, query)
  }

  async findOne(id: string | Types.ObjectId) {
    const category = await this.categoryRepository.getOne({ _id:id });
    if (!category) throw new NotFoundException(message.Category.notFound)
      return category
  }

  async update(id:string, category:Category) {
      const categoryExist = await this.categoryRepository.getOne({ 
        slug: category.slug,
        _id: { $ne: id },
      })
      if (categoryExist) throw new ConflictException('category already exist')
      return await  this.categoryRepository.updateOne({ _id: id }, category, {
        new: true,
    })
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
