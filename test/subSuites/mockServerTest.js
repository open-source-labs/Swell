// Import necessary modules
const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs-extra');
const { element } = require('prop-types');
const { parseConfigFileTextToJson } = require('typescript');

// Declare global variables
let electronApp, page;

// Export test suite
module.exports = () => {
  describe('App opens and renders a page', () => {
    // Launch Electron app before all tests
    before(async () => {
        electronApp = await electron.launch({ args: ['main.js'] });
    });

    // Close Electron app after all tests
    after(async () => {
      // Check if Electron app exists
        await electronApp.close();
    });

    // If a test fails, take a screenshot
    afterEach(async function () {
      if (this.currentTest.state === 'failed' && electronApp) {
        const window = await electronApp.firstWindow();
        const imageBuffer = await window.screenshot();
        fs.writeFileSync(
          path.resolve(__dirname + '/../failedTests', `FAILED_${this.currentTest.title}.png`),
          imageBuffer
        );
      }
    });


    describe('Mock Server selection', () => {

      before(async () => {
        if (!page) {
          page = await electronApp.firstWindow();
          await page.waitForLoadState('domcontentloaded');
        }
      });

      it('can select Mock Server', async () => {
        await page.locator('button >> text=Mock').click();
        expect(await page.locator('button#response').count()).to.equal(1);
      });

      it('can click on start server button', async() => {
        await page.locator('button >> text=Start Server').click();
        expect(await page.locator('button#response').innerText()).to.equal('Stop Server')
      })

      it('can type in Mock Server route', async () => {
        await page
          .locator('#url-input')
          .fill('/testRoute')

        const mockRoute = await page
          .locator('#url-input')
          .inputValue();

        expect(mockRoute).to.equal('/testRoute')
      })

      it('can type in Mock Server body', async () => {
        const divElement = await page.locator('.cm-activeLine.cm-line')

        await divElement.evaluate((element) => element.innerText = '{"test":"test"}');

        const mockData = await divElement.innerText();
        expect(mockData).to.equal('{"test":"test"}');
      })

      it('can click on submit mock server button', async () => {
        await page.locator('button >> text=Submit').click();
        await page.locator('button >> text=Close').click();
      });

      it('can click on stop server button', async() => {
        await page.locator('button >> text=Stop Server').click();
        expect(await page.locator('button#response').innerText()).to.equal('Start Server');
      })
    

    });

  }).timeout(20000);
};
