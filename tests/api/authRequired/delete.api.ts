import { expect, test } from '@playwright/test';
import APIClient from '../../../src/client/APIClient';
import { getData } from '../../../src/data/dict/userData';
import AuthController from '../../../src/controllers/AuthController';

// let client: APIClient;

// test.beforeAll(async () => {
//   const authData = getData();
//   client = await APIClient.authenticate(authData);
// });

// test.describe('API GET', () => {
//   test.describe('Positive tests', () => {
//     test('Add favorite airport @smoke @regression', async () => {
//       const favoriteAirportData = {
//         airport_id: 'MAG',
//         notes: 'Random note'
//       };
//       const response = await client.userAirports.addFavoriteAirport(favoriteAirportData);

//       // console.log(response);

//       expect(response.status).toBe(200);
//       expect(response.statusText).toBe('OK');
//       // Joi.assert(await response.data, Joi.object(schema.START_CREATED_CALL_SCHEMA));
//     });
//   });

//   test('Return the first page of airports in the Airport Gap database @smoke @regression', async () => {
//     const response = await client.userAirports.getUserAirports();

//     expect(response.status).toBe(200);
//     expect(response.statusText).toBe('OK');
//     // Joi.assert(await response.data, Joi.object(schema.START_CREATED_CALL_SCHEMA));
//   });
// });
