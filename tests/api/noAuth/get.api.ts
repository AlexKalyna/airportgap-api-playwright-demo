import Joi from 'joi';
import { expect, test } from '@playwright/test';
import PublicAirportsController from 'src/controllers/PublicAirportsController';
import * as schema from 'src/constants/apiResponseSchemas/getResponseSchemas';
import { ERROR_SCHEMA } from 'src/constants/apiResponseSchemas/errorResponseSchema';
import { getPageNumberFromURL, getRandomNumberInRange, getRandomAirportID } from 'src/helpers/helpers';
import { airportIDs, notExistingAirportIDs } from 'src/data/airports';

const publicClient = new PublicAirportsController();

test.describe('API GET/airports', () => {
  test.describe('Positive tests', () => {
    test(
      'Retrieve a list of all airports',
      {
        tag: ['@P.1.1', '@smoke', '@regression']
      },
      async () => {
        const response: any = await publicClient.getAirports();
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        Joi.assert(await response.data, Joi.object(schema.GET_ALL_AIRPORTS_SCHEMA));
      }
    );

    test(
      'Check pagination',
      {
        tag: ['@P.1.2', '@smoke', '@regression']
      },
      async () => {
        const pageNumber = getRandomNumberInRange(2, 203);
        const response: any = await publicClient.getAirports(`?page=${pageNumber}`);
        const selfLink: string = response.data.links.self;
        const responsePageNumber = getPageNumberFromURL(selfLink);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(responsePageNumber).toBe(pageNumber);
      }
    );
  });

  test.describe('Negative tests', () => {
    test.describe(
      'Invalid Pagination Parameters',
      {
        annotation: {
          type: 'bug',
          description: 'https://bugtrackingtool.com/projectname/ATR-2023'
        },
        tag: ['@N.1.1', '@regression']
      },
      () => {
        test.fail('page=-1', async () => {
          const response: any = await publicClient.getAirports(`?page=-1`);
          expect(response.status).toBe(400);
          expect(response.statusText).toBe('Bad Request');
        });
        test.fail('page=abc', async () => {
          const response: any = await publicClient.getAirports(`?page=-1`);
          expect(response.status).toBe(400);
          expect(response.statusText).toBe('Bad Request');
        });
      }
    );
    test(
      'Out-of-Range Pagination',
      {
        tag: ['@N.1.2', '@regression']
      },
      async () => {
        const response: any = await publicClient.getAirports(`?page=99999`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        // Assert that response.data.data is an empty array
        expect(response.data.data).toBeInstanceOf(Array);
        expect(response.data.data.length).toBe(0);
      }
    );

    test(
      'Unexpected Query Parameters',
      {
        tag: ['@N.1.3', '@regression']
      },
      async () => {
        const response: any = await publicClient.getAirports(`?randomParameter=badaboom123`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        Joi.assert(await response.data, Joi.object(schema.GET_ALL_AIRPORTS_SCHEMA));
      }
    );

    test.fail(
      'Incorrect Content-Type Header',
      {
        annotation: {
          type: 'bug',
          description: 'https://bugtrackingtool.com/projectname/ATR-2053'
        },
        tag: ['@N.1.4', '@regression']
      },
      async () => {
        const headers = {
          'Content-Type': 'application/xml' // Incorrect Content-Type header
        };
        const response: any = await publicClient.getAirports('/', headers);
        expect(response.status).toBe(415);
        expect(response.statusText).toBe('Unsupported Media Type');
      }
    );
  });
});

test.describe('API GET/airports/:id', () => {
  test.describe('Positive tests', () => {
    test(
      'Retrieve an airport by valid ID',
      {
        tag: ['@P.2.1', '@smoke', '@regression']
      },
      async () => {
        const airportId: string = getRandomAirportID(airportIDs);
        const response: any = await publicClient.getAirportById(airportId);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        Joi.assert(await response.data, Joi.object(schema.GET_AIRPORT_BY_ID_SCHEMA));
      }
    );

    test.describe('Negative tests', () => {
      test(
        'Invalid Airport ID (Non-Existent)',
        {
          tag: ['@N.2.1', '@regression']
        },
        async () => {
          const invalidAirportId: string = getRandomAirportID(notExistingAirportIDs);
          const response: any = await publicClient.getAirportById(invalidAirportId);
          expect(response.status).toBe(404);
          expect(response.statusText).toBe('Not Found');
          expect(response.data.errors[0].detail).toBe('The page you requested could not be found');
          Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        }
      );

      test.fail(
        'Malformed Airport ID',
        {
          annotation: {
            type: 'bug',
            description: 'https://bugtrackingtool.com/projectname/ATR-2058'
          },
          tag: ['@N.2.2', '@regression']
        },
        async () => {
          const response: any = await publicClient.getAirportById('1234');
          expect(response.status).toBe(400);
          expect(response.statusText).toBe('Bad Request');
          expect(response.data.errors[0].detail).toBe(`You've entered invalid airport ID`);
          Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        }
      );

      test.fail(
        'Special Characters in Airport ID',
        {
          annotation: {
            type: 'bug',
            description: 'https://bugtrackingtool.com/projectname/ATR-2059'
          },
          tag: ['@N.2.3', '@regression']
        },
        async () => {
          const response: any = await publicClient.getAirportById('#@$');
          expect(response.status).toBe(400);
          expect(response.statusText).toBe('Bad Request');
          expect(response.data.errors[0].detail).toBe(`You've entered invalid airport ID`);
          Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        }
      );

      test.fail(
        'SQL Injection Attempt in Airport ID',
        {
          annotation: {
            type: 'bug',
            description: 'https://bugtrackingtool.com/projectname/ATR-2060'
          },
          tag: ['@N.2.4', '@regression']
        },
        async () => {
          const response: any = await publicClient.getAirportById(`' OR '1'='1`);
          expect(response.status).toBe(400);
          expect(response.statusText).toBe('Bad Request');
          expect(response.data.errors[0].detail).toBe(`You've entered invalid airport ID`);
          Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        }
      );

      test.fail(
        'Method Not Allowed',
        {
          annotation: {
            type: 'bug',
            description: 'https://bugtrackingtool.com/projectname/ATR-2061'
          },
          tag: ['@N.2.4', '@regression']
        },
        async () => {
          const airportId: string = getRandomAirportID(airportIDs);
          const response: any = await publicClient.wrongGetAirportById(airportId);
          expect(response.status).toBe(405);
          expect(response.statusText).toBe('Method Not Allowed');
          expect(response.data.errors[0].detail).toBe('Only GET method allowed for this request');
          Joi.assert(await response.data, Joi.object(ERROR_SCHEMA));
        }
      );
    });
  });
});
