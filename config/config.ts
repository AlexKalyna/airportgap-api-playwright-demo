import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'local';
const envFilePath = path.resolve(__dirname, `../envs/.env.${env}`);

// Only log once per process to avoid spam in CI (multiple workers/test files)
if (!(global as any).__envConfigLoaded) {
  if (!process.env.API_URL || !process.env.HTTP_CREDENTIALS_EMAIL || !process.env.HTTP_CREDENTIALS_PASSWORD) {
    console.log('Loading environment variables from file:', envFilePath);
    dotenv.config({ path: envFilePath });
  }
  // Environment variables are already set - no need to log this
  (global as any).__envConfigLoaded = true;
} else if (!process.env.API_URL || !process.env.HTTP_CREDENTIALS_EMAIL || !process.env.HTTP_CREDENTIALS_PASSWORD) {
  // Still load env file if needed, just don't log again
  dotenv.config({ path: envFilePath });
}

// Validate required environment variables
const apiURL = process.env.API_URL?.trim();
if (!apiURL) {
  throw new Error(
    'API_URL environment variable is not set. ' +
    'Please set it in your CI workflow or .env file. ' +
    `Current NODE_ENV: ${process.env.NODE_ENV || 'not set'}`
  );
}

export const config = {
  apiURL: apiURL,
  httpCredentials: {
    email: process.env.HTTP_CREDENTIALS_EMAIL,
    password: process.env.HTTP_CREDENTIALS_PASSWORD
  }
};
