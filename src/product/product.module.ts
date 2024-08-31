import { Module } from '@nestjs/common';
import { ProductService } from './service/product/product.service';
import { ProductController } from './controller/product/product.controller';
import { UserProductController } from './controller/user/user.controller';
import { UserProductService } from './service/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/admin/entities/admin.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { Product, ProductSchema } from './entities/product.entity';
import { Utils } from 'src/util';
import { Passport } from 'passport';
import { AdminProductController } from './controller/admin/admin.controller';
import { AdminProductService } from './service/admin/admin.service';

@Module({
  imports:[
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{name: Admin.name, schema: AdminSchema} , {name: User.name, schema: UserSchema}, {name: Product.name, schema: ProductSchema}
    ]),
  ],
  controllers: [ProductController, UserProductController, AdminProductController],
  providers: [ProductService, UserProductService, AdminProductService, Passport],
})
export class ProductModule {}
