import axios, { AxiosInstance } from "axios";
import { config } from "../../config/config";

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
                return status < 501
            }
        });
    }
}