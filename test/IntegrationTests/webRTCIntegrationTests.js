const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');

let electronApp,
  page,
  method,
  url,
  num = 0;

const projectPath = path.resolve(__dirname, '..', '..', 'main.js');

module.exports = () => {
  describe('WebRTC integration testing', function () {
    //launch app and select webRTC for current workspace
    before(async () => {
      electronApp = await electron.launch({ args: [projectPath] });
      //awaiting the intilialization of electron
      await new Promise((resolve) => setTimeout(resolve, 1000));
      //define a page variable as the current window of the electron app
      page = await electronApp.windows[0];
      await page.waitForLoadState('domcontentloaded');
      //clear workspace
      const webRTCPath = 'button >> text=WebRTC';
      await page.locator(webRTCPath).click();
    });
    //close Electron app when complete
    after(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await electronApp.close();
    });

    //captures screenshot of browser when test case fails
    afterEach(async function () {
      if (this.curretTest.state === 'failed') {
        console.log('Screenshotting failed test window');
        const imageBuffer = await page.screenshot();
        fs.writeFileSync(
          path.resolve(
            __dirname + '/../failedTests',
            `Failed_${this.currentTest.title}.png`
          ),
          imageBuffer
        );
      }
    });
  });
};

