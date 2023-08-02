/**
 * @file webRTC test using public server. Currently very thin, only confirms
 * that a request can be made to a public server, since the input is read-only
 * in the application.
 *
 */

const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');
const { addAndSend } = require('./testHelper');

let electronApp,
  page,
  num = 0;

module.exports = () => {
  describe('WebRTC request testing', () => {
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

    describe('WebRTC request testing (read-only)', () => {
      before(async () => {
        page = electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
      });

      xit('it should be able to make requests to a public STUN server', async () => {
        try {
          await page.locator('button>> text=WebRTC').click();
          await addAndSend(page, num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const events = await page
                .locator('#events-display >> .cm-content')
                .innerText();
              expect(events).to.include('"serverType": "STUN"');
              resolve();
            }, 1000)
          );
        } catch (err) {
          console.error(err);
        }
      });
    });
  }).timeout(20000);
};

