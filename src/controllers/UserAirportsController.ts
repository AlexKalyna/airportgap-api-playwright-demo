import { AirportData } from '../data/types/types';
import BaseController from './BaseController';
import querystring from 'querystring';

export default class UserAirportsController extends BaseController {
  private readonly USER_AIRPORTS_PATH = '/api/airports';

  private readonly USER_FAVOURITES_PATH = '/api/favorites';

  private readonly DEFAULT_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  private encodeBody(body: Record<string, string>): string {
    return Object.keys(body).length > 0 ? querystring.stringify(body) : '';
  }

  private async postRequest<T>(
    url: string,
    body: Record<string, string> = {},
    headers: Record<string, string> = {}
  ): Promise<T> {
    const encodedData = this.encodeBody(body);
    const requestHeaders = { ...this.DEFAULT_HEADERS, ...headers };
    return this._client.post(url, encodedData, { headers: requestHeaders });
  }

  async getUserAirports() {
    return this._client.get(this.USER_AIRPORTS_PATH);
  }

  async addFavoriteAirport(airportData: AirportData & { [key: string]: string }) {
    return this.postRequest(this.USER_AIRPORTS_PATH, airportData);
  }

  async addAirportToFavorites(body: Record<string, string> = {}, headers: Record<string, string> = {}) {
    return this.postRequest(this.USER_FAVOURITES_PATH, body, headers);
  }

  async removeAllAirportsFromFavorites(headers: Record<string, string> = {}) {
    return this._client.delete(`${this.USER_FAVOURITES_PATH}/clear_all`, headers);
  }

  async getFavouriteAirports(parameter: string = '/', headers: Record<string, string> = {}): Promise<unknown> {
    return this._client.get(this.USER_FAVOURITES_PATH + parameter, { headers });
  }

  async getFavouriteAirportById(airportId: string, headers: Record<string, string> = {}): Promise<unknown> {
    return this._client.get(`${this.USER_FAVOURITES_PATH}/${airportId}`, { headers });
  }
}
