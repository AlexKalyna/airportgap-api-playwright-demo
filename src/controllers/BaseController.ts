import axios, { AxiosInstance } from 'axios';
import { config } from '../../config/config';

export default class BaseController {
  protected _client: AxiosInstance;

  private readonly _baseUrl: string;

  constructor({ baseUrl = config.apiURL, authorization = '' } = {}) {
    if (!baseUrl) {
      throw new Error('baseUrl is required. API_URL environment variable must be set.');
    }
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

    // Add request interceptor for debugging (only in CI)
    if (process.env.CI) {
      this._client.interceptors.request.use(
        config => {
          const fullUrl = `${config.baseURL}${config.url}`;
          console.log(`[API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
          return config;
        },
        error => Promise.reject(error)
      );
    }

    // Add retry interceptor for rate limiting
    this._client.interceptors.response.use(
      response => {
        // Log response in CI for debugging
        if (process.env.CI && (response.status >= 400 || response.status < 200)) {
          const fullUrl = `${response.config.baseURL}${response.config.url}`;
          console.log(`[API Response] ${response.status} ${response.statusText} - ${fullUrl}`);
        }
        return response;
      },
      async error => {
        // Log error responses in CI
        if (process.env.CI && error.response) {
          const fullUrl = `${error.config?.baseURL}${error.config?.url}`;
          console.log(`[API Error] ${error.response.status} ${error.response.statusText} - ${fullUrl}`);
        }
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
