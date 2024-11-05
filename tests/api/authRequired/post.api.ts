import { expect, test } from '@playwright/test';
import APIClient from '../../../src/client/APIClient';
import { getData } from '../../../src/data/dict/userData';
import AuthController from '../../../src/controllers/AuthController';
import Joi from 'joi';
import * as schemaPost from 'src/constants/apiResponseSchemas/postResponseSchemas';
import { getRandomAirportID } from 'src/helpers/helpers';
import { airportIDs } from 'src/data/airports';

let client: APIClient;

test.beforeAll(async () => {
  const authData = getData();
  client = await APIClient.authenticate(authData);
});

test.describe('API POST/airports', () => {
  test.describe('Positive tests', () => {
    test('Calculate distance between two valid airports', {
        tag: ['@P.3.1', '@smoke', '@regression']
      }, async () => {

        const airport1: string = getRandomAirportID(airportIDs);
        const airport2: string = 'GKA';
        const response = await client.userAirports.calculateDistanceBetweenAirports(airport1, airport2);

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        Joi.assert(await response.data, Joi.object(schemaPost.AIRPORT_DISTANCE_SCHEMA));

        const distanse = response.data.data.attributes.kilometers;
        console.log(`Distance between ${airport1} and ${airport2} is: ${distanse} km`);
        expect(distanse).toBeGreaterThan(0);
        expect(typeof distanse).toBe('number');

    });
  });

//   test('Return the first page of airports in the Airport Gap database @smoke @regression', async () => {
//     const response = await client.userAirports.getUserAirports();

//     expect(response.status).toBe(200);
//     expect(response.statusText).toBe('OK');
//     // Joi.assert(await response.data, Joi.object(schema.START_CREATED_CALL_SCHEMA));
//   });
// });
});