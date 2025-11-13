import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { User } from './user.schema';
 

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(
    @InjectModel(User.name) userModel: Model<User>,
  ) {
    super(userModel)
  }

}
