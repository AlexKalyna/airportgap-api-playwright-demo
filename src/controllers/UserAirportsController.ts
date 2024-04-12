import { AirportData } from '../data/types/types';
import BaseController from './BaseController';
import querystring from 'querystring';

export default class UserAirportsController extends BaseController {
  private readonly USER_AIRPORTS_PATH: string = '/api/airports';

  constructor(options: any) {
    super(options);
  }

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
}
