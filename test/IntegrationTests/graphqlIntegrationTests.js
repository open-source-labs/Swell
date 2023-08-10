const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');
const {
  fillGQLBasicInfo,
  fillGQLRequest,
  addAndSend,
} = require('./testHelper');

let electronApp,
  page,
  num = 0;

  //TODO: Make an integration test that covers the state changes that occur in Mutation/Query 
    //check for test redundancy 
  
    //NOTE: There is only a POST Mutation set up in the local
    // mock API server


module.exports = () => {
  describe('GraphQL Integration Tests', function() {

    // open Electron App
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
    });

    // close Electron app when complete
    after(async () => {
      await electronApp.close();
    })

    // captures screenshot of browser when test case fails
    afterEach(async function () {
      if (this.currentTest.state === 'failed') {
        console.log(`Screenshotting failed test window`);
        const imageBuffer = await page.screenshot();
        fs.writeFileSync(
          path.resolve(
            __dirname + '/../failedTests',
            `FAILED_${this.currentTest.title}.png`
          ),
          imageBuffer
        );
      }
    });

    describe('GraphQL Query to API', () => {
      it('')
    });

  })

  const fillAndSendRequest = async (url, method, query, n, variables) => {
    await fillGQLRequest(page, url, method, query, variables);
    await addAndSend(page, n);
  };


};