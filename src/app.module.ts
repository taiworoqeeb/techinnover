import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { ProductModule } from './product/product.module';
import { AppController } from './app.contoller';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL as string,
      })
    }),
    ConfigModule.forRoot(),
    UserModule,
    AdminModule,
    ProductModule],
  controllers: [AppController]
})
export class AppModule {}
