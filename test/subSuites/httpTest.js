/**
 * @file http tests using local server and public API
 *
 * @todo Please note, this is only testing HTTP currently. HTTP2 testing is
 * non-existent and should be added.
 *
 * @todo Possibly remove our own server from this testing suite and go with a
 * public API. Tests may fail due to the user's computer and this testing suite
 * becomes heavier with a mock server.
 */

const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');
const { fillRestRequest, addAndSend } = require('./testHelper');

let electronApp,
  page,
  num = 0;

module.exports = () => {
  describe('HTTP/S requests', function () {
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

    const fillAndSentRequest = async (url, method, n, body) => {
      await fillRestRequest(page, url, method, body);
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

      it('it should GET information from a public API', async () => {
        try {
          // TEST GET Request from JSON Placeholder
          const url = 'http://jsonplaceholder.typicode.com/posts';
          const method = 'GET';
          await fillAndSentRequest(url, method, num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page
                .locator('#events-display >> .cm-content')
                .innerText();
              expect(statusCode).to.equal('200');
              expect(events.slice(1, 100)).to.include('userId');
              resolve();
            }, 1000)
          );
        } catch (err) {
          console.error(err);
        }
      });
    });

    describe('httpTest Server', () => {
      before('CLEAR DB', (done) => {
        chai
          .request('http://localhost:3004')
          .get('/clear')
          .end((err, res) => {
            done(); // <= Call done to signal callback end
          });
      });

      after('CLEAR DB', (done) => {
        chai
          .request('http://localhost:3004')
          .get('/clear')
          .send()
          .end((err, res) => {
            done(); // <= Call done to signal callback end
          });
      });

      it('it should GET information from an http test server', async () => {
        try {
          const url = 'http://localhost:3004/book';
          const method = 'GET';
          await fillAndSentRequest(url, method, num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page
                .locator('#events-display >> .cm-content')
                .innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('[]');
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
      });

      it('it should POST to local http test server', async () => {
        try {
          const url = 'http://localhost:3004/book';
          const method = 'POST';
          const body =
            '{"title": "HarryPotter", "author": "JK Rowling", "pages": 500}';
          await fillAndSentRequest(url, method, num++, body);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page
                .locator('#events-display >> .cm-content')
                .innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('JK Rowling');
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
      });

      it('it should PUT to local http test server', async () => {
        try {
          const url = 'http://localhost:3004/book/HarryPotter';
          const method = 'PUT';
          const body = '{"author": "Ron Weasley", "pages": 400}';
          await fillAndSentRequest(url, method, num++, body);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page
                .locator('#events-display >> .cm-content')
                .innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('Ron Weasley');
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
      });

      it('it should PATCH to local http test server', async () => {
        try {
          const url = 'http://localhost:3004/book/HarryPotter';
          const method = 'PATCH';
          const body = '{"author": "Hermoine Granger"}';
          await fillAndSentRequest(url, method, num++, body);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page
                .locator('#events-display >> .cm-content')
                .innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('Hermoine Granger'); // someone didnt know how to spell :/
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
      });

      it('it should DELETE to local http test server', async () => {
        // DELETE HARRYPOTTER
        try {
          const url = 'http://localhost:3004/book/HarryPotter';
          const method = 'DELETE';
          const body = '{}';
          await fillAndSentRequest(url, method, num++, body);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page
                .locator('#events-display >> .cm-content')
                .innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('Hermoine Granger');
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
        // CHECK TO SEE IF IT IS DELETED
        try {
          const url = 'http://localhost:3004/book';
          const method = 'GET';
          await fillAndSentRequest(url, method, num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page
                .locator('#events-display >> .cm-content')
                .innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('[]');
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
      });
    });

    describe('HTTP/S load testing', () => {
      before(async () => {
        page = electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
        await chai.request('http://localhost:3004').get('/clear').send();
        await page.locator('button >> text=Clear Workspace').click();
      });

      after(async () => {
        await chai.request('http://localhost:3004').get('/clear').send();
      });

      beforeEach(() => (num = 0));

      afterEach(
        async () => await page.locator('button >> text=Clear Workspace').click()
      );

      // limiting the amount of time required to simulate the load test
      const loadTestDuration = 3;

      it('Load test run button is disabled with no request in workspace window', async () => {
        try {
          await page.locator('button>> text=HTTP/2').click();
          await page.locator('span >> text=Load Test').click();
          const runButton = page.locator('button>> text=Run');
          pwTest.expect(runButton).toBeDisabled();
        } catch (err) {
          console.error(err);
        }
      });

      it('Run button is disabled for requests other than `GET` request', async () => {
        try {
          const url = 'http://localhost:3004/book';
          const method = 'POST';
          const body =
            '{"title": "HarryPotter", "author": "JK Rowling", "pages": 500}';
          await fillRestRequest(page, url, method, body);
          await page.locator('button >> text=Add to Workspace').click();
          await page.locator('span >> text=Load Test').click();
          const runButton = page.locator('button>> text=Run');
          pwTest.expect(runButton).toBeDisabled();
        } catch (err) {
          console.error(err);
        }
      });

      it('Successful load test with `GET` request', async () => {
        try {
          const url = 'http://localhost:3004/book';
          const method = 'GET';
          await fillRestRequest(page, url, method);
          await page.locator('button >> text=Add to Workspace').click();
          await page.locator('span >> text=Load Test').click();
          await page
            .locator('[placeholder="Duration"]')
            .fill(loadTestDuration.toString());
          await page.locator('button>> text=Run').click();

          // The load test takes a minimum of 4 seconds to execute
          await new Promise((resolve) => {
            setTimeout(async () => {
              try {
                const events = await page.locator(
                  '#events-display >> .cm-content'
                );
                expect(await events.count()).to.equal(1);
                expect(await events.innerText()).to.include('"totalSent": 3');
                resolve();
              } catch (err) {
                console.error(err);
              }
            }, 5000);
          });
        } catch (err) {
          console.error(err);
        }
      }).timeout(7000);
    }).timeout(20000);
  }).timeout(20000);
};
