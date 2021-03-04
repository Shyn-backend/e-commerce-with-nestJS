/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    async uploadPublicFile(dataBuffer: Buffer, filename: string) {
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
            Body: dataBuffer,
            Key: `${uuid()}-${filename}`
        })
            .promise();

            console.log(uploadResult)
        return uploadResult;
    }

    async deletePublicFile(key: string) {
       
        const s3 = new S3();
        await s3.deleteObject({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Key: key,
        }).promise();
        return "deleted";
      }
}