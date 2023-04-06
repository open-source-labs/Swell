// Confirm testing of request/response works for GraphQL
const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');
const { clearAndFillTestScriptArea } = require('./testHelper');

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

    const fillGQLBasicInfo = async (
      url,
      method,
      headers = [],
      cookies = []
    ) => {
      try {
        // click and check GRAPHQL
        await page.locator('button>> text=GraphQL').click();

        // click and select METHOD if it isn't QUERY
        if (method !== 'QUERY') {
          await page.locator('button#graphql-method').click();
          await page
            .locator(`div[id^="composer"] >> a >> text=${method}`)
            .click();
        }

        // type in url
        await page.locator('#url-input').fill(url);

        // set headers
        headers.forEach(async ({ key, value }, index) => {
          await page
            .locator(`#header-row${index} >> [placeholder="Key"]`)
            .fill(key);
          await page
            .locator(`#header-row${index} >> [placeholder="Value"]`)
            .fill(value);
          await page.locator('#add-header').click();
        });

        // set cookies
        cookies.forEach(async ({ key, value }, index) => {
          await page
            .locator(`#cookie-row${index} >> [placeholder="Key"]`)
            .fill(key);
          await page
            .locator(`#cookie-row${index} >> [placeholder="Value"]`)
            .fill(value);
          await page.locator('#add-cookie').click();
        });
      } catch (err) {
        console.error(err);
      }
    };

    const fillGQLRequest = async (
      url,
      method,
      query = '',
      variables = '',
      headers = [],
      cookies = []
    ) => {
      try {
        await fillGQLBasicInfo(url, method, headers, cookies);

        // select Body, clear it, and type in query
        const codeMirror = await page.locator('#gql-body-entry');
        await codeMirror.click();
        const gqlBodyCode = await codeMirror.locator('.cm-content');

        try {
          await gqlBodyCode.fill('');
          await gqlBodyCode.fill(query);
        } catch (err) {
          console.error(err);
        }

        // select Variables and type in variables
        const codeMirror2 = await page.locator('#gql-var-entry');
        await codeMirror2.click();
        await codeMirror2.locator('.cm-content').fill(variables);
      } catch (err) {
        console.error(err);
      }
    };

    const addAndSend = async (n) => {
      try {
        await page.locator('button >> text=Add to Workspace').click();
        await page.locator(`#send-button-${n}`).click();
      } catch (err) {
        console.error(err);
      }
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

        // type in url
        await fillGQLRequest(url, method, query, variables);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

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

        // type in url
        await fillGQLRequest(url, method, query, variables);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

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

        // type in url
        await fillGQLRequest(url, method, query, variables);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

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
