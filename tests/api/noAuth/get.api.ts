import { AxiosHeaders } from './../../../node_modules/axios/index.d';
import Joi from 'Joi';
import { expect, test } from '@playwright/test';
import PublicAirportsController from 'src/controllers/PublicAirportsController';
import * as schema from 'src/constants/apiResponseSchemas/getResponseSchemas';
import { getPageNumberFromURL, getRandomNumberInRange } from 'src/helpers/helpers';

const publicClient = new PublicAirportsController();

test.describe('API GET/airports', () => {
  test.describe('Positive tests', () => {
    test('Retrieve a list of all airports ',{
        tag: ['@P.1.1', '@smoke', '@regression']
      }, async () => {
        const response: any = await publicClient.getAirports();
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        Joi.assert(await response.data, Joi.object(schema.GET_ALL_AIRPORTS_SCHEMA));
    });

    test('Check pagination',{
        tag: ['@P.1.2', '@regression']
      }, async () => {
        const pageNumber = getRandomNumberInRange(2, 203);
        const response: any = await publicClient.getAirports(`?page=${pageNumber}`);
        const selfLink: string = response.data.links.self;
        const responsePageNumber = getPageNumberFromURL(selfLink);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(responsePageNumber).toBe(pageNumber);
    });
  });
  
  test.describe('Negative tests', () => {
    test.describe('Invalid Pagination Parameters', {
      annotation: {
        type: 'bug',
        description: 'https://bugtrackingtool.com/projectname/ATR-2023'
      },
       tag: ['@N.1.1', '@regression']
      }, () => {
        test.fail('page=-1', async () => {
          const response: any = await publicClient.getAirports(`?page=-1`);
          expect(response.status).toBe(400);
          expect(response.statusText).toBe('Bad Request');
        }),
        test.fail('page=abc', async () => {
          const response: any = await publicClient.getAirports(`?page=-1`);
          expect(response.status).toBe(400);
          expect(response.statusText).toBe('Bad Request');
        });
      });
      test('Out-of-Range Pagination',{
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

      test('Unexpected Query Parameters',
        {
          tag: ['@N.1.3', '@regression']
        },
        async () => {
          const response: any = await publicClient.getAirports(`?randomParameter=badaboom123`);
          expect(response.status).toBe(200);
          expect(response.statusText).toBe('OK');
          Joi.assert(await response.data, Joi.object(schema.GET_ALL_AIRPORTS_SCHEMA));
        });

        test.fail('Incorrect Content-Type Header', {
          annotation: {
            type: 'bug',
            description: 'https://bugtrackingtool.com/projectname/ATR-2053'
          },
           tag: ['@N.1.4', '@regression']
        }, async () => {
          const headers = {
            'Content-Type': 'application/xml' // Incorrect Content-Type header
          };
          const response: any = await publicClient.getAirports('/', headers);
          expect(response.status).toBe(415);
          expect(response.statusText).toBe('Unsupported Media Type');
      });
    });
  });