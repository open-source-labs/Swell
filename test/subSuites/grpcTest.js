/**
 * @file gRPC tests using "hw2.proto" file to set up gRPC in grpcServer
 *
 * @todo Possibly remove our own server from this testing suite and go with a
 * public API. Tests may fail due to the user's computer and this testing suite
 * becomes heavier with a mock server.
 */

const grpcServer = require('../grpcServer.js');
const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs-extra');

let electronApp, page, num;

module.exports = () => {
  const setupFxn = function () {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      page = electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);
      num = 0;
    });

    // close Electron app when complete
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
  };

  describe('gRPC requests', () => {
    setupFxn();

    let proto = '';

    before((done) => {
      try {
        fs.readFile(
          path.join(__dirname, '../hw2.proto'),
          'utf8',
          (err, data) => {
            if (err) console.log(err);

            /** @todo Confirm whether this assignment works */
            proto = data;
            done();
          }
        );
      } catch (err) {
        console.error(err);
      }
    });

    before(async () => {
      try {
        grpcServer('open');
        await composerSetup();
        await page.locator('#Select-Service-button').click();
      } catch (err) {
        console.error(err);
      }
    });

    after(async () => {
      try {
        await page.locator('button >> text=Clear Workspace').click();
      } catch (err) {
        console.log(err);
      }
    });

    const composerSetup = async () => {
      try {
        await page.locator('button>> text=GRPC').click();
        await page.locator('#url-input').fill('0.0.0.0:30051');

        const codeMirror = await page.locator('#grpcProtoEntryTextArea');
        await codeMirror.click();
        const grpcProto = await codeMirror.locator('.cm-content');
        await grpcProto.fill(proto);

        await page.locator('#save-proto').click();
      } catch (err) {
        console.error(err);
      }
    };

    const addReqAndSend = async (num) => {
      try {
        await page.locator('button >> text=Add to Workspace').click();
        await page.locator(`#send-button-${num}`).click();
        const res = await page.locator('#events-display').innerText();
        return res;
      } catch (err) {
        console.error(err);
      }
    };

    it('it should work on a unary request', async () => {
      try {
        await page.locator('#composer >> a >> text=Greeter').click();
        await page.locator('#Select-Request-button').click();
        await page.locator('a >> text=SayHello').click();
        const jsonPretty = await addReqAndSend();
        await new Promise((resolve) =>
          setTimeout(() => {
            expect(jsonPretty).to.include(`"message": "Hello string"`);
            resolve();
          }, 800)
        );
      } catch (err) {
        console.error(err);
      }
    });

    it('it should work on a nested unary request', async () => {
      try {
        await page.locator('#SayHello-button').click();
        await page.locator('a >> text=SayHelloNested').click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty).to.include('"serverMessage":');
        expect(jsonPretty).to.include('"message": "Hello! string"');
        const helloStrArray = jsonPretty.match(/"message": "Hello! string"/g);
        expect(helloStrArray).to.have.lengthOf(2);
      } catch (err) {
        console.error(err);
      }
    });

    it('it should work on a server stream', async () => {
      try {
        await page.locator('#SayHelloNested-button').click();
        await page.locator('a >> text=SayHellosSs').click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty.match(/"message"/g)).to.have.lengthOf(5);
        expect(jsonPretty).to.include('hello!!! string');
      } catch (err) {
        console.error(err);
      }
    });

    it('it should work on a client stream', async () => {
      try {
        await page.locator('#SayHellosSs-button').click();
        await page.locator('a >> text=SayHelloCS').click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty).to.include('"message": "received 1 messages"');
      } catch (err) {
        console.error(err);
      }
    });
    it('it should work on a bidirectional stream', async () => {
      try {
        await page.locator('#SayHelloCS-button').click();
        await page.locator('a >> text=SayHelloBidi').click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty).to.include('"message": "bidi stream: string"');
      } catch (err) {
        console.error(err);
      }
    });
  }).timeout(20000);
};
