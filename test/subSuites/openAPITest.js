/**
 * @file openAPI tests using openAPITestDefinition.yaml
 *
 * @todo Test suite incomplete, currently only testing if the Load Document
 * button appears. Testing should be added to confirm openAPI works using the
 * provided YAML
 */

const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');

let electronApp, page;

module.exports = () => {
  const setupFxn = function () {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      page = electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);

      await page.locator('text=OPENAPI').click();
    });

    // close Electron app when complete
    after(async () => {
      await electronApp.close();

      try {
      } catch (err) {
        console.error(err);
      }
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
  };

  describe('openAPI testing', () => {
    setupFxn();

    it('it should have a "Load Document" button', async () => {
      const handle = await page.locator('text=Load Document');
      expect(handle.count()).to.equal(1);
    });
  }).timeout(20000);
};

