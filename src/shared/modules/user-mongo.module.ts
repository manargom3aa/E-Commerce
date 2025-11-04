import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminRepository, adminSchema, Customer, CustomerRepository, CustomerSchema, Seller, SellerRepository, sellerSchema, User, UserSchema } from "src/models";

@Module({
    imports:[
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
                discriminators:[
                    { name: Seller.name, schema: sellerSchema },
                    { name: Customer.name, schema: CustomerSchema },
                    { name: Admin.name, schema: adminSchema },

                ],
            }
        ])
    ],
    controllers: [],
    providers: [SellerRepository, AdminRepository, CustomerRepository],
    exports: [SellerRepository, AdminRepository, CustomerRepository ],
})

export class UserMongoModule {}