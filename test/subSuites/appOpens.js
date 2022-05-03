const assert = require('assert'); // node's own assertion module
const fs = require('fs-extra');
const app = require('../testApp');
const {_electron: electron} = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai')
const expect = chai.expect
const path = require('path');
// const app = require('../testApp');
let electronApp, page;

module.exports = () => {

  describe('App opens and renders a page', () => {

    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
    });
    
    // close Electron app when complete
    after(async () => {
      await electronApp.close();
    });
  
    // If the test fails, take a screenshot of the app and save it into the "failedTests" directory under the test title
    afterEach(async function() {
      if (this.currentTest.state === 'failed') {
        console.log(`Screenshotting failed test window`)
        const window = await electronApp.firstWindow();
        const imageBuffer = await window.screenshot();
        fs.writeFileSync(path.resolve(__dirname + '/../failedTests', `FAILED_${this.currentTest.title}.png`), imageBuffer)
      }
    });

    describe('Window rendering', () => {

      it('Electron app should launch', async () => {
        expect(electronApp).to.be.ok
      })
  
      it('Electron app should be a visible window', async () => {
        const window = await electronApp.firstWindow();
        pwTest.expect(window).toBeVisible();
      })
  
      it('App should only have 1 window (i.e. confirm devTools is not open)', async () => {
        expect(electronApp.windows().length).to.equal(1);
      });    
    });
  
  
    describe('DOM analysis', () => {
      before(async () => {
        page = electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
      });
  
      it('Page title should be "Swell"', async () => {
        expect(await page.title()).to.equal('Swell');
      })
      
      it('Page should contain a composer div', async () => {
        expect(await page.locator('div#composer').count()).to.equal(1)
      });
  
      it('Page should contain a workspace div', async () => {
        expect(await page.locator('div#workspace').count()).to.equal(1)
      });
  
      it('Page should contain a responses div', async () => {
        expect(await page.locator('div#responses').count()).to.equal(1)
      });
    });
  });
};
