import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Brand } from './brand.schema';
 

@Injectable()
export class BrandRepository extends AbstractRepository<Brand> {
  constructor(
    @InjectModel(Brand.name) brandModel: Model<Brand>,
  ) {
    super(brandModel)
  }
  

}
