import { Global, Module } from '@nestjs/common';
import { S3Service } from './upload.service';

@Global()
@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class UploadModule {}
