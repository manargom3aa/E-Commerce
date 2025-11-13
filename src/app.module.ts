import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import devConfig from './config/env/dev.config';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './modules/customer/customer.module';
import { BrandModule } from './modules/brand/brand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        load: [devConfig],
        isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        uri: ConfigService.get('db').url,
      }),
    }) , 
    // MongooseModule.forFeature([
    //   {
    //     name: User.name,
    //     schema: UserSchema,
    //     discriminators: [
    //     {
    //         name: Admin.name,
    //         schema: adminSchema,
    //     },
    //     {
    //         name: Seller.name,
    //         schema: sellerSchema,
    //     }
    //     ]
    //   },
      
    // ]),

    AuthModule,
    UserModule,
    ProductModule, 
    CategoryModule, CustomerModule, BrandModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
