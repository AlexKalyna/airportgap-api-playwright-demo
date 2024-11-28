import { expect, test } from '@playwright/test';
import APIClient from '../../../src/client/APIClient';
import { getData } from '../../../src/data/dict/userData';
import Joi from 'joi';
import * as schema from 'src/constants/apiResponseSchemas/patchResponseSchemas';
import faker from 'faker';
import * as helper from 'src/helpers/helpers';
import { airportIDs } from 'src/data/airports';

let client: APIClient;

test.beforeAll(async () => {
  const authData = getData();
  client = await APIClient.authenticate(authData);
});

test.afterAll(async () => {
  await client.userAirports.removeAllAirportsFromFavorites();
});

test.describe('API PATCH/favorites/:id', () => {
  test.describe('Positive tests', () => {
    test(
      'Update a favorite item with valid data.',
      {
        tag: ['@P.8.1', '@smoke', '@regression']
      },
      async () => {
        // Adding airport to favorites to make sure the list is not empty
        const airportID = helper.getRandomAirportID(airportIDs);
        const note: string = faker.lorem.words();
        const postRequestBody = { airport_id: airportID, note: note };
        const postResponse = await client.userAirports.addAirportToFavorites(postRequestBody);
        expect(postResponse.status).toBe(201);
        const airoportNumericID = postResponse.data.data.id;

        // Main test
        const requestBody = { note: faker.lorem.words() };
        const response = await client.userAirports.updateFavoriteAirport(airoportNumericID, requestBody);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        Joi.assert(await response.data, Joi.object(schema.PATCH_FAVORITE_AIRPORT_BY_ID_SCHEMA));
        expect(response.data.data.attributes.note).toBe(requestBody.note);
      }
    );
  });
});
