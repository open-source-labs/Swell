// Confirm testing of request/response works for REST

const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');
const { clearAndFillTestScriptArea } = require('./testHelper');

let electronApp,
  page,
  num = 0;

module.exports = () => {
  describe('HTTP Assertion Testing', function () {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      await chai.request('http://localhost:3004').get('/clear').send();
    });

    // close Electron app when complete
    after(async () => {
      await page.locator('button >> text=Clear Workspace').click();
      await electronApp.close();
      await chai.request('http://localhost:3004').get('/clear').send();
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

    const fillRestRequest = async (
      url,
      method,
      body = '',
      headers = [],
      cookies = []
    ) => {
      try {
        // Make sure HTTP2 method is selected
        await page.locator('button>> text=HTTP/2').click();

        // click and select METHOD if it isn't GET
        if (method !== 'GET') {
          await page.locator('button#rest-method').click();
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

        // Add BODY as JSON if it isn't GET
        if (method !== 'GET') {
          // select body type JSON
          if ((await page.locator('#body-type-select').innerText()) === 'raw') {
            await page.locator('#raw-body-type').click();
            await page
              .locator('.dropdown-item >> text=application/json')
              .click();
          }

          // insert JSON content into body
          const codeMirror = await page.locator('#body-entry-select');
          await codeMirror.click();
          const restBody = await codeMirror.locator('.cm-content');

          try {
            restBody.fill('');
            await restBody.fill(body);
          } catch (err) {
            console.error(err);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    const addAndSend = async (num) => {
      try {
        await page.locator('button >> text=Add to Workspace').click();
        await page.locator(`#send-button-${num}`).click();
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

    describe('simple assertions w/ chai.assert and chai.expect', () => {
      before('Eatablish page', async () => {
        page = electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
      });

      it('a simple assertion (assert) should PASS when making a GET request', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script = "assert.strictEqual(3, 3, 'correct types');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);
        await page.locator('a >> text=Tests').click();

        const testStatus = await page
          .locator('#TestResult-0-status')
          .innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('a simple assertion (assert) should FAIL when making a GET request', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script = "assert.strictEqual(3, '3', 'wrong types');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);
        await page.locator('a >> text=Tests').click();

        const testStatus = await page
          .locator('#TestResult-0-status')
          .innerText();
        expect(testStatus).to.equal('FAIL');
      });

      it('a simple assertion (expect) should PASS when making a GET request', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script = "expect(3, 'correct types').to.equal(3);";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
        const testStatus = await page
          .locator('#TestResult-0-status')
          .innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('a simple assertion (expect) should FAIL when making a GET request', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script = "expect(3, 'correct types').to.equal('3');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
        const testStatus = await page
          .locator('#TestResult-0-status')
          .innerText();
        expect(testStatus).to.equal('FAIL');
      });

      it('should handle multiple different simple assert statements', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script =
          "assert.strictEqual(3, '3', 'wrong types');\nassert.strictEqual(3, '3', 'this assert is a message');\nassert.strictEqual(3, 3, 'correct types');\nassert.strictEqual(3, 3, 'this assert is a message');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
        const firstStatus = await page
          .locator('#TestResult-0-status')
          .innerText();
        const secondStatus = await page
          .locator('#TestResult-1-status')
          .innerText();
        const thirdStatus = await await page
          .locator('#TestResult-2-status')
          .innerText();
        const fourthStatus = await await page
          .locator('#TestResult-3-status')
          .innerText();

        expect(firstStatus).to.equal('FAIL');
        expect(secondStatus).to.equal('FAIL');
        expect(thirdStatus).to.equal('PASS');
        expect(fourthStatus).to.equal('PASS');
      });

      it('should handle multiple different simple expect statements', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script =
          "expect(3, 'wrong types').to.equal('3');\nexpect(3, 'this expect is a message').to.equal('3');\nexpect(3, 'correct types').to.equal(3);\nexpect(3, 'this expect is a message').to.equal(3);";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
        const firstStatus = await page
          .locator('#TestResult-0-status')
          .innerText();
        const secondStatus = await page
          .locator('#TestResult-1-status')
          .innerText();
        const thirdStatus = await await page
          .locator('#TestResult-2-status')
          .innerText();
        const fourthStatus = await await page
          .locator('#TestResult-3-status')
          .innerText();

        expect(firstStatus).to.equal('FAIL');
        expect(secondStatus).to.equal('FAIL');
        expect(thirdStatus).to.equal('PASS');
        expect(fourthStatus).to.equal('PASS');
      });
    });

    describe('Assertions on response object', () => {
      it('chai.assert: should be able to access the response object', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script = "assert.exists(response, 'response is object');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
        const testStatus = await page
          .locator('#TestResult-0-status')
          .innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('chai.assert: should be able to access the status code from the response object', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script =
          "assert.strictEqual(response.status, 200, 'response is 200');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
        const testStatus = await page
          .locator('#TestResult-0-status')
          .innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('chai.assert: should be able to access the cookies from the response object', async () => {
        const url = 'http://google.com';
        const method = 'GET';
        const script =
          "assert.exists(response.cookies, 'cookies exists on response object');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
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

      it('chai.assert: should be able to access the headers from the response object', async () => {
        const url = 'http://google.com';
        const method = 'GET';
        const script =
          "assert.exists(response.headers, 'headers exists on response object');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
        const testStatus = await new Promise((resolve) => {
          setTimeout(async () => {
            const text = await page.locator('#TestResult-0-status').innerText();
            resolve(text);
          }, 500);
        });

        expect(testStatus).to.equal('PASS');
      });

      it('chai.expect: should be able to access the response object', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script = "expect(response, 'response exists').to.exist;";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
        const testStatus = await page
          .locator('#TestResult-0-status')
          .innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('chai.expect: should be able to access the status code from the response object', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script =
          "expect(response.status, 'response is 200').to.equal(200);";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
        const testStatus = await page
          .locator('#TestResult-0-status')
          .innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('chai.expect: should be able to access the cookies from the response object', async () => {
        const url = 'http://google.com';
        const method = 'GET';
        const script =
          "expect(response.cookies, 'cookies exists on response object').to.exist;";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>

        const testStatus = await new Promise((resolve) => {
          setTimeout(async () => {
            const text = await page.locator('#TestResult-0-status').innerText();
            resolve(text);
          }, 500);
        });

        expect(testStatus).to.equal('PASS');
      });

      it('chai.expect: should be able to access the headers from the response object', async () => {
        const url = 'http://google.com';
        const method = 'GET';
        const script =
          "expect(response.headers, 'headers exists on reponse object').to.exist;";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>

        const testStatus = await new Promise((resolve) => {
          setTimeout(async () => {
            const text = await page.locator('#TestResult-0-status').innerText();
            resolve(text);
          }, 500);
        });

        expect(testStatus).to.equal('PASS');
      });
    });

    describe('Using variables', () => {
      it('Test results do not render if JavaScript is entered but specifically not assertion tests', async () => {
        const url = 'http://localhost:3004/book';
        const method = 'GET';
        const script = "const foo = 'bar';";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(page, script);
        await addAndSend(num++);

        await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
        const element = await page.locator('.empty-state-wrapper');
        expect(await element.count()).to.equal(1);
      });
    });
  }).timeout(20000);
};
