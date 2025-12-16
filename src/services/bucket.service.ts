import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { Config } from 'src/config';

@Injectable()
export class BucketService {
  private s3Client = new S3({
    region: Config.aws.s3_region,
    credentials: {
      accessKeyId: Config.aws.access_key_id,
      secretAccessKey: Config.aws.secret_access_key,
      sessionToken: Config.aws.session_token,
    },
  });

  async uploadFile(fileName: string, buffer: Buffer): Promise<string> {
    const uploader = new Upload({
      client: this.s3Client,
      params: {
        Bucket: Config.aws.bucket_name,
        Key: fileName,
        Body: buffer,
      },
    });

    await uploader.done();

    const fileUrl = `https://${Config.aws.bucket_name}.s3.${Config.aws.s3_region}.amazonaws.com/${fileName}`;
    return fileUrl;
  }
}
