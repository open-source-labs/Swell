const {_electron: electron} = require('playwright');
const chai = require('chai')
const expect = chai.expect
const path = require('path');
const fs = require('fs-extra');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let electronApp, page, num=0;

module.exports = () => {

  const setupFxn = function() {
    beforeEach(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      page = electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);
    });
    
    // close Electron app when complete
    // after(async () => {
    //   await electronApp.close();
    // });

    afterEach(async function() {
      if (this.currentTest.state === 'failed') {
        console.log(`Screenshotting failed test window`)
        const imageBuffer = await page.screenshot();
        fs.writeFileSync(path.resolve(__dirname + '/../failedTests', `FAILED_${this.currentTest.title}.png`), imageBuffer)
      }
      await electronApp.close();

      // await page.locator('span >> text=Hide Tests').click();

    });
  }

  describe('HTTP Testing Controller', () => {
    setupFxn();

    const fillRestRequest = async (
      url,
      method,
      body = '',
      headers = [],
      cookies = []
    ) => {
      try {
        // click and check REST
        await page.locator('#selected-network').click();
        await page.locator('#composer >> a >> text=REST').click();

        // click and select METHOD if it isn't GET
        if (method !== 'GET') {
          await page.locator('#composer >> button.is-rest').click();
          await page.locator(`#composer >> a >> text=${method}`).click();
        }

        // type in url
        await page.locator('.input-is-medium').fill(url);

        // set headers
        headers.forEach(async ({ key, value }, index) => {
          await page.locator(`#header-row${index} >> [placeholder="Key"]`).fill(key);
          await page.locator(`#header-row${index} >> [placeholder="Value"]`).fill(value);
          await page.locator('button:near(:text("Headers"), 5)').click();
        });

        // set cookies
        cookies.forEach(async ({ key, value }, index) => {
          await page.locator(`#cookie-row${index} >> [placeholder="Key"]`).fill(key);
          await page.locator(`#cookie-row${index} >> [placeholder="Value"]`).fill(value);
          await page.locator('button:near(:text("Cookies"), 5)').click();
        });

        // Add BODY as JSON if it isn't GET
        if (method !== 'GET') {
          // select body type JSON
          await page.locator('span >> text=text/plain').click();
          await page.locator('a >> text=application/json').click();
          // insert JSON content into body
          const codeMirror = await page.locator('#body-entry-select');
          await codeMirror.click();
          const restBody = await codeMirror.locator('textarea');

          try {
            for (let i = 0; i < 100; i += 1) {
              await restBody.press('Backspace');
            }
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

    const clearAndFillTestScriptArea = async (script) => {
      try {
        // click the view tests button to reveal the test code editor
        await page.locator('span >> text=View Tests').click();
        // set the value of the code editor to be some hard coded simple assertion tests

        const codeMirror2 = await page.locator('#test-script-entry');
        await codeMirror2.click();
        const scriptBody = await codeMirror2.locator('textarea');

        try {
          for (let i = 0; i < 100; i += 1) {
            await scriptBody.press('Backspace');
          }
          await scriptBody.fill(script);
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        console.error(err);
      }
    };

    // ==================================================================

    describe('simple assertions w/ chai.assert and chai.expect', () => {
      before('CLEAR DB', (done) => {
        chai
          .request('http://localhost:3000')
          .get('/clear')
          .end((err, res) => {
            done(); // <= Call done to signal callback end
          });
      });

      after('CLEAR DB', (done) => {
        chai
          .request('http://localhost:3000')
          .get('/clear')
          .send()
          .end((err, res) => {
            done(); // <= Call done to signal callback end
          });
      });

      it('a simple assertion (assert) should PASS when making a GET request', async () => {
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script = "assert.strictEqual(3, 3, 'correct types');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!

        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('a simple assertion (assert) should FAIL when making a GET request', async () => {
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script = "assert.strictEqual(3, '3', 'wrong types');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('FAIL');
      });

      it('a simple assertion (expect) should PASS when making a GET request', async () => {
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script = "expect(3, 'correct types').to.equal(3);";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('a simple assertion (expect) should FAIL when making a GET request', async () => {
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script = "expect(3, 'correct types').to.equal('3');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('FAIL');
      });
    });

    describe('Multiple assertion statements', () => {
      it('should handle multiple different simple assert statements', async () => {
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script =
          "assert.strictEqual(3, '3', 'wrong types');\nassert.strictEqual(3, '3', 'this assert is a message');\nassert.strictEqual(3, 3, 'correct types');\nassert.strictEqual(3, 3, 'this assert is a message');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const firstStatus = await page.locator('#TestResult-0-status').innerText();
        const secondStatus = await page.locator('#TestResult-1-status').innerText();
        const thirdStatus = await await page.locator('#TestResult-2-status').innerText();
        const fourthStatus = await await page.locator('#TestResult-3-status').innerText();

        expect(firstStatus).to.equal('FAIL');
        expect(secondStatus).to.equal('FAIL');
        expect(thirdStatus).to.equal('PASS');
        expect(fourthStatus).to.equal('PASS');
      });

      it('should handle multiple different simple expect statements', async () => {
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script =
          "expect(3, 'wrong types').to.equal('3');\nexpect(3, 'this expect is a message').to.equal('3');\nexpect(3, 'correct types').to.equal(3);\nexpect(3, 'this expect is a message').to.equal(3);";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const firstStatus = await page.locator('#TestResult-0-status').innerText();
        const secondStatus = await page.locator('#TestResult-1-status').innerText();
        const thirdStatus = await await page.locator('#TestResult-2-status').innerText();
        const fourthStatus = await await page.locator('#TestResult-3-status').innerText();

        expect(firstStatus).to.equal('FAIL');
        expect(secondStatus).to.equal('FAIL');
        expect(thirdStatus).to.equal('PASS');
        expect(fourthStatus).to.equal('PASS');
      });
    });

    describe('Assertions on response object', () => {
      it('chai.assert: should be able to access the response object', async () => {
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script = "assert.exists(response, 'response is object');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('chai.assert: should be able to access the status code from the response object', async () => {
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script =
          "assert.strictEqual(response.status, 200, 'response is 200');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('chai.assert: should be able to access the cookies from the response object', async () => {
        const url = 'http://google.com';
        const method = 'GET';
        const script =
          "assert.exists(response.cookies, 'cookies exists on response object');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
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
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const testStatus = await new Promise((resolve) => {
          setTimeout(async () => {
            const text = await page.locator('#TestResult-0-status').innerText();
            resolve(text);
          }, 500);
        });

        expect(testStatus).to.equal('PASS');
      });

      it('chai.expect: should be able to access the response object', async () => {
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script = "expect(response, 'response exists').to.exist;";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('chai.expect: should be able to access the status code from the response object', async () => {
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script =
          "expect(response.status, 'response is 200').to.equal(200);";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const testStatus = await page.locator('#TestResult-0-status').innerText();
        expect(testStatus).to.equal('PASS');
      });

      it('chai.expect: should be able to access the cookies from the response object', async () => {
        const url = 'http://google.com';
        const method = 'GET';
        const script =
          "expect(response.cookies, 'cookies exists on response object').to.exist;";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!

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
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!

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
        const url = 'http://localhost:3000/book';
        const method = 'GET';
        const script = "const foo = 'bar';";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend(num);

        await page.locator('a >> text=Tests').click(); // THIS BREAKS EVERYTHING!!!!!!!!!!!!!!!!!
        const { selector } = await page.locator('.empty-state-wrapper');
        expect(selector).to.equal('.empty-state-wrapper');
      });
    });
  });
};
