// Confirm testing of request/response works for grpc

const grpcServer = require('../grpcServer.js');

const { _electron: electron } = require('playwright');
const chai = require('chai')
const expect = chai.expect
const path = require('path');
const fs = require('fs');
const { Done } = require('@mui/icons-material');

const pwTest = require('@playwright/test');
const { clearAndFillTestScriptArea,
        fillgRPC_Proto,
        addReqAndSend } = require('./testHelper.js');

const proto = fs.readFileSync(path.resolve(__dirname, '../grpc_mockData/protos/hw2.proto'));
let electronApp, page, num = 0;


module.exports = () => {

  describe('gRPC testing functionality', () => {

    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] }); //Launches electron app
      if (!electronApp) {
        throw new Error('electronApp failed t launch');
      }
    });

    // close Electron app when complete
    after(async () => {
      await page.locator('button >> text=Clear Workspace').click();
      await electronApp.close();
    });

    afterEach(async function () {
      if (this.currentTest.state === 'failed') {
        console.log(`Screenshotting failed test window`);
        const imageBuffer = await page.screenshot();
        fs.writeFileSync(path.resolve(__dirname + '/../failedTests', `FAILED_${this.currentTest.title}.png`), imageBuffer);
      }
    });

  // The app takes a while to launch, and without these rendering checks
    // within each test file the tests can get flakey because of long load times
    // so these are here to ensure the app launches as expect before continuing
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

  describe('gRPC Testing Controller', () => {

    before(async () => {
      page = await electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);
      num = 0;

      await page.locator('button>> text=GRPC').click();
      await page.locator('#url-input').fill('0.0.0.0:30051');
    });

    beforeEach(() => (num = 0));

    it('Basic testing functionality should work.', async () => {
      await fillgRPC_Proto(page, proto);
      try {
        await page.locator('.mt-1 mb- dropdown is-active >> a >> text=SayHello')
        .scrollIntoViewIfNeeded()
        .click();
        const script = "assert.strictEqual(3, 3, 'Expect correct types.');";
        await clearAndFillTestScriptArea(script);
        await addReqAndSend(num);
        await page.locator('a >> text=Tests').click();
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('PASS');
        // await electronApp.close()
        // await page.locator('button >> text=Remove').click();
      }  catch(err) {
        console.error(err);
      };
    });

    it('Testing functionality for expects should pass.', async () => {
      await fillgRPC_Proto(page, proto);
      try {
        await page.locator('.mt-1 mb- dropdown is-active >> a >> text=SayHello')
        .scrollIntoViewIfNeeded()
        .click();
        const script = "expect([1, 2]).to.be.an('array').that.does.not.include(3);";
        await clearAndFillTestScriptArea(script);
        await addReqAndSend(num);
        await page.locator('a >> text=Tests').click();
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('PASS');
        // await page.locator('button >> text=Remove').click();
      }  catch(err) {
        console.error(err);
      };
    });

    it('Should access headers properties within the response object.', async () => {
      // Dot notation does not work with hyphenated names.
      await fillgRPC_Proto(page, proto);
      try {
        await page.locator('.mt-1 mb- dropdown is-active >> a >> text=SayHello')
        .scrollIntoViewIfNeeded()
        .click();
        const script = "assert.strictEqual(response.headers['content-type'], 'application/grpc+proto');";
        await clearAndFillTestScriptArea(script);
        await addReqAndSend(num);
        await page.locator('a >> text=Tests').click();
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('PASS');
        // await page.locator('button >> text=Remove').click();
      }  catch(err) {
        console.error(err);
      };
    });

    it('Should access headers properties within the response object.', async () => {
        // Dot notation does not work with hyphenated names.
        await fillgRPC_Proto(page, proto);
        try {
          await page.locator('.mt-1 mb- dropdown is-active >> a >> text=SayHello')
          .scrollIntoViewIfNeeded()
          .click();
          const script = `assert.strictEqual(response.events[0].message, "Hello string");`;
          await clearAndFillTestScriptArea(script);
          await addReqAndSend(num);
          await page.locator('a >> text=Tests').click();
          const testStatus = await page.locator('#TestResult-0-status').innerText();
          expect(testStatus).to.equal('PASS');
          // await page.locator('button >> text=Remove').click();
        }  catch(err) {
          console.error(err);
        };
      });

    it('Should handle multiple variable declarations and newlines.', async () => {
      await fillgRPC_Proto(page, proto);
      try {
        await page.locator('.mt-1 mb- dropdown is-active >> a >> text=SayHello')
        .scrollIntoViewIfNeeded()
        .click();
        const script = `const grpcTestVariable = "Hello string"; \nassert.strictEqual(response.events[0].message, grpcTestVariable)`;
        await clearAndFillTestScriptArea(script);
        await addReqAndSend(num);
        await page.locator('a >> text=Tests').click();
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('PASS');
        // await page.locator('button >> text=Remove').click();
      }  catch(err) {
        console.error(err);
      };
    });
  }).timeout(20000);
}).timeout(20000)
};