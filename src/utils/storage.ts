import { R2 } from "./clients/r2";

export class Storage extends R2 {
  private constructor() {
    const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
    const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
    const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
    const BUCKET_NAME = process.env.R2_BUCKET_NAME;

    if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET_NAME) {
      throw new Error("R2 credentials not found");
    }

    super({
      accountId: ACCOUNT_ID,
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
      bucketName: BUCKET_NAME,
      region: "auto",
    });
  }

  private static instance: Storage;

  static getInstance() {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }

    return Storage.instance;
  }
}
