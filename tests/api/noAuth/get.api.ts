import { AxiosHeaders } from './../../../node_modules/axios/index.d';
import Joi from 'Joi';
import { expect, test } from '@playwright/test';
import PublicAirportsController from 'src/controllers/PublicAirportsController';
import * as schema from 'src/constants/apiResponseSchemas/getResponseSchemas';
import { getPageNumberFromURL, getRandomNumberInRange } from 'src/helpers/helpers';

const publicClient = new PublicAirportsController();

test.describe('API GET/airports', () => {
  test.describe('Positive tests', () => {
    test('Retrieve a list of all airports @smoke @regression', async () => {
      const response: any = await publicClient.getAirports();
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      Joi.assert(await response.data, Joi.object(schema.GET_ALL_AIRPORTS_SCHEMA));
    });

    test('Check pagination @regression', async () => {
      const pageNumber = getRandomNumberInRange(2, 203);
      const response: any = await publicClient.getAirports(`?page=${pageNumber}`);
      const selfLink: string = response.data.links.self;
      const responsePageNumber = getPageNumberFromURL(selfLink);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(responsePageNumber).toBe(pageNumber);
    });

  test.describe('Negative tests', () => {

    //TBD

  });

    // test('Retrieve an airport by ID @smoke @regression', async () => {
    //   const response:any = await publicClient.getAirportById(1);
    //   console.log(response.data.data);

    //   expect(response.status).toBe(200);
    //   expect(response.statusText).toBe('OK');
    //   Joi.assert(await response.data, Joi.object(schema.GET_AIRPORT_BY_ID_SCHEMA));
    // });
  });
});

