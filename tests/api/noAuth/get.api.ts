import { expect, test } from '@playwright/test';
import PublicAirportsController from 'src/controllers/PublicAirportsController';


const publicClient = new PublicAirportsController();

// test.beforeAll(async () => {
//     client = await APIClient.createNewCallAndLogin(callTypes.vrObservation);
//     callUuid = SessionData.getCallUuid();
//     console.log('CallUuid: ' + callUuid);
//     const startCalldata = {
//         status: 'active'
//     };
//     const response = await client.call.startCreatedCall(startCalldata, callUuid);
// });

test.describe('API GET', () => {
  test.describe('Positive tests', () => {
    test('Return the first page of airports in the Airport Gap database @smoke @regression', async () => {
      const response = await publicClient.getAirports();
      console.log(response);

      // expect(response.status).toBe(200);
      // expect(response.statusText).toBe('OK');
      // Joi.assert(await response.data, Joi.object(schema.START_CREATED_CALL_SCHEMA));
    });
  });
});
