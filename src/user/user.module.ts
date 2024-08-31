import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Passport } from '../middleware/passport';
import { ConfigModule } from '@nestjs/config';
import { Utils } from '../util';
import { Admin, AdminSchema } from 'src/admin/entities/admin.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema,}, {name: Admin.name, schema: AdminSchema}
    ]),
],
  controllers: [UserController],
  providers: [UserService, Passport, Utils],
  exports: [UserService]
})
export class UserModule {}
