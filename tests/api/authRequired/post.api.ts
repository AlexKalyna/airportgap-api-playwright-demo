import { expect, test } from '@playwright/test';
import APIClient from '../../../src/client/APIClient';
import { getData } from '../../../src/data/dict/userData';
import AuthController from '../../../src/controllers/AuthController';
import Joi from 'joi';
import * as schemaPost from 'src/constants/apiResponseSchemas/postResponseSchemas';
import { getRandomAirportID, getRandomInvalidAirportID } from 'src/helpers/helpers';
import { airportIDs, notExistingAirportIDs } from 'src/data/airports';
import { ERROR_SCHEMA } from 'src/constants/apiResponseSchemas/errorResponseSchema';

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

  test.describe('Negative tests', () => {
    test('Invalid Airport ID (Non-Existent)', {
        tag: ['@N.3.1', '@regression']
      }, async () => {
        const airport1: string = getRandomAirportID(notExistingAirportIDs);
        const airport2: string = 'GKA';
        const response = await client.userAirports.calculateDistanceBetweenAirports(airport1, airport2);

        expect(response.status).toBe(422);
        expect(response.statusText).toBe('Unprocessable Entity');
        Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        expect(response.data.errors[0].detail).toBe(`Please enter valid 'from' and 'to' airports.`);
    });

    test('Malformed Airport IDs (Invalid Format)', {
        tag: ['@N.3.2', '@regression']
      }, async () => {
        const airport1: string = getRandomInvalidAirportID(airportIDs);
        const airport2: string = getRandomInvalidAirportID(airportIDs);
        const response = await client.userAirports.calculateDistanceBetweenAirports(airport1, airport2);

        expect(response.status).toBe(422);
        expect(response.statusText).toBe('Unprocessable Entity');
        Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        expect(response.data.errors[0].detail).toBe(`Please enter valid 'from' and 'to' airports.`);
    });

    test.fixme('Missing Airport IDs in Request Body', {
        annotation: {
            type: 'bug',
            description: 'https://bugtrackingtool.com/projectname/ATR-2131'
          },
        tag: ['@N.3.3', '@regression']
      }, async () => {
        const airport1: string = getRandomAirportID(airportIDs);
        const response = await client.userAirports.calculateDistanceBetweenAirports(airport1);

        expect(response.status).toBe(400);
        expect(response.statusText).toBe('Bad Request');
        Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        expect(response.data.errors[0].detail).toBe(`Fields 'from' and/or 'to' cannot be empty.`);
    });

    test.fixme('Empty Request Body', {
        annotation: {
            type: 'bug',
            description: 'https://bugtrackingtool.com/projectname/ATR-2132'
          },
        tag: ['@N.3.4', '@regression']
      }, async () => {
        const response = await client.userAirports.calculateDistanceBetweenAirports(undefined, undefined, true);

        expect(response.status).toBe(400);
        expect(response.statusText).toBe('Bad Request');
        Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        expect(response.data.errors[0].detail).toBe(`Fields 'from' and 'to' are required.`);
    });

    test('Identical Airport IDs (Same Airport)', {
        tag: ['@N.3.5', '@regression']
      }, async () => {
        const response = await client.userAirports.calculateDistanceBetweenAirports('GKA', 'GKA');

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        const distanse = response.data.data.attributes.kilometers;
        expect(distanse).toBe(0);
    });
    test('Invalid JSON Format', {
        tag: ['@N.3.6', '@regression']
      }, async () => {
        // TBD:
        // const airport1: string = getRandomAirportID(airportIDs);
        // const airport2: string = 'GKA';
        // const response = await client.userAirports.calculateDistanceBetweenAirports(airport1, airport2);

        // expect(response.status).toBe(200);
        // expect(response.statusText).toBe('OK');
        // Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));

    });

  });
});