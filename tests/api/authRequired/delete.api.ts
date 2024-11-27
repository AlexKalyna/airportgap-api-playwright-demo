import { expect, test } from '@playwright/test';
import APIClient from '../../../src/client/APIClient';
import { getData } from '../../../src/data/dict/userData';

let client: APIClient;

test.beforeAll(async () => {
  const authData = getData();
  client = await APIClient.authenticate(authData);
});

test.describe('API DELETE /favorites/clear_al', () => {
  test.describe('Positive tests', () => {
    test(
      'Clear all favorites for authenticated user',
      {
        tag: ['@P.13.1', '@smoke', '@regression']
      },
      async () => {
        const response = await client.userAirports.removeAllAirportsFromFavorites();

        expect(response.status).toBe(204);
        expect(response.statusText).toBe('No Content');
        expect(response.data).toBe('');
      }
    );
  });
  //TBD
  // test.describe('Negative tests', () => {
  //   test(
  //     'YOUR TEST NAME',
  //     {
  //       tag: ['@N.13.1', '@regression']
  //     },
  //     async () => {}
  //   );
  // });
});
