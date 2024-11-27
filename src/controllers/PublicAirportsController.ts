import BaseController from './BaseController';

export default class PublicAirportsController extends BaseController {
  private readonly AIRPORTS_PATH: string = '/api/airports';

  async getAirports(parameter: string = '/', headers: Record<string, string> = {}): Promise<unknown> {
    return this._client.get(this.AIRPORTS_PATH + parameter, { headers });
  }

  async getAirportById(airportId: string) {
    return this._client.get(`${this.AIRPORTS_PATH}/${airportId}`);
  }

  async wrongGetAirportById(airportId: string) {
    return this._client.post(`${this.AIRPORTS_PATH}/${airportId}`);
  }

  async calculateDistanceBetweenAirports(body: Record<string, string> = {}, headers: Record<string, string> = {}) {
    return this._client.post(`${this.AIRPORTS_PATH}/distance`, body, { headers });
  }

  async createToken(body: Record<string, string> = {}, headers: Record<string, string> = {}) {
    return this._client.post('/api/tokens', body, { headers });
  }
}
