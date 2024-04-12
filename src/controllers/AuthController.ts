import { UserData } from '../data/types/types';
import BaseController from './BaseController';
import querystring from 'querystring';

export default class AuthController extends BaseController {
  private readonly SIGN_IN_PATH: string = '/api/tokens';

  async signIn({ email, password }: UserData) {
    const encodedData = querystring.stringify({ email, password });
    return this._client.post(this.SIGN_IN_PATH, encodedData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}
