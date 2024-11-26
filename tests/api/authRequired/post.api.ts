import { expect, test, request } from '@playwright/test';
import faker from 'faker';
import APIClient from '../../../src/client/APIClient';
import { getData } from '../../../src/data/dict/userData';
import Joi from 'joi';
import * as schemaPost from 'src/constants/apiResponseSchemas/postResponseSchemas';
import { getRandomAirportID, getRandomInvalidAirportID } from 'src/helpers/helpers';
import * as helper from 'src/helpers/helpers';
import { airportIDs, notExistingAirportIDs } from 'src/data/airports';
import { ERROR_SCHEMA } from 'src/constants/apiResponseSchemas/errorResponseSchema';
import { config } from 'config/config';

let client: APIClient;

test.beforeAll(async () => {
  const authData = getData();
  client = await APIClient.authenticate(authData);
});

test.describe('API POST/airports', () => {
  test.describe('Positive tests', () => {
    test(
      'Calculate distance between two valid airports',
      {
        tag: ['@P.3.1', '@smoke', '@regression']
      },
      async () => {
        const airport1: string = getRandomAirportID(airportIDs);
        const airport2: string = 'GKA';
        const requestBody = { from: airport1, to: airport2 };
        const response = await client.userAirports.calculateDistanceBetweenAirports(requestBody);

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        Joi.assert(await response.data, Joi.object(schemaPost.AIRPORT_DISTANCE_SCHEMA));

        const distanse = response.data.data.attributes.kilometers;
        expect(distanse).toBeGreaterThan(0);
        expect(typeof distanse).toBe('number');
        console.log(`Distance between ${airport1} and ${airport2} is: ${distanse} km`);
      }
    );
  });

  test.describe('Negative tests', () => {
    test(
      'Invalid Airport ID (Non-Existent)',
      {
        tag: ['@N.3.1', '@regression']
      },
      async () => {
        const airport1: string = getRandomAirportID(notExistingAirportIDs);
        const airport2: string = 'GKA';
        const requestBody = { from: airport1, to: airport2 };
        const response = await client.userAirports.calculateDistanceBetweenAirports(requestBody);

        expect(response.status).toBe(422);
        expect(response.statusText).toBe('Unprocessable Entity');
        Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        expect(response.data.errors[0].detail).toBe(`Please enter valid 'from' and 'to' airports.`);
      }
    );

    test(
      'Malformed Airport IDs (Invalid Format)',
      {
        tag: ['@N.3.2', '@regression']
      },
      async () => {
        const airport1: string = getRandomInvalidAirportID(airportIDs);
        const airport2: string = getRandomInvalidAirportID(airportIDs);
        const requestBody = { from: airport1, to: airport2 };
        const response = await client.userAirports.calculateDistanceBetweenAirports(requestBody);

        expect(response.status).toBe(422);
        expect(response.statusText).toBe('Unprocessable Entity');
        Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        expect(response.data.errors[0].detail).toBe(`Please enter valid 'from' and 'to' airports.`);
      }
    );

    test.fixme(
      'Missing Airport IDs in Request Body',
      {
        annotation: {
          type: 'bug',
          description: 'https://bugtrackingtool.com/projectname/ATR-2131'
        },
        tag: ['@N.3.3', '@regression']
      },
      async () => {
        const airport1: string = getRandomAirportID(airportIDs);
        const requestBody = { from: airport1, to: '' };
        const response = await client.userAirports.calculateDistanceBetweenAirports(requestBody);

        expect(response.status).toBe(400);
        expect(response.statusText).toBe('Bad Request');
        Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        expect(response.data.errors[0].detail).toBe(`Fields 'from' and/or 'to' cannot be empty.`);
      }
    );

    test.fixme(
      'Empty Request Body',
      {
        annotation: {
          type: 'bug',
          description: 'https://bugtrackingtool.com/projectname/ATR-2132'
        },
        tag: ['@N.3.4', '@regression']
      },
      async () => {
        const response = await client.userAirports.calculateDistanceBetweenAirports();

        expect(response.status).toBe(400);
        expect(response.statusText).toBe('Bad Request');
        Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        expect(response.data.errors[0].detail).toBe(`Fields 'from' and 'to' are required.`);
      }
    );

    test(
      'Identical Airport IDs (Same Airport)',
      {
        tag: ['@N.3.5', '@regression']
      },
      async () => {
        const requestBody = { from: 'GKA', to: 'GKA' };
        const response = await client.userAirports.calculateDistanceBetweenAirports(requestBody);

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        const distanse = response.data.data.attributes.kilometers;
        expect(distanse).toBe(0);
      }
    );
    test.fixme(
      'Invalid JSON Format',
      {
        annotation: {
          type: 'bug',
          description: 'https://bugtrackingtool.com/projectname/ATR-2137'
        },
        tag: ['@N.3.6', '@regression']
      },
      async () => {
        const airport1: string = getRandomAirportID(airportIDs);
        const airport2: string = 'GKA';
        const requestBody = { from: `(${airport1}, ()to: ${airport2})` };
        const response = await client.userAirports.calculateDistanceBetweenAirports(requestBody);
        expect(response.status).toBe(400);
        expect(response.statusText).toBe('Bad Request');
        Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        expect(response.data.errors[0].detail).toBe('Invalid JSON structure.');
      }
    );
    test.fixme(
      'Unauthorized Request',
      {
        annotation: {
          type: 'bug',
          description: 'https://bugtrackingtool.com/projectname/ATR-2142'
        },
        tag: ['@N.3.7', '@regression']
      },
      async () => {
        const airport1: string = getRandomAirportID(airportIDs);
        const airport2: string = 'GKA';
        const requestBody = { from: airport1, to: airport2 };
        const requestHeaders = { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: '' };
        const requestContext = await request.newContext();
        const response = await requestContext.post(config.apiURL + '/airports/distance', {
          data: requestBody,
          headers: requestHeaders
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(401);
        expect(response.statusText).toBe('Unauthorized');
        expect(responseBody.errors[0].detail).toBe('Authentification failed.');
      }
    );
    test.fixme(
      'Unsupported Media Type',
      {
        annotation: {
          type: 'bug',
          description: 'https://bugtrackingtool.com/projectname/ATR-2143'
        },
        tag: ['@N.3.8', '@regression']
      },
      async () => {
        const airport1: string = getRandomAirportID(airportIDs);
        const airport2: string = 'GKA';
        const requestBody = { from: airport1, to: airport2 };
        const requestHeaders = { 'Content-Type': 'atext/plain' };
        const response = await client.userAirports.calculateDistanceBetweenAirports(requestBody, requestHeaders);
        expect(response.status).toBe(400);
        expect(response.statusText).toBe('Bad Request');
        Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        expect(response.data.errors[0].detail).toBe(
          `Unsupported content type. Use "application/x-www-form-urlencoded" instead.`
        );
      }
    );
  });
  test.describe('API POST/token', () => {
    test.describe('Positive tests', () => {
      test(
        'Create a new token with valid credentials',
        {
          tag: ['@P.4.1', '@smoke', '@regression']
        },
        async () => {
          // const email: string = config.httpCredentials.email;
          // const password: string = config.httpCredentials.password;
          const requestBody = { email: 'test@airportgap.com', password: 'airportgappassword' };

          const requestHeaders = { Authorization: '' };
          const response = await client.userAirports.createToken(requestBody, requestHeaders);
          expect(response.status).toBe(200);
          expect(response.statusText).toBe('OK');
          Joi.assert(await response.data, Joi.object(schemaPost.USER_TOKEN_SCHEMA));
        }
      );
    });

    test.describe('Negative tests', () => {
      test(
        'Missing Credentials)',
        {
          tag: ['@N.4.1', '@regression']
        },
        async () => {}
      );
    });
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
});
