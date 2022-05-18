const graphqlServer = require('../graphqlServer');
const {_electron: electron} = require('playwright');
const chai = require('chai')
const expect = chai.expect
const path = require('path');
const fs = require('fs');

let electronApp, page, num=0;

module.exports = () => {

  const setupFxn = function() {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      page = electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);

      await page.locator('button >> text=Clear Workspace').click();

    });
    
    // close Electron app when complete
    after(async () => {
      await electronApp.close();

      try {
        graphqlServer.close();
        console.log('graphqlServer closed');
      } catch (err) {
        console.error(err);
      }

    });

    afterEach(async function() {
      if (this.currentTest.state === 'failed') {
        console.log(`Screenshotting failed test window`)
        const imageBuffer = await page.screenshot();
        fs.writeFileSync(path.resolve(__dirname + '/../failedTests', `FAILED_${this.currentTest.title}.png`), imageBuffer)
      }
    });
  }

  describe('GraphQL Testing Controller', () => {
    setupFxn();

    // This will fill out the composer with a GraphQL request when invoked.
    const fillGQLRequest = async (
      url,
      method,
      body = '',
      variables = '',
      headers = [],
      cookies = []
    ) => {
      try {
        // click and check 
        await page.locator('button>> text=GRAPHQL').click();


        // click and select METHOD if it isn't QUERY
        if (method !== 'QUERY') {
          await page.locator('button#graphql-method').click();
          await page.locator(`div[id^="composer"] >> a >> text=${method}`).click();
        }

        // type in url
        await page.locator('#url-input').fill(url);

        // set headers
        headers.forEach(async ({ key, value }, index) => {
          await page.locator(`#header-row${index} >> [placeholder="Key"]`).fill(key);
          await page.locator(`#header-row${index} >> [placeholder="Value"]`).fill(value);
          await page.locator('#add-header').click();
        });

        // set cookies
        cookies.forEach(async ({ key, value }, index) => {
          await page.locator(`#cookie-row${index} >> [placeholder="Key"]`).fill(key);
          await page.locator(`#cookie-row${index} >> [placeholder="Value"]`).fill(value);
          await page.locator('#add-cookie').click();
        });


        // select Body, clear it, and type in query
        const codeMirror = await page.locator('#gql-body-entry');
        await codeMirror.click();
        const gqlBodyCode = await codeMirror.locator('.cm-content');

          try {
            await gqlBodyCode.fill('');
            await gqlBodyCode.fill(body);
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

    // This will add and send the most recent request in the workspace.
    const addAndSend = async (num) => {
      try {
        await page.locator('button >> text=Add to Workspace').click();
        await page.locator(`#send-button-${num}`).click();
      } catch (err) {
        console.error(err);
      }
    };

    // Bring in the Clear & Fill Test Script Area for improved code readability.
    const clearAndFillTestScriptArea = async (script) => {
      try {
        // click the view tests button to reveal the test code editor
        await page.locator('span >> text=View Tests').click();
        // set the value of the code editor to be some hard coded simple assertion tests
        
        const codeMirror2 = await page.locator('#test-script-entry');
        await codeMirror2.click();
        const scriptBody = await codeMirror2.locator('.cm-content');

        try {
          // for (let i = 0; i < 100; i += 1) {
          //   await scriptBody.press('Backspace');
          // }
          scriptBody.fill('')
          await scriptBody.fill(script);
        } catch (err) {
          console.error(err);
        }

        // Close the tests view pane.
        await page.locator('span >> text=Hide Tests').click();
      } catch (err) {
        console.error(err);
      }
    };


    it('it should be able to resolve a simple passing test', async () => {
      const method = 'QUERY';
      const url = 'https://countries.trevorblades.com/';
      const query = 'query($code: ID!) {country(code: $code) {capital}}';
      const variables = '{"code": "AE"}';
      const script = "assert.strictEqual(3, 3, 'Expect correct types.');";

      // type in url
      await fillGQLRequest(url, method, query, variables);
      await clearAndFillTestScriptArea(script);
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
      await clearAndFillTestScriptArea(script);
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
      await clearAndFillTestScriptArea(script);
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
  }).timeout(20000);
};
