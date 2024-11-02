import { config } from '../../../config/config';

export const data = {
  userData: {
    email: config.httpCredentials.email || '',
    password: config.httpCredentials.password || ''
  }
};

export function getData() {
  return data.userData;
}
