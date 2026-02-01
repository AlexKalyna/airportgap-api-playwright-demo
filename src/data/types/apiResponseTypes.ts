export interface ApiResponse<T = unknown> {
  status: number;
  statusText: string;
  data: T;
}

export interface FavoriteAirportData {
  data: {
    id: string;
    type: string;
    attributes: {
      airport: {
        id: number;
        name: string;
        city: string;
        country: string;
        iata: string;
        icao: string;
        latitude: string;
        longitude: string;
        altitude: number;
        timezone: string;
      };
      note: string;
    };
  };
}
