import type AWS_S3 from "@aws-sdk/client-s3";
import { S3 as S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { type Readable, PassThrough } from "node:stream";

export interface S3Credentials {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

export interface ICreateFileOptions {
  key: string;
  data: Buffer | string;
  mimeType?: string;
  isPublic?: boolean;
}

export type ICreateStreamOptions = Omit<ICreateFileOptions, "data">;

export class S3 {
  private s3: S3Client;
  private bucket: string;

  constructor(endpoint: string, credentials: S3Credentials) {
    this.s3 = new S3Client({
      endpoint,
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });

    this.bucket = credentials.bucketName;
  }

  async exists(key: string): Promise<boolean> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.s3.headObject(params);
      return true;
    } catch (err: any) {
      if (err.name === "NotFound") {
        return false;
      }

      throw err;
    }
  }

  async delete(key: string): Promise<boolean> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.s3.headObject(params);
      return true;
    } catch (err: any) {
      if (err.code === "NotFound") {
        return true; // This key doesn't exist, we wanted to delete it anyway.
      }

      throw err;
    }
  }

  async upload(
    opts: ICreateFileOptions,
  ): Promise<AWS_S3.PutObjectCommandOutput> {
    const data = await this.s3.putObject({
      ACL: opts.isPublic ? "public-read" : "private",
      Body: opts.data,
      Bucket: this.bucket,
      Key: opts.key,
      ContentType: opts.mimeType,
    });

    return data;
  }

  uploadStream(opts: ICreateStreamOptions) {
    const passthrough = new PassThrough();

    const params: AWS_S3.PutObjectCommandInput = {
      ACL: opts.isPublic ? "public-read" : "private",
      Bucket: this.bucket,
      Key: opts.key,
      Body: passthrough,
      ContentType: opts.mimeType,
    };

    const upload = new Upload({
      client: this.s3,
      params,
    });

    return {
      stream: passthrough,
      promise: upload.done(),
    };
  }

  async getStream(key: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    const data = await this.s3.getObject(params);
    return data.Body as Readable;
  }

  async read(key: string): Promise<Buffer> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    const data = await this.s3.getObject(params);
    const bytes = await data.Body?.transformToByteArray();

    if (!bytes) {
      throw new Error("Failed to read file from S3");
    }

    return Buffer.from(bytes);
  }
}
