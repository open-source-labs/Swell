const {_electron: electron} = require('playwright');
const chai = require('chai')
const expect = chai.expect
const path = require('path');
const fs = require('fs');

let electronApp, page;

module.exports = () => {

  const setupFxn = function() {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      page = electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);

      await page.locator('button >> text=Clear Workspace').click();

    });
    
    // close Electron app when complete
    after(async () => {
      await electronApp.close();

      try {
      } catch (err) {
        console.error(err);
      }

    });

    afterEach(async function() {
      if (this.currentTest.state === 'failed') {
        console.log(`Screenshotting failed test window`)
        const imageBuffer = await page.screenshot();
        fs.writeFileSync(path.resolve(__dirname + '/../failedTests', `FAILED_${this.currentTest.title}.png`), imageBuffer)
      }
    });
  }

  describe('webRTC request testing', () => {
    setupFxn();

    // This will fill out the composer with a GraphQL request when invoked.
    const fillServerInfo = async (
      server
    ) => {
      try {
        // click and check 
        await page.locator('#selected-network').click();
        await page.locator('#composer >> a >> text=WebRTC').click();
     

        // select STUN or TURN servers, clear it, and type in server
        const codeMirror = await page.locator('.react-codemirror2');
        await codeMirror.click();
        const webRTCServer = await codeMirror.locator('textarea');

        try {
          for (let i = 0; i < 100; i += 1) {
            await webRTCServer.press('Backspace');
          }
          await webRTCServer.fill(server);
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        console.error(err);
      }
    };

    // This will add and send the most recent request in the workspace.
    const addAndCreateLocalSDP = async () => {
      try {
        await page.locator('button >> text=Add to Workspace').click();
        await page.locator(`text=Create Local SDP`).click();
      } catch (err) {
        console.error(err);
      }
    };


    it('it should be able to add a server to the workspace', async () => {
      
      const server = '[{"urls": "stun:stun1.l.google.com:19302"}]'

      // type in server
      await fillServerInfo(server);
      await addAndCreateLocalSDP();
      await page.locator(`text=Remove`).click();
      const SDP = await page.locator(`text=Create Local SDP`);
      expect(await SDP.count()).to.equal(0)
    });

    
  });
};
