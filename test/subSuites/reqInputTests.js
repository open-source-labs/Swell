// Testing UI that all protocol and request types are represented, parameters can be entered,
// and panels appear appropriately in the application

const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs-extra');

let electronApp, page;

module.exports = () => {
  describe('App opens and renders a page', () => {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
    });

    // close Electron app when complete
    after(async () => {
      await page.locator('button >> text=Clear Workspace').click();
      await electronApp.close();
    });

    // If the test fails, take a screenshot of the app and save it into the "failedTests" directory under the test title
    afterEach(async function () {
      if (this.currentTest.state === 'failed') {
        console.log(`Screenshotting failed test window`);
        const window = await electronApp.firstWindow();
        const imageBuffer = await window.screenshot();
        fs.writeFileSync(
          path.resolve(
            __dirname + '/../failedTests',
            `FAILED_${this.currentTest.title}.png`
          ),
          imageBuffer
        );
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

    describe('URL/request method selection', () => {
      before(async () => {
        page = electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
      });

      it('select GraphQL', async () => {
        await page.locator('button>> text=GraphQL').click();
        expect(await page.locator('div#composer-graphql').count()).to.equal(1);
      });

      it('select HTTP/2', async () => {
        await page.locator('button>> text=HTTP/2').click();
        expect(await page.locator('div#composer-http2').count()).to.equal(1);
      });

      it('select gRPC', async () => {
        await page.locator('button>> text=gRPC').click();
        expect(await page.locator('div#composer-grpc').count()).to.equal(1);
      });

      it('select WebSocket', async () => {
        await page.locator('button>> text=WebSocket').click();
        expect(await page.locator('div#composer-websocket').count()).to.equal(
          1
        );
      });

      it('select WebRTC', async () => {
        await page.locator('button>> text=WebRTC').click();
        expect(await page.locator('div#composer-webrtc').count()).to.equal(1);
      });

      it('select OpenAPI', async () => {
        await page.locator('button>> text=OpenAPI').click();
        expect(await page.locator('div#composer-openapi').count()).to.equal(1);
      });

      it('select Webhook', async () => {
        await page.locator('button>> text=Webhook').click();
        expect(await page.locator('div#composer-webhook').count()).to.equal(1);
      });
    });

    describe('URL/request method inputs', () => {
      before(async () => {
        await page.locator('button>> text=HTTP/2').click();
      });

      beforeEach(async () => {
        await page.locator('button#rest-method').click();
      });

      it('can select a POST request', async () => {
        await page.locator('div[id^="composer"] >> a >> text=POST').click();
        expect(
          await page.locator('button.is-rest >> span >> text=POST').count()
        ).to.equal(1);
      });

      it('can select a PUT request', async () => {
        await page.locator('div[id^="composer"] >> a >> text=PUT').click();
        expect(
          await page.locator('button.is-rest >> span >> text=PUT').count()
        ).to.equal(1);
      });

      it('can select a GET request', async () => {
        await page.locator('div[id^="composer"] >> a >> text=GET').click();
        expect(
          await page.locator('button.is-rest >> span >> text=GET').count()
        ).to.equal(1);
      });

      it('can select a PATCH request', async () => {
        await page.locator('div[id^="composer"] >> a >> text=PATCH').click();
        expect(
          await page.locator('button.is-rest >> span >> text=PATCH').count()
        ).to.equal(1);
      });

      it('can select a DELETE request', async () => {
        await page.locator('div[id^="composer"] >> a >> text=DELETE').click();
        expect(
          await page.locator('button.is-rest >> span >> text=DELETE').count()
        ).to.equal(1);
      });
    });

    describe('HTTP/2 URL input successful', () => {
      // Any button in the nav bar that is selected is disabled
      // And hard refreshing the page in a test environment is not entirely robust
      // since the app can take a bit to load. In that case,
      // we work around the limitation by clicking another feature and return to HTTP/2
      before(async () => {
        await page.locator('button>> text=GraphQL').click();
        await page.locator('button>> text=HTTP/2').click();
      });

      it('can type url into url input', async () => {
        await page
          .locator('#url-input')
          .fill('http://jsonplaceholder.typicode.com/posts/1');

        const input = await page.locator('#url-input').inputValue();

        expect(input).to.equal('http://jsonplaceholder.typicode.com/posts/1');
      });
    });

    describe('REST parameter inputs', async () => {
      // Add tests for deleting header and checking/unchecking boxes
      describe('Header inputs', async () => {
        it('should open headers input, rendering single input at first', async () => {
          // count header rows
          const count = await page.locator('.header-row').count();
          expect(count).to.equal(1);
        });

        it('can add new headers in request', async () => {
          const addHeaderButton = await page.locator('button#add-header');
          expect(await addHeaderButton.count()).to.equal(1);

          await addHeaderButton.click();
          expect(await page.locator('.header-row').count()).to.equal(2);
        });

        it('can type in keys & values to headers', async () => {
          await page
            .locator('#header-row0 >> [placeholder="Key"]')
            .fill('Checking header Key input!');
          await page
            .locator('#header-row0 >> [placeholder="Value"]')
            .fill('Checking header Value input!');

          const headerKey = await page
            .locator('#header-row0 >> [placeholder="Key"]')
            .inputValue();
          const headerValue = await page
            .locator('#header-row0 >> [placeholder="Value"]')
            .inputValue();

          expect(headerKey).to.equal('Checking header Key input!');
          expect(headerValue).to.equal('Checking header Value input!');
        });
      });
    });

    describe('Cookie inputs', async () => {
      it('should open cookies input, rendering single input at first', async () => {
        // count cookie rows
        const count = await page.locator('.cookie-row').count();
        expect(count).to.equal(1);
      });

      it('can add new cookies in request', async () => {
        // click add cookie
        const addCookieButton = await page.locator('button#add-cookie');
        expect(await addCookieButton.count()).to.equal(1);

        await addCookieButton.click();
        expect(await page.locator('.cookie-row').count()).to.equal(2);
      });

      it('can type in keys & values to cookies', async () => {
        await page
          .locator('#cookie-row0 >> [placeholder="Key"]')
          .fill('Checking cookie Key input!');
        await page
          .locator('#cookie-row0 >> [placeholder="Value"]')
          .fill('Checking cookie Value input!');

        const cookieKey = await page
          .locator('#cookie-row0 >> [placeholder="Key"]')
          .inputValue();
        const cookieValue = await page
          .locator('#cookie-row0 >> [placeholder="Value"]')
          .inputValue();

        expect(cookieKey).to.equal('Checking cookie Key input!');
        expect(cookieValue).to.equal('Checking cookie Value input!');
      });
    });

    describe('Request body inputs', () => {
      it('body input appears for non GET requests', async () => {
        // // click and select GET
        await page.locator('button#rest-method').click();
        await page.locator('text=GET').click();
        let bodyInputcount = await page.locator('#body-entry-select').count();
        expect(bodyInputcount).to.equal(0);

        // // click and select POST
        await page.locator('button#rest-method').click();
        await page.locator('div[id^="composer"] >> a >> text=POST').click();

        bodyInputcount = await page.locator('#body-entry-select').count();
        expect(bodyInputcount).to.equal(1);
      });

      it('can type plain text into body', async () => {
        const input = 'Team Swell is the best!';
        const bodyInput = await page.locator('div.cm-line');
        await bodyInput.fill(input);
        expect(await page.locator('div.cm-content').innerText()).to.equal(
          input
        );
      });

      it('selecting binary renders choose-file and upload-file fields', async() => {

        let chooseCount = await page.locator('input#chooseFileBinary').count()
        let uploadCount = await page.locator('input#uploadFileBinary').count()
        expect(chooseCount).to.equal(0)
        expect(uploadCount).to.equal(0)

        await page.locator('button#body-type-select').click();
        await page.locator('div[id^="composer"] >> a >> text=binary').click();
        chooseCount = await page.locator('input#chooseFileBinary').count()
        uploadCount = await page.locator('input#uploadFileBinary').count()
        
        expect(chooseCount).to.equal(1)
        expect(uploadCount).to.equal(1)
      })



    });
  }).timeout(20000);
};
