import { Module } from '@nestjs/common';
import { AdminService } from './service/authentication/admin.service';
import { AdminController } from './controller/authentication/admin.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './entities/admin.entity';
import { Utils } from 'src/util';
import { Passport } from 'passport';
import { AdminUserController } from './controller/user/user.controller';
import { AdminUserService } from './service/user/user.service';
import { User, UserSchema } from 'src/user/entities/user.entity';


@Module({
  imports:[
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{name: Admin.name, schema: AdminSchema} , {name: User.name, schema: UserSchema}
    ]),
  ],
  controllers: [AdminController, AdminUserController],
  providers: [AdminService, AdminUserService, Passport, Utils],
})
export class AdminModule {}
