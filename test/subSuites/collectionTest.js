/* this test file checks the app's ability to run tests on a collection of requests (via the workspace "Send Collection" button), 
as the subSuite and integration tests run tests on a single API call, tests are required into the testSuite.js file and called there */ 

/* the Send Collection functionality currently works for http requests if all requests in the collection are http, it does 
not work for graphQL requests */ 

const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');
const {
  isButtonDisabled,
  fillRestRequest,
  addAndSend,
} = require('./testHelper');
const { Console } = require('console');

let electronApp,
  page,
  num = 0;

module.exports = () => {

  describe('collectionTests', () => {
      
    /* these before and after functions run after each test suite, consider moving into the testSuite.js main file
    to limit the number of electron apps that have to launch to run the test suite */   
    before(async () => {
        electronApp = await electron.launch({ 
          args: ['main.js']
      });
    });
  
    after(async () => {
      await page.locator('button >> text=Clear Workspace').click();
      await electronApp.close();
    });

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
      
    /* The app takes a while to launch, and without these rendering checks within each test file the tests can get flakey because of long 
    load times so these are here to ensure the app launches as expect before continuing, all test files have these tests in them
    consider refactoring by moving them into the testSuite.js main file */
    describe('Window rendering', () => {
      it('Electron app should launch', async () => {
        expect(electronApp).to.be.ok;
      });

      it('Electron app should be a visible window', async () => {
        const window = await electronApp.firstWindow();
        pwTest.expect(window).toBeVisible();
      });

      it('App should only have 1 window (i.e. confirm devTools is not open)', async () => {
        expect(electronApp.windows().length).to.equal(1);
      });
    });

    /* test case 1: browser controller should add two http tests to the workspace, select "Send Collection", and receive valid responses for both tests  
    this test inconsistently works in isolation and fails when incorporated into the test suite, this is likely caused by an issue with the async functionality 
    I've commented out the collectionTest suite in testSuite.js file until this issue is resolved */ 
    describe('http collection tests', () => {
      before(async () => {
        page = electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
      });

      it('should GET information from two public APIs', async () => {
        const url1 = 'https://swapi.dev/api/people/1';
        const url2 = 'https://swapi.dev/api/people/2';
        const method = 'GET';

        try {
          await fillRestRequest(page, url1, method); 
          await page.locator('button >> text=Add to Workspace').click(); 
          await fillRestRequest(page, url2, method); 
          await page.locator('button >> text=Add to Workspace').click();  
          await page.locator('button >> text=Send Collection').click();

          // check that first request returned a 200 status and correct character information ("name": "Luke Skywalker")
          await page.waitForSelector('#view-button-0');  
          await page.locator('#view-button-0').click();      
          let statusCode = await page.locator('.status-tag').innerText();
          let events = await page.locator('#events-display >> .cm-content').innerText();
          expect(statusCode).to.equal('200');
          expect(events.slice(1, 100)).to.include('Luke Skywalker');

          // check that second request returned a 200 status and correct character information ("name": "C-3PO")
          await page.waitForSelector('#view-button-1'); 
          await page.locator('#view-button-1').click();
          statusCode = await page.locator('.status-tag').innerText();
          events = await page.locator('#events-display >> .cm-content').innerText();
          expect(statusCode).to.equal('200');
          expect(events.slice(1, 100)).to.include('C-3PO');
        }

        catch (err) {
          console.error(err);
        }
      });
    }); 
  });
}  
      
/* test case 2: browser controller should add two graphQL tests to the workspace, select "Send Collection", and receive valid responses for both tests */ 
/* test case 3: browser controller should add two grpc tests to the workspace, select "Send Collection", and receive valid responses for both tests */
/* test case 4: browser controller should add two websocket tests to the workspace, select "Send Collection", and receive valid responses for both tests */  
/* test case 5: browser controller should add 4 tests to the workspace of each API type, select "Send Collection", and receive valid responses for all tests */  