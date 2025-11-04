import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
    getProfile(user: any){
      return user
    }
}
