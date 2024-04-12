import BaseController from './BaseController';

export default class PublicAirportsController extends BaseController {
  private readonly AIRPORTS_PATH: string = '/api/airports';

  async getAirports(): Promise<unknown> {
    return this._client.get(this.AIRPORTS_PATH);
  }

  async getAirportById(airportId: string) {
    return this._client.get(`${this.AIRPORTS_PATH}/${airportId}`);
  }
}
