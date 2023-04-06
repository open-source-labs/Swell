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
const {
  fillGQLBasicInfo,
  fillGQLRequest,
  addAndSend,
} = require('./testHelper');

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

    const fillAndSendRequest = async (url, method, query, n, variables) => {
      await fillGQLRequest(page, url, method, query, variables);
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

          await fillGQLBasicInfo(page, URL, 'QUERY', headers);

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
          await fillAndSendRequest(url, method, query, num++, variables);

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
          await fillAndSendRequest(url, method, query, num++);

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
          await fillAndSendRequest(url, method, query, num++);

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
          await fillAndSendRequest(url, method, query, num++);

          // SEND MUTATION
          const method2 = 'MUTATION';
          const url2 = 'http://localhost:4000/graphql';
          const query2 =
            'mutation {post(url: "www.gavinbelson.com" description: "Tethics") {description}}';
          await fillAndSendRequest(url2, method2, query2, num++);

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
          await fillAndSendRequest(url, SUBSCRIPTION, query, num++);

          // SEND MUTATION
          const MUTATION = 'MUTATION';
          const query2 =
            'mutation {post(url: "www.gavinbelson.com" description: "Tethics") {description}}';
          await fillAndSendRequest(url, MUTATION, query2, num++);

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
          await fillAndSendRequest(url, MUTATION, query3, num++);

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

      it('subscriptions should error with incorrect schema (LOCAL API)', async () => {
        try {
          // START SUBSCRIPTION
          const method = 'SUBSCRIPTION';
          const url = 'http://localhost:4000/graphql';
          // Misspelled `newLink`
          const query = 'subscription {newnk {id description url}}';
          await fillAndSendRequest(url, method, query, num++);

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
                expect(await events.innerText()).to.include('newnk');
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
  });
};
