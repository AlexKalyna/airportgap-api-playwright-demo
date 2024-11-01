import AuthController from '../controllers/AuthController';
import UserAirportsController from '../controllers/UserAirportsController';
import { config } from '../../config/config';
import { UserData } from '../data/types/types';

class APIClient {
  auth: AuthController;

  userAirports: UserAirportsController;

  constructor(options) {
    this.auth = new AuthController(options);
    this.userAirports = new UserAirportsController(options);
  }

  static async authenticate(userData: UserData, options = { baseURL: config.apiURL }) {
    const response = await new AuthController().signIn(userData);
    const token = response.data.token;
    return new APIClient({ ...options, authorization: `Bearer token=${token}` });
  }
}

export default APIClient;
