// Confirm testing of request/response works for GraphQL
const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');
const {
  fillGQLRequest,
  addAndSend,
  clearAndFillTestScriptArea,
} = require('./testHelper');

let electronApp,
  page,
  num = 0;

module.exports = () => {
  describe('GraphQL Assertion Testing', function () {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
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
        fs.writeFileSync(
          path.resolve(
            __dirname + '/../failedTests',
            `FAILED_${this.currentTest.title}.png`
          ),
          imageBuffer
        );
      }
    });

    const fillAndSendRequest = async (
      url,
      method,
      query,
      script,
      n,
      variables
    ) => {
      await fillGQLRequest(page, url, method, query, variables);
      await clearAndFillTestScriptArea(page, script);
      await addAndSend(page, n);
    };

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

    describe('GraphQL Testing Controller', () => {
      before('Eatablish page', async () => {
        page = electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
      });

      it('it should be able to resolve a simple passing test', async () => {
        const method = 'QUERY';
        const url = 'https://countries.trevorblades.com/';
        const query = 'query($code: ID!) {country(code: $code) {capital}}';
        const variables = '{"code": "AE"}';
        const script = "assert.strictEqual(3, 3, 'Expect correct types.');";
        await fillAndSendRequest(url, method, query, script, num++, variables);

        // Select the Tests column inside of Responses pane.
        await page.locator('a >> text=Tests').click();

        const testStatus = await new Promise((resolve) => {
          setTimeout(async () => {
            const text = await page.locator('#TestResult-0-status').innerText();
            resolve(text);
          }, 500);
          // block for 500 ms since we need to wait for a response; normally test server would
          // respond fast enough since it is localhost and not a remote server
        });
        expect(testStatus).to.equal('PASS');
      });

      it('it should be able to resolve a simple failing test', async () => {
        const method = 'QUERY';
        const url = 'https://countries.trevorblades.com/';
        const query = 'query($code: ID!) {country(code: $code) {capital}}';
        const variables = '{"code": "AE"}';
        const script = "assert.strictEqual(3, 2, 'Expect failing test.');";
        await fillAndSendRequest(url, method, query, script, num++, variables);

        // Select the Tests column inside of Responses pane.
        await page.locator('a >> text=Tests').click();

        const testStatus = await new Promise((resolve) => {
          setTimeout(async () => {
            const text = await page.locator('#TestResult-0-status').innerText();
            resolve(text);
          }, 1000);
          // block for 500 ms since we need to wait for a response; normally test server would
          // respond fast enough since it is localhost and not a remote server
        });
        expect(testStatus).to.equal('FAIL');
      });

      it('it should be run test on response data', async () => {
        const method = 'QUERY';
        const url = 'https://countries.trevorblades.com/';
        const query = 'query($code: ID!) {country(code: $code) {capital}}';
        const variables = '{"code": "AE"}';
        const script =
          "expect(response.headers, 'headers exists on response object').to.exist;";
        await fillAndSendRequest(url, method, query, script, num++, variables);

        // Select the Tests column inside of Responses pane.
        await page.locator('a >> text=Tests').click();

        const testStatus = await new Promise((resolve) => {
          setTimeout(async () => {
            const text = await page.locator('#TestResult-0-status').innerText();
            resolve(text);
          }, 500);
          // block for 500 ms since we need to wait for a response; normally test server would
          // respond fast enough since it is localhost and not a remote server
        });
        expect(testStatus).to.equal('PASS');
      });
    });
  }).timeout(20000);
};
