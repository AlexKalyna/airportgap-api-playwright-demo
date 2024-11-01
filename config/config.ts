import dotenv from 'dotenv';
import path from 'path';


const env = process.env.NODE_ENV || 'local';
const envFilePath = path.resolve(__dirname, `../.env.${env}`);

dotenv.config({ path: envFilePath });

export const config = {
  apiURL: process.env.API_URL,
  httpCredentials: {
    email: process.env.HTTP_CREDENTIALS_EMAIL,
    password: process.env.HTTP_CREDENTIALS_PASSWORD
  }
};
