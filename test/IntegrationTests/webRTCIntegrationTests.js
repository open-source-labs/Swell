const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');

let electronApp,
  page,
  num = 0;

const projectPath = path.resolve(__dirname, '..', '..', 'main.js');

module.exports = () => {
  describe('WebRTC integration testing', () => {
    //launch app and select webRTC for current workspace
    before(async () => {
      electronApp = await electron.launch({ args: [projectPath] });
      //awaiting the intilialization of electron
      await new Promise((resolve) => setTimeout(resolve, 1000));
      //define a page variable as the current window of the electron app
      page = await electronApp.windows()[0];
      await page.waitForLoadState('domcontentloaded');
      webRTCServer('open');
    });

    beforeEach(async () => {
      await page.locatore('button >> text=Clear Workspace').click();
    });
    //close Electron app when complete
    after(async () => {
      if (page) await page.locator('button >> text=Clear Workspace').click();
      await electronApp.close();
      webRTCServer('close');
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

    describe('Check if webRTC is selected if both newRequestFieldsByProtocol and newRequestContentByProtocol are being ran in conjuction with each other', async () => {
      it('Should change the newRequestFields properties to WebRTC reflect the webRTC required fields', async () => {
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequestFields.method).to.equal('WebRTC');
        expect(reduxState.newRequestFields.url).to.equal('');
        expect(reduxState.newRequestFields.webrtc).to.equal(true);
        expect(reduxState.newRequest.newRequestHeaders.count).to.equal(0);
        expect(reduxState.newRequest.newRequestBody.bodyType).to.equal(
          'stun-ice'
        );
        expect(reduxState.newRequest.newRequestCookies.count).to.equal(0);
      });

      it('Should initialize WebRTC state values', async () => {
        await page.locator('button >> text=Connect').click();
        await page.locator('.is-neutral-200-box.p-3');
        await page.locater('#');
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState);
      });
    });
  });
};

