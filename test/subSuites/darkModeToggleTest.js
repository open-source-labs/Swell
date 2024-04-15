const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');

module.exports = () => {
  describe('DarkModeToggle component', () => {
    let electronApp;
    let page;

    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      // page = await electronApp.firstWindow();
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

    describe('Testing Rendering Correct Icons', () => {
      before(async () => {
        page = electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
      });

      it('should render the correct icon based on isDark state', async () => {
        await page.waitForSelector('[data-testid="dark-mode-toggle-button"]');
        const initialIcon = await page
          .locator('[data-testid="dark-mode-toggle-button"] svg')
          .getAttribute('data-testid');
        pwTest.expect(initialIcon).toBe('Brightness4Icon');

        await page.click('[data-testid="dark-mode-toggle-button"]');
        const toggledIcon = await page
          .locator('[data-testid="dark-mode-toggle-button"] svg')
          .getAttribute('data-testid');
        pwTest.expect(toggledIcon).toBe('Brightness7Icon');
      });

      it('should dispatch toggleDarkMode action when icon is clicked', async () => {
        await page.click('[data-testid="dark-mode-toggle-button"]');
        const isDarkStateFalse = await page.evaluate(() => {
          return window.getReduxState().ui.isDark;
        });
        pwTest.expect(isDarkStateFalse).toBe(false);

        await page.click('[data-testid="dark-mode-toggle-button"]');
        const isDarkStateTrue = await page.evaluate(() => {
          return window.getReduxState().ui.isDark;
        });
        pwTest.expect(isDarkStateTrue).toBe(true);
      });
    });
  });
};

