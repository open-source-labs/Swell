/**
 * @file gRPC tests using "hw2.proto" file to set up gRPC in grpcServer
 *
 * @todo Possibly remove our own server from this testing suite and go with a
 * public API. Tests may fail due to the user's computer and this testing suite
 * becomes heavier with a mock server.
 */

const grpcServer = require('../grpcServer.js');

const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs-extra');
const { fillgRPC_Proto } = require('./testHelper');

const proto = fs.readFileSync(
  path.resolve(__dirname, '../grpc_mockData/mock_protos/hw2.proto')
);
let electronApp, page, num;

module.exports = () => {
  describe('gRPC requests', () => {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      if (!electronApp) {
        throw new Error('electronApp failed to launch');
      }
      grpcServer('open');
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

    describe('Functionality Testing', () => {
      before(async () => {
        page = await electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
        num = 0;

        await page.locator('button>> text=GRPC').click();
        await page.locator('#url-input').fill('0.0.0.0:30051');
      });

      beforeEach(() => (num = 0));

      afterEach(async () => {
        await page.locator('button >> text=Remove').click();
      });

      const addReqAndSend = async (page, num) => {
        try {
          await page.locator('button >> text=Add to Workspace').click();
          await page.locator(`#send-button-${num}`).click();
          const res = await page.locator('#events-display').textContent();

          console.log('res', res);

          return res;
        } catch (err) {
          console.error(err);
        }
      };

      it('it should work on a unary request', async () => {
        await fillgRPC_Proto(page, proto);
        await page.getByText('SayHello', { exact: true }).click();
        const jsonPretty = await addReqAndSend(page, num);
        expect(jsonPretty).to.include(`"message": "Hello string"`);
      });

      it('it should work on a nested unary request', async () => {
        await fillgRPC_Proto(page, proto);
        // try {
        await page.getByText('SayHelloNested', { exact: true }).click();
        const jsonPretty = await addReqAndSend(page, num);
        expect(jsonPretty).to.include('"serverMessage":');
        expect(jsonPretty).to.include('"message": "Hello! string"');
        const helloStrArray = jsonPretty.match(/"message": "Hello! string"/g);
        expect(helloStrArray).to.have.lengthOf(2);
        // } catch (err) {
        //   console.error(err);
        // }
      });

      it('it should work on a server stream', async () => {
        await fillgRPC_Proto(page, proto);
        // try {
        await page.getByText('SayHellosSs', { exact: true }).click();
        const jsonPretty = await addReqAndSend(page, num);
        expect(jsonPretty.match(/"message"/g)).to.have.lengthOf(5);
        expect(jsonPretty).to.include('hello!!! string');
        // } catch (err) {
        //   console.error(err);
        // }
      });

      it('it should work on a client stream', async () => {
        await fillgRPC_Proto(page, proto);
        // try {
        await page.getByText('SayHelloCS', { exact: true }).click();
        const jsonPretty = await addReqAndSend(page, num);
        // console.log('jsonPretty CS', jsonPretty)
        // console.log('jsonPretty CS after', jsonPretty)
        expect(jsonPretty).to.include('"message": "received 1 messages"');
        // await page.locator('button >> text=Remove').click()
        // } catch (err) {
        //   console.error(err);
        // }
      });

      it('it should work on a bidirectional stream', async () => {
        await fillgRPC_Proto(page, proto);
        // try {
        await page.getByText('SayHelloBidi', { exact: true }).click();
        const jsonPretty = await addReqAndSend(page, num);
        expect(jsonPretty).to.include('"message": "bidi stream: string"');
        // await page.locator('button >> text=Remove').click();
        // } catch (err) {
        //   console.error(err);
        // }
      });
    }).timeout(20000);
  }).timeout(20000);
};
