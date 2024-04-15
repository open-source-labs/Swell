const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');

module.exports = () => {
  describe('Theme activation', () => {
    let electronApp;
    let page;

    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      page = await electronApp.firstWindow();
    });

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

    it('should apply the light theme when isDark is false', async () => {
      await page.waitForSelector('#themed-app');
      const backgroundColor = await page.evaluate(() => {
        return window.getComputedStyle(document.querySelector('#themed-app')).backgroundColor;
      });
      expect(backgroundColor).to.equal('rgb(255, 255, 255)'); // Light theme background color
    });

    it('should apply the dark theme when isDark is true', async () => {
      await page.click('.dark-mode-toggle');
      await page.waitForSelector('#themed-app');
      const backgroundColor = await page.evaluate(() => {
        return window.getComputedStyle(document.querySelector('#themed-app')).backgroundColor;
      });
      expect(backgroundColor).to.equal('rgb(31, 40, 46)'); // Dark theme background color (neutral-400)
    });
  });
};