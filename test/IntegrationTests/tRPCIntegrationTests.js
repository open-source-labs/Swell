const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const pwTest = require('@playwright/test');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');

let electronApp, page;

const projectPath = path.resolve(__dirname, '..', '..', 'main.js');

module.exports = () => {
  before(async () => {
      electronApp = await electron.launch({ args: [projectPath] });
      await new Promise(resolve => setTimeout(resolve, 1000));
      page = await electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);
      // clear workspace
      if (page) await page.locator('button >> text=Clear Workspace').click();
    });
  describe('tRPC integration testing', () => {
    //~ If failed, add screenshot to folder
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

    //~ close electron app when complete
    after(async () => {
      if (page) await page.locator('button >> text=Clear Workspace').click();
      await electronApp.close();
    });

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

    describe('proper components render when tRPC is selected', async () => {
      it('variable form should contain proper placeholder text', async () => {
        await page.locator('button >> text=tRPC').click();
        const textContent = await page.content();
        expect(textContent).to.include('Variable/s for this procedure(objects must be passed in as json format)');
      })
    })
  });
};