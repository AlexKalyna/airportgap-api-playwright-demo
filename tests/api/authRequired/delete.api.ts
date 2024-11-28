import { expect, test } from '@playwright/test';
import APIClient from '../../../src/client/APIClient';
import { getData } from '../../../src/data/dict/userData';
import faker from 'faker';
import * as helper from 'src/helpers/helpers';
import { airportIDs } from 'src/data/airports';

let client: APIClient;
let airoportNumericID: string;

test.beforeAll(async () => {
  const authData = getData();
  client = await APIClient.authenticate(authData);
});

test.beforeEach(async () => {
  const airportID = helper.getRandomAirportID(airportIDs);
  const note: string = faker.lorem.words();
  const requestBody = { airport_id: airportID, note: note };
  const postResponse = await client.userAirports.addAirportToFavorites(requestBody);
  expect(postResponse.status).toBe(201);
  airoportNumericID = postResponse.data.data.id;
});

test.describe('API DELETE /favorites/:id', () => {
  test.describe('Positive tests', () => {
    test(
      'Delete a favorite item by valid ID.',
      {
        tag: ['@P.9.1', '@smoke', '@regression']
      },
      async () => {
        const response = await client.userAirports.removeAirportFromFavoritesById(airoportNumericID);

        expect(response.status).toBe(204);
        expect(response.statusText).toBe('No Content');
        expect(response.data).toBe('');
      }
    );
  });
});

test.describe('API DELETE /favorites/clear_al', () => {
  test.describe('Positive tests', () => {
    test(
      'Clear all favorites for authenticated user',
      {
        tag: ['@P.10.1', '@smoke', '@regression']
      },
      async () => {
        const response = await client.userAirports.removeAllAirportsFromFavorites();

        expect(response.status).toBe(204);
        expect(response.statusText).toBe('No Content');
        expect(response.data).toBe('');
      }
    );
  });
});
