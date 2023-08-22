const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs-extra');

let electronApp, page
const projectPath = path.resolve(__dirname, '..', '..', 'main.js');

module.exports = () => {
  describe('WebSocket Integration Testing', () => {
    // open Electron App, click on Websockets section, fill in mock server URL
    before(async () => {
      electronApp = await electron.launch({ args: [projectPath] });
      await new Promise(resolve => setTimeout(resolve, 1000)); // giving electron time to initialize
      page = await electronApp.windows()[0]; // defining page variable
      await page.waitForLoadState(`domcontentloaded`);
    });

    // close Electron app when complete
    after(async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await electronApp.close();
    })

    // captures screenshot of browser when test case fails
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
      };
    });

    describe('Check to see if WebSocket feature properly interacts with back-end upon successful mock server connection', async () => {

      it('Clicking on WebSocket tab should change newRequestFields state', async () => {
        const websocketPath = 'button >> text=WebSocket';
        await page.locator(websocketPath).click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        const reqFields = reduxState.newRequestFields.network;
        expect(reqFields).to.equal('ws');
      });

      it('User input into target WebSocket server text-area should change request fields state', async () => {
        await page.locator('#url-input').fill('ws://localhost:5001/');
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequestFields.wsUrl).to.equal('ws://localhost:5001/');
        expect(reduxState.newRequestFields.url).to.equal('ws://localhost:5001/');
      });

      it('Adding WebSocket request to workspace appropriately changes reqRes state', async () => {
        await page.locator('button >> "Add to Workspace"').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        const reqResArray = reduxState.reqRes.reqResArray;
        expect(reqResArray[reqResArray.length - 1].url).to.equal("ws://localhost:5001/");
        expect(reqResArray[reqResArray.length - 1].request.method).to.equal("WS");
      });

      it('Sending WebSocket request to connect server should update reqRes state upon success', async () => {
        await page.locator('button >> "Send"').click();
        await page.waitForLoadState();
        await new Promise(resolve => setTimeout(resolve, 1000));
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.reqRes.currentResponse.response.connection).equal("open");
      });
    });

    describe('Sending and receiving WebSocket text messages should interact with back-end appropriately', async () => {

      it('Sending WebSocket message should update back-end state appropriately', async () => {
        await page.locator('#wsSendData').click();
        await page
          .locator('#wsMsgInput')
          .fill('hi!');
        await page.locator('button >> text=Send Message').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        const sentMessageState = reduxState.reqRes.currentResponse.request.messages[0].data;
        expect(sentMessageState).to.equal('hi!');
      });

      it('Receiving test WebSocket message should update back-end state appropriately', async () => {
        const reduxState = await page.evaluate(() => window.getReduxState());
        const receivedMessageState = reduxState.reqRes.currentResponse.response.messages[0].data;
        expect(receivedMessageState).to.equal('hi!');
      });
    });

    describe('Checking to see that closing the connection is confirmed on the back-end', async () => {

      it('Closing connection updates connection status of back-end state', async () => {
        await page.locator('button >> text=Close Connection').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        const connectionStatus = reduxState.reqRes.currentResponse.connection;
        expect(connectionStatus).to.equal('closed');
      });
    });
  });
};