import { expect, test } from '@playwright/test';
import faker from 'faker';
import APIClient from '../../../src/client/APIClient';
import { getData } from '../../../src/data/dict/userData';
import Joi from 'joi';
import * as schemaPost from 'src/constants/apiResponseSchemas/postResponseSchemas';
import * as helper from 'src/helpers/helpers';
import { airportIDs } from 'src/data/airports';

let client: APIClient;

test.beforeAll(async () => {
  const authData = getData();
  client = await APIClient.authenticate(authData);
});

test.describe('API POST/favorites', () => {
  test.describe('Positive tests', () => {
    test.beforeEach('Remove all favorite airports', async () => {
      const response = await client.userAirports.removeAllAirportsFromFavorites();
      expect(response.status).toBe(204);
    });
    test(
      'Add a new favorite item with valid data',
      {
        tag: ['@P.7.1', '@smoke', '@regression']
      },
      async () => {
        const airportID = helper.getRandomAirportID(airportIDs);
        const note: string = faker.lorem.words();
        const requestBody = { airport_id: airportID, note: note };
        const response = await client.userAirports.addAirportToFavorites(requestBody);

        expect(response.status).toBe(201);
        expect(response.statusText).toBe('Created');
        Joi.assert(await response.data, Joi.object(schemaPost.USER_FAVORITES_SCHEMA));
        expect(response.data.data.attributes.note).toBe(note);
        expect(response.data.data.attributes.airport.iata).toBe(airportID);
      }
    );
  });

  //  TBD
  //     test.describe('Negative tests', () => {
  //       test(
  //         'Attempt to add a favorite item without authentication',
  //         {
  //           tag: ['@N.7.1', '@regression']
  //         },
  //         async () => {}
  //       );
  //     });
});
