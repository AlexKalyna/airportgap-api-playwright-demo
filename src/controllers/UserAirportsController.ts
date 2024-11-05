import { AirportData } from '../data/types/types';
import BaseController from './BaseController';
import querystring from 'querystring';

export default class UserAirportsController extends BaseController {
  private readonly USER_AIRPORTS_PATH: string = '/api/airports';

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

  async calculateDistanceBetweenAirports(airport1: string, airport2: string) {
    const encodedData = querystring.stringify({
      "from": airport1,
      "to": airport2
    });
    return this._client.post(`${this.USER_AIRPORTS_PATH}/distance`, encodedData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}
