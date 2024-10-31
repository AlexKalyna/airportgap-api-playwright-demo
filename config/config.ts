import dotenv from 'dotenv';

dotenv.config();

export const config = {
  apiURL: process.env.API_URL,
  httpCredentials: {
    email: process.env.HTTP_CREDENTIALS_EMAIL,
    password: process.env.HTTP_CREDENTIALS_PASSWORD
  }
};
