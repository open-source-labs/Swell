// Integration test for electron for spectron
// ****** use "npm run test-mocha" to run these tests ******

// import other tests
const appOpensTests = require('./subSuites/appOpens');
const reqInputTests = require('./subSuites/reqInputTests');
const httpTest = require('./subSuites/httpTest');
const websocketTest = require('./subSuites/websocketTest');
const grpcTest = require('./subSuites/grpcTest');
const graphqlTest = require('./subSuites/graphqlTest');

const httpTestingTest = require('./subSuites/httpTestingTest');
const graphqlTestingTest = require('./subSuites/graphqlTestingTest');
const grpcTestingTest = require('./subSuites/grpcTestingTest');

const app = require('./testApp');
const {_electron: electron} = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai')
const expect = chai.expect
const path = require('path');
const fs = require('fs-extra');

// Remove all files from "failedTests" directory on launching the tests, we want only the most recent test screenshots
fs.emptyDirSync(path.resolve(__dirname + '/failedTests'));

let electronApp, page;

describe('Electron UI Rendering', () => {
  
  // Launch electron app via Playwright
  before(async () => {
    electronApp = await electron.launch({ args: ['main.js'] });
  });
  
  // close Electron app when complete
  after(async () => {
    await electronApp.close();
  });

  // If the test fails, take a screenshot of the app and save it into the "failedTests" directory under the test title
  afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      console.log(`Screenshotting failed test window`)
      const window = await electronApp.firstWindow();
      const imageBuffer = await window.screenshot();
      fs.writeFileSync(path.resolve(__dirname + '/failedTests', `FAILED_${this.currentTest.title}.png`), imageBuffer)
    }
  });

  // -------------------------- All tests go below -----------------------------


  describe('Window rendering', () => {

    it('Electron app should launch', async () => {
      expect(electronApp).to.be.ok
    })

    it('Electron app should be a visible window', async () => {
      const window = await electronApp.firstWindow();
      pwTest.expect(window).toBeVisible();
    })

    it('App should only have 1 window (i.e. confirm devTools is not open)', async () => {
      expect(electronApp.windows().length).to.equal(1);
    });    
  });


  describe('DOM analysis', () => {
    before(async () => {
      page = electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);
    });

    it('Page title should be "Swell"', async () => {
      expect(await page.title()).to.equal('Swell');
    })
    
    it('Page should contain a composer div', async () => {
      expect(await page.locator('div#composer').count()).to.equal(1)
    });

    it('Page should contain a workspace div', async () => {
      expect(await page.locator('div#workspace').count()).to.equal(1)
    });

    it('Page should contain a responses div', async () => {
      expect(await page.locator('div#responses').count()).to.equal(1)
    });
  });

  // -------------------------- All tests go above -----------------------------

});

  // these are test suites within this broader suite
  // appOpensTests(); *** COMPLETE ***

  // // execute differnt types of test here
  describe('CRUD functionality', () => {
    reqInputTests();})
  //   // httpTest(); //Comment out because no Mongo URI for test server
  //   graphqlTest();
  //   websocketTest();
  //   grpcTest();
  // });

  // describe("Swell Testing functionality", function () {
  //   httpTestingTest();
  //   grpcTestingTest();
  //   graphqlTestingTest();
  // });

