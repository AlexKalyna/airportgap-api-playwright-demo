import { AirportData } from '../data/types/types';
import BaseController from './BaseController';
import querystring from 'querystring';

export default class UserAirportsController extends BaseController {
  private readonly USER_AIRPORTS_PATH: string = '/api/airports';
  // private readonly USER_FAVOURITES_PATH: string = '/favourites';

  async getUserAirports() {
    return this._client.get(this.USER_AIRPORTS_PATH);
  }

  async addFavoriteAirport(airportData: AirportData & { [key: string]: string }) {
    const encodedData = querystring.stringify(airportData);
    return this._client.post(this.USER_AIRPORTS_PATH, encodedData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  async calculateDistanceBetweenAirports(
    body: Record<string, string> = {},
    headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  ) {
    let encodedData = '';

    if (Object.keys(body).length > 0) {
      encodedData = querystring.stringify(body);
    }

    return this._client.post(`${this.USER_AIRPORTS_PATH}/distance`, encodedData, {
      headers
    });
  }
}
