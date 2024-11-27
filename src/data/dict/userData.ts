import { config } from '../../../config/config';

interface UserCredentials {
  email: string;
  password: string;
}

export function getData(): UserCredentials {
  const email = config.httpCredentials?.email;
  const password = config.httpCredentials?.password;

  if (!email || !password) {
    throw new Error('Authentication credentials are missing. Please set them in the configuration.');
  }

  return { email, password };
}
