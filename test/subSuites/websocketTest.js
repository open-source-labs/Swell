// Testing websocket requests using websocketserver.js
// Tests may fail due to the user's computer and this testing suite becomes heavier
// with a mock WS server.

const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs-extra');
const { addAndSend } = require('./testHelper');

let electronApp, page, num, messageNum;

module.exports = () => {
  describe('Websocket requests', () => {
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

    describe('Websocket requests', () => {
      before(async () => {
        page = electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
      });

      beforeEach(() => {
        num = 0;
        messageNum = 0;
      });

      afterEach(
        async () => await page.locator('button >> text=Clear Workspace').click()
      );

      it('it should send and receive messages to the mock server', async () => {
        try {
          // select web sockets
          await page.locator('button>> text=WebSocket').click();

          // type in url
          await page.locator('#url-input').fill('ws://localhost:5001/');

          await addAndSend(page, num++);

          await new Promise((resolve) =>
            setTimeout(async () => {
              try {
                await page.locator('#wsSendData').click();
                await page
                  .locator('#wsMsgInput')
                  .fill('testing websocket protocol');
                await page.locator('button >> text=Send Message').click();

                await new Promise((resolve) =>
                  setTimeout(async () => {
                    try {
                      const messageClient = await page
                        .locator(`#ws-msg-${messageNum++}`)
                        .innerText();
                      const messageServer = await page
                        .locator(`#ws-msg-${messageNum++}`)
                        .innerText();
                      expect(messageClient).to.include(
                        'testing websocket protocol'
                      );
                      expect(messageServer).to.include(
                        'testing websocket protocol'
                      );
                      resolve();
                    } catch (err) {
                      console.error(err);
                    }
                  }, 300)
                );
                resolve();
              } catch (err) {
                console.error(err);
              }
            }, 1000)
          );
        } catch (err) {
          console.error(err);
        }
      });
    });
  }).timeout(20000);
};
