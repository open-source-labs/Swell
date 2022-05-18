const graphqlServer = require('../graphqlServer');
const {_electron: electron} = require('playwright');
const chai = require('chai')
const expect = chai.expect
const path = require('path');
const fs = require('fs-extra');

let electronApp, page, num;

module.exports = () => {

  const setupFxn = function() {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      page = electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);

      await page.locator('button >> text=Clear Workspace').click();
      num=0
    });
    
    // close Electron app when complete
    after(async () => {
      await electronApp.close();

      try {
        // graphqlServer.close();
        // console.log('graphqlServer closed');
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


  describe('GraphQL requests', () => {
    setupFxn();

    
    const fillGQLRequest = async (
      url,
      method,
      query = '',
      variables = '',
      headers = [],
      cookies = []
    ) => {
      try {
        // click and check GRAPHQL
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

    const addAndSend = async (num) => {
      try {
        await page.locator('button >> text=Add to Workspace').click();
        await page.locator(`#send-button-${num}`).click();
      } catch (err) {
        console.error(err);
      }
    };



    it('it should be able to introspect the schema (PUBLIC API)', async () => {
      try {
        // click and check GRAPHQL
        await page.locator('button>> text=GRAPHQL').click();

        // type in url
        await page.locator('#url-input').fill('https://countries.trevorblades.com/');

        // click introspect
        await page.locator('button >> text=Introspect').click();

        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const introspectionResult = await page.locator('#gql-introspection >> .cm-content')
              expect(await introspectionResult.count()).to.equal(1)
              expect(await introspectionResult.innerText()).to.include('directive');
              resolve();
            } catch (err) {
              console.error(err);
            }
          }, 1000);
        });
      } catch (err) {
        console.error(err);
      }
    }).timeout(20000);

    it('it should be able to create queries using variables (PUBLIC API)', async () => {
      try {
        const method = 'QUERY';
        const url = 'https://countries.trevorblades.com/';
        const query = 'query($code: ID!) {country(code: $code) {capital}}';
        const variables = '{"code": "AE"}';

        // type in url
        await fillGQLRequest(url, method, query, variables);
        await addAndSend(num++);

        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const events = await page.locator('#events-display >> .cm-content')
              expect(await events.count()).to.equal(1)
              expect(await events.innerText()).to.include('Abu Dhabi');
              resolve();
            } catch (err) {
              console.error(err);
            }
          }, 1000);
        });
      } catch (err) {
        console.error(err);
      }
    }).timeout(5000);

    it('it should give you the appropriate error message with incorrect queries (LOCAL API)', async () => {
      try {
        const method = 'QUERY';
        const url = 'http://localhost:4000/graphql';
        const query = 'query {feed {descriptions}}';

        // type in url
        await fillGQLRequest(url, method, query);
        await addAndSend(num++);

        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const statusCode = await page.locator('.status-tag').innerText();
              
              const events = await page.locator('#events-display >> .cm-content')
              expect(await events.count()).to.equal(1)

              expect(statusCode).to.equal('Error');
              expect(await events.innerText()).to.include('"message": "Cannot query field');
              resolve();
            } catch (err) {
              console.error(err);
            }
          }, 1000);
        });
      } catch (err) {
        console.error(err);
      }
    }).timeout(5000);

    it('it should work with mutations (LOCAL API)', async () => {
      try {
        const method = 'MUTATION';
        const url = 'http://localhost:4000/graphql';
        const query =
          'mutation {post(url: "www.piedpiper.com" description: "Middle-out compression") {url}}';

        // type in url
        await fillGQLRequest(url, method, query);
        await addAndSend(num++);

        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const statusCode = await page.locator('.status-tag').innerText();

              const events = await page.locator('#events-display >> .cm-content')
              expect(await events.count()).to.equal(1)

              expect(statusCode).to.equal('Success');
              expect(await events.innerText()).to.include('www.piedpiper.com');
              resolve();
            } catch (err) {
              console.error(err);
            }
          }, 1000);
        });
      } catch (err) {
        console.error(err);
      }
    }).timeout(5000);

    it('it should work with subscriptions (LOCAL API)', async () => {
      try {
        // START SUBSCRIPTION
        const method = 'SUBSCRIPTION';
        const url = 'http://localhost:4000/graphql';
        const query = 'subscription {newLink {id description}}';

        await fillGQLRequest(url, method, query);
        await addAndSend(num++);

        // SEND MUTATION
        const method2 = 'MUTATION';
        const url2 = 'http://localhost:4000/graphql';
        const query2 =
          'mutation {post(url: "www.gavinbelson.com" description: "Tethics") {url}}';

        await fillGQLRequest(url2, method2, query2);
        await addAndSend(num++);

        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              await page.locator(`#view-button-${num-2}`).click();

              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page.locator('#events-display >> .cm-content')
              expect(await events.count()).to.equal(1)

              expect(statusCode).to.equal('Success');
              expect(await events.innerText()).to.include('Tethics');
              resolve();
            } catch (err) {
              console.error(err);
            }
          }, 1000);
        });
      } catch (err) {
        console.error(err);
      }
    });
  }).timeout(20000);

}
  
