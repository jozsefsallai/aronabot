import { S3 } from "./s3";

export interface R2Credentials {
  accountId: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

export class R2 extends S3 {
  constructor(credentials: R2Credentials) {
    super(R2.buildR2Endpoint(credentials.accountId), {
      region: credentials.region,
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      bucketName: credentials.bucketName,
    });
  }

  private static buildR2Endpoint(accountId: string) {
    return `https://${accountId}.r2.cloudflarestorage.com`;
  }
}
