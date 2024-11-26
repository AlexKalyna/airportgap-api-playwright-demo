import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'local';
const envFilePath = path.resolve(__dirname, `../envs/.env.${env}`);

if (!process.env.API_URL || !process.env.HTTP_CREDENTIALS_EMAIL || !process.env.HTTP_CREDENTIALS_PASSWORD) {
  console.log('Loading environment variables from file:', envFilePath);
  dotenv.config({ path: envFilePath });
} else {
  console.log('Environment variables are already set.');
}

export const config = {
  apiURL: process.env.API_URL,
  httpCredentials: {
    email: process.env.HTTP_CREDENTIALS_EMAIL,
    password: process.env.HTTP_CREDENTIALS_PASSWORD
  }
};
