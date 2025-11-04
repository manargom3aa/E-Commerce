import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seller } from './seller.schema';
import { AbstractRepository } from '../abstract.repository';

@Injectable()
export class SellerRepository extends AbstractRepository<Seller> {
  constructor(
    @InjectModel(Seller.name) sellerModel: Model<Seller>,
  ) {
    super(sellerModel)
  }

}
