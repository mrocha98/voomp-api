import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

    const fileUrl = await this.generateSignedUrl(fileName);
    return fileUrl;
  }

  async generateSignedUrl(fileName: string, expiresIn = 12 * 60 * 60) {
    const command = new GetObjectCommand({
      Bucket: Config.aws.bucket_name,
      Key: fileName,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn });
    return url;
  }
}
