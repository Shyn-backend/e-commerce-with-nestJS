import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/user.schema';
import { FilesService } from './uploadFile.service';
import { UserService } from './user.service';
import { UploadController } from './upload/upload.controller';
import { ConfigService } from '@nestjs/config';
import { OrderingService } from './ordering.service';
import { productSchema } from '../models/product.schema';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: productSchema },
      { name: 'User', schema: UserSchema },
    ]),

    ConfigService,
  ],
  providers: [UserService, FilesService, OrderingService],
  exports: [UserService, FilesService, OrderingService],
  controllers: [UploadController],
})
export class SharedModule {}
