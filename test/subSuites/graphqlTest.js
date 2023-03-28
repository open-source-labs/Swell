/**
 * @file Test GraphQL protocol by introspecting and querying both public and
 * local GraphQL APIs
 *
 * @todo Possibly remove our own server from this testing suite and go with a
 * public API. Tests may fail due to the user's computer and this testing suite
 * becomes heavier with a mock server.
 */

const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs-extra');

let electronApp, page, num;

module.exports = () => {
  describe('GraphQL requests', () => {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
    });

    // close Electron app when complete
    after(async () => {
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

    describe('public API', () => {
      before(async () => {
        page = electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
      });

      beforeEach(() => (num = 0));

      afterEach(
        async () => await page.locator('button >> text=Clear Workspace').click()
      );

      it('it should be able to introspect the schema (PUBLIC API)', async () => {
        try {
          const URL = 'https://countries.trevorblades.com/';
          // For introspection specifically, headers are required
          const headers = [{ key: 'Content-type', value: 'application/json' }];

          await fillGQLBasicInfo(URL, 'QUERY', headers);

          // click introspect
          const button = await page.locator('button >> text=Introspect');
          await button.scrollIntoViewIfNeeded();
          await button.click();

          await new Promise((resolve) => {
            setTimeout(async () => {
              try {
                const introspectionResult = await page.locator(
                  '#gql-introspection >> .cm-content'
                );
                console.log('result', introspectionResult);
                expect(await introspectionResult.count()).to.equal(1);
                expect(await introspectionResult.innerText()).to.include(
                  'Continent'
                );
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
                const events = await page.locator(
                  '#events-display >> .cm-content'
                );
                expect(await events.count()).to.equal(1);
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
                const statusCode = await page
                  .locator('.status-tag')
                  .innerText();

                const events = await page.locator(
                  '#events-display >> .cm-content'
                );
                expect(await events.count()).to.equal(1);

                expect(statusCode).to.equal('Error');
                expect(await events.innerText()).to.include(
                  '"message": "Cannot query field'
                );
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
                const statusCode = await page
                  .locator('.status-tag')
                  .innerText();

                const events = await page.locator(
                  '#events-display >> .cm-content'
                );
                expect(await events.count()).to.equal(1);

                expect(statusCode).to.equal('Success');
                expect(await events.innerText()).to.include(
                  'www.piedpiper.com'
                );
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
          const query = 'subscription {newLink {id description url}}';

          await fillGQLRequest(url, method, query);
          await addAndSend(num++);

          // SEND MUTATION
          const method2 = 'MUTATION';
          const url2 = 'http://localhost:4000/graphql';
          const query2 =
            'mutation {post(url: "www.gavinbelson.com" description: "Tethics") {description}}';

          await fillGQLRequest(url2, method2, query2);
          await addAndSend(num++);

          await new Promise((resolve) => {
            setTimeout(async () => {
              try {
                await page.locator('#view-button-1').click();

                const statusCode = await page
                  .locator('.status-tag')
                  .innerText();
                const events = await page.locator(
                  '#events-display >> .cm-content'
                );
                expect(await events.count()).to.equal(1);

                expect(statusCode).to.equal('Success');
                console.log('here', await events.innerText());
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

      it('App stops receiving events after unsubscribe (LOCAL API)', async () => {
        try {
          const url = 'http://localhost:4000/graphql';
          // START SUBSCRIPTION
          const SUBSCRIPTION = 'SUBSCRIPTION';
          const query = 'subscription {newLink {id description url}}';

          await fillGQLRequest(url, SUBSCRIPTION, query);
          await addAndSend(num++);

          // SEND MUTATION
          const MUTATION = 'MUTATION';
          const query2 =
            'mutation {post(url: "www.gavinbelson.com" description: "Tethics") {description}}';

          await fillGQLRequest(url, MUTATION, query2);
          await addAndSend(num++);

          // UNSUNSCRIBE FROM SERVER
          await new Promise((resolve) => {
            setTimeout(async () => {
              try {
                await page.locator('#view-button-0').click();
                const button = await page.locator(
                  'button >> text=Close Connection'
                );
                await button.scrollIntoViewIfNeeded();
                await button.click();
                resolve();
              } catch (err) {
                console.error(err);
              }
            }, 500);
          });

          // SEND ADDITIONAL MUTATION AFTER UNSUBSCRIBED FROM SERVER
          const query3 =
            'mutation {post(url: "www.moreexamples.com" description: "Fake site") {description}}';

          await fillGQLRequest(url, MUTATION, query3);
          await addAndSend(num++);

          await new Promise((resolve) => {
            setTimeout(async () => {
              try {
                await page.locator('#view-button-0').click();

                const events = await page.locator(
                  '#events-display >> .cm-content'
                );
                expect(await events.count()).to.equal(1);
                expect(await events.innerText()).to.not.include('Fake site');
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
    }).timeout(20000);
  });
};
