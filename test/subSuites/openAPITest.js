/**
 * @file openAPI tests using openAPITestDefinition.yaml
 *
 * @todo Test suite incomplete, currently only testing if the Load Document
 * button appears. Testing should be added to confirm openAPI works using the
 * provided YAML
 */

const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');

let electronApp, page, num;

module.exports = () => {
  describe('openAPI tests', () => {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      if (!electronApp) {
        throw new Error('electronApp failed to launch');
      }
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
        // const window = await electronApp.windows()[0];
        pwTest.expect(window).toBeVisible();
      });

      it('App should only have 1 window (i.e. confirm devTools is not open)', async () => {
        expect(electronApp.windows().length).to.equal(1);
      });
    });

    describe('OpenAPI Functionality Testing', () => {
      before(async () => {
        // In case there is more than one window
        page = await electronApp.windows()[0];
        await page.waitForLoadState(`domcontentloaded`);
        num = 0;
        await page.locator('button>> text=OpenAPI').first().click();
        // await page.locator('#url-input').fill('0.0.0.0:30051');
      });

      // const addReqAndSend = async (num) => {
      //   try {
      //     await page.locator('button >> text=Add to Workspace').click();
      //     await page.locator(`#send-button-${num}`).click();
      //     const res = await page.locator('#events-display').innerText();
      //     return res;
      //   } catch (err) {
      //     console.error(err);
      //   }
      // };

      it('it should have a "Load Document" button', async () => {
        const handle = await page.locator('text=Load Document');
        pwTest.expect(handle).toBeVisible();
      });
    }).timeout(20000);
  });
};

