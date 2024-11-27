import { expect, test } from '@playwright/test';
import APIClient from '../../../src/client/APIClient';
import { getData } from '../../../src/data/dict/userData';
import Joi from 'joi';
import * as schema from 'src/constants/apiResponseSchemas/getResponseSchemas';
import faker from 'faker';
import * as helper from 'src/helpers/helpers';
import { airportIDs } from 'src/data/airports';

let client: APIClient;

test.beforeAll(async () => {
  const authData = getData();
  client = await APIClient.authenticate(authData);
});

test.describe('API GET/favorites', () => {
  test.describe('Positive tests', () => {
    test(
      'Returns all the favorite airports saved to your Airport Gap account.',
      {
        tag: ['@P.5.1', '@smoke', '@regression']
      },
      async () => {
        // Adding airport to favorites to make sure the list is not empty
        const airportID = helper.getRandomAirportID(airportIDs);
        const note: string = faker.lorem.words();
        const requestBody = { airport_id: airportID, note: note };
        const postResponse = await client.userAirports.addAirportToFavorites(requestBody);
        expect(postResponse.status).toBe(201);
        // Main test
        const response = await client.userAirports.getFavouriteAirports();
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        Joi.assert(await response.data, Joi.object(schema.GET_FAVORITE_AIRPORTS_SCHEMA));
      }
    );
    test(
      'Returns empty list if no favorite airports saved to your Airport Gap account.',
      {
        tag: ['@P.5.2', '@smoke', '@regression']
      },
      async () => {
        // Removing all airports from favorites to make sure the list is empty
        const postResponse = await client.userAirports.removeAllAirportsFromFavorites();
        expect(postResponse.status).toBe(204);
        // Main test
        const response = await client.userAirports.getFavouriteAirports();
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        Joi.assert(await response.data, Joi.object(schema.GET_AIRPORTS_EMPTY_SCHEMA));
      }
    );
    //   });

    //   test('Return the first page of airports in the Airport Gap database @smoke @regression', async () => {
    //     const response = await client.userAirports.getUserAirports();

    //     expect(response.status).toBe(200);
    //     expect(response.statusText).toBe('OK');
    //     // Joi.assert(await response.data, Joi.object(schema.START_CREATED_CALL_SCHEMA));
  });
});
