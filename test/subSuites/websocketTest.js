/* eslint-disable no-async-promise-executor */
const {_electron: electron} = require('playwright');
const chai = require('chai')
const expect = chai.expect;
const path = require('path');
const fs = require('fs-extra');

let electronApp, page, num, messageNum;

module.exports = () => {

  const setupFxn = function() {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      page = electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);

      num=0
      messageNum = 0;
    });
    
    // close Electron app when complete
    after(async () => {
      await electronApp.close();
    });

    afterEach(async function() {
      if (this.currentTest.state === 'failed') {
        console.log(`Screenshotting failed test window`)
        const imageBuffer = await page.screenshot();
        fs.writeFileSync(path.resolve(__dirname + '/../failedTests', `FAILED_${this.currentTest.title}.png`), imageBuffer)
      }
    });
  }


  describe('Websocket requests', () => {
    setupFxn();

    before(async () => {
      await page.locator('button >> text=Clear Workspace').click();
    });

    const addAndSend = async (num) => {
      try {
        await page.locator('button >> text=Add to Workspace').click();
        await page.locator(`#send-button-${num}`).click();
      } catch (err) {
        console.error(err);
      }
    };

    // after(() => {
    //   app.client.$('button=Clear Workspace').click();
    // });

    it('it should send and receive messages to the mock server', async () => {
      try {
        // select web sockets
        await page.locator('button>> text=WEB SOCKET').click();

        // type in url
        await page.locator('#url-input').fill('ws://localhost:5000/'); // TODO: Should we be using our own local server to test this? Could be easier to go third party

        //
        await addAndSend(num++);

        await new Promise((resolve) =>
          setTimeout(async () => {
            try {
              await page.locator('#wsSendData').click();
              await page.locator('#wsMsgInput').fill('testing websocket protocol');
              await page.locator('button >> text=Send Message').click();

              await new Promise((resolve) =>
                setTimeout(async () => {
                  try {
                    const messageClient = await page.locator(`#ws-msg-${messageNum++}`).innerText();
                    const messageServer = await page.locator(`#ws-msg-${messageNum++}`).innerText();
                    expect(messageClient).to.include('testing websocket protocol');
                    expect(messageServer).to.include('testing websocket protocol');
                    resolve();
                  } catch (err) {
                    console.error(err);
                  }
                }, 300)
              );
              resolve();
            } catch (err) {
              console.error(err);
            }
          }, 1000)
        );
      } catch (err) {
        console.error(err);
      }
    });

    it('it should send and receive images to public echo test', async () => {
      try {
        await new Promise(async (resolve) => {
          try {
            const toUpload = path.join(
              __dirname,
              '..',
              '..',
              'build',
              'icons',
              'png',
              '128x128.png'
            );

            const handle = await page.locator('input[type="file"]');
            await handle.setInputFiles(toUpload);
            

            // const val = app.client.getValue("#upload-test");
            await page.locator('#wsSendImgBtn').click();

            // why is this checking the first message again? shouldnt it check the image?
            await new Promise((resolve) =>
                setTimeout(async () => {
                  try {
                    const messageClient = await page.locator(`#ws-msg-${messageNum++}`);
                    const messageServer = await page.locator(`#ws-msg-${messageNum++}`);
                    expect(await messageClient.innerHTML()).to.include('img');
                    expect(await messageServer.innerHTML()).to.include('img');
                    resolve();
                  } catch (err) {
                    console.error(err);
                  }
                }, 300)
            );
            resolve();
          } catch (err) {
            console.error(err);
          }
        });
      } catch (err) {
        console.error(err);
      }
    });
  }).timeout(20000);
};
