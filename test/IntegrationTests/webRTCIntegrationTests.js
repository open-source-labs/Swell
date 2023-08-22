const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');
const { inputAdornmentClasses } = require('@mui/material');

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

    describe('Check if webRTC peer connection is properly updating state throughout life span of video peer connection', async () => {
      it('Should change the newRequestFields properties to WebRTC reflect the webRTC required fields', async () => {
        const webRTCPath = 'button >> text=WebRTC';
        await page.locator(webRTCPath).click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequestFields.method).to.equal('WebRTC');
        expect(reduxState.newRequestFields.url).to.equal('');
        expect(reduxState.newRequestFields.webrtc).to.equal(true);
      });

      it('Changes Data Channel value from Text to Video when navigating to a Video connection', async () => {
        await page.locator('button >> text=Text').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        await page.locator(`div a.dropdown-item:has-text("Video")`).click();
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTCDataChannel
        ).to.equal('Video');
      });

      it('Should initialize WebRTC state values', async () => {
        await page.locator('button >> text=Connect').click();
        const divCount = await page.evaluate(() => {
          const elements = document.querySelectorAll('.is-neutral-200-box.p-3');
          return elements.length;
        });
        expect(divCount).toBe(2);
        await page.locator('button >> text=Get Offer');
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTCpeerConnection
        ).to.equal({});
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTClocalStream
        ).to.equal({});
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTCRemoteStream
        ).to.equal({});
      });

      it('Should generate an SDP offer', async () => {
        await page.locator('button >> text=Get Offer').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        const webRTCOffer = JSON.parse(
          reduxState.newRequest.newRequestWebRTC.webRTCOffer
        );
        expect(webRTCOffer.type).to.equal('offer');
      });

      it('Should paste in provided SDP answer', async () => {
        await page.locator('button >> text=Paste').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        const webRTCAnswer = JSON.parse(
          reduxState.newRequest.newRequestWebRTC.webRTCAnswer
        );
        expect(webRTCAnswer.type).to.equal('answer');
      });

      it('Should change the values of newRequest Headers, Body, Cookies and WebRTC', async () => {
        await page.locator('button >> text=Add To Workspace').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(typeof reduxState.reqRes.history[4]).to.equal('object');
        expect(reduxState.newRequest.newRequestWebRTC.webRTCOffer).to.equal('');
        expect(reduxState.newRequest.newRequestWebRTC.webRTCAnswer).to.equal(
          ''
        );
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTCpeerConnection
        ).to.equal(null);
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTClocalStream
        ).to.equal(null);
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTCRemoteStream
        ).to.equal(null);
        expect(reduxState.newRequest.newRequestFields.method).to.equal('GET');
        expect(reduxState.newRequest.newRequestFields.url).to.equal('http://');
        expect(reduxState.newRequest.newRequestFields.webrtc).to.equal(false);
      });

      it(`Should change the responsePaneActiveTab to 'webrtc'`, async () => {
        await page.locator('button >> text=Send').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.ui.responsePaneActiveTab).to.equal('webrtc');
        expect(reduxState.reqRes.currentResponse.connection).to.equal(
          'uninitialized'
        );
        expect(typeof reduxState.reqRes.currentResponse.request).to.equal(
          'object'
        );
        expect(reduxState.reqRes.currentResponse.response).toBe({
          webRTCMessages: [],
        });
      });
    });
    describe('Check if webRTC peer connection is properly updating state throughout life span of video peer connection', async () => {
      it('Should change the newRequestFields properties to WebRTC reflect the webRTC required fields', async () => {
        const webRTCPath = 'button >> text=WebRTC';
        await page.locator(webRTCPath).click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequestFields.method).to.equal('WebRTC');
        expect(reduxState.newRequestFields.url).to.equal('');
        expect(reduxState.newRequestFields.webrtc).to.equal(true);
      });
      it('Should initialize WebRTC state values', async () => {
        await page.locator('button >> text=Connect').click();
        const divCount = await page.evaluate(() => {
          const elements = document.querySelectorAll('.is-neutral-200-box.p-3');
          return elements.length;
        });
        expect(divCount).toBe(2);
        await page.locator('button >> text=Get Offer');
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTCpeerConnection
        ).to.equal({});
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTClocalStream
        ).to.equal({});
      });

      it('Should generate an SDP offer', async () => {
        await page.locator('button >> text=Get Offer').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        const webRTCOffer = JSON.parse(
          reduxState.newRequest.newRequestWebRTC.webRTCOffer
        );
        expect(webRTCOffer.type).to.equal('offer');
      });

      it('Should paste in provided SDP answer', async () => {
        await page.locator('button >> text=Paste').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        const webRTCAnswer = JSON.parse(
          reduxState.newRequest.newRequestWebRTC.webRTCAnswer
        );
        expect(webRTCAnswer.type).to.equal('answer');
      });

      it('Should change the values of newRequest Headers, Body, Cookies and WebRTC', async () => {
        await page.locator('button >> text=Add To Workspace').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequest.newRequestWebRTC.webRTCOffer).to.equal('');
        expect(reduxState.newRequest.newRequestWebRTC.webRTCAnswer).to.equal(
          ''
        );
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTCpeerConnection
        ).to.equal(null);
        expect(
          reduxState.newRequest.newRequestWebRTC.webRTClocalStream
        ).to.equal(null);
      });

      it(`Should change the responsePaneActiveTab to 'webrtc'`, async () => {
        await page.locator('button >> text=Send').click();
        await page.locater(
          '#webrtc-message-inputAdornmentClasses.ml-1.mr-1.input-is-small'
        );
        await page.locater('button >>text=Send Message');
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.currentResponse.request.webRTCDataChannel).to.equal(
          'Text'
        );
        expect(reduxState.currentResponse.request.webRTCRemoteStream).to.equal(
          null
        );
      });

      it('Should receive a string on the webRTCMessages', async () => {
        await page.locator('button >> text=Send Message').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(
          typeof reduxState.reqRes.currentResponse.request.webRTCMessages.data
        ).to.equal('string');
      });
    });
  });
};

