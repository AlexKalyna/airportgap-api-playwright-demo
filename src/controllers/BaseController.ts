import axios, { AxiosInstance } from 'axios';
import { config } from '../../config/config';

export default class BaseController {
  protected _client: AxiosInstance;

  private readonly _baseUrl: string;

  constructor({ baseUrl = config.apiURL || 'undefined', authorization = '' } = {}) {
    this._baseUrl = baseUrl;
    this._client = axios.create({
      baseURL: this._baseUrl,
      headers: {
        Authorization: authorization
      },
      validateStatus: status => {
        return status < 501;
      }
    });

    // Add retry interceptor for rate limiting
    this._client.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 1;
          const delay = parseInt(retryAfter) * 1000;
          console.log(`Rate limited (429). Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this._client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }
}
