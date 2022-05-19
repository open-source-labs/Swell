// Confirm testing of request/response works for grpc

const grpcServer = require('../grpcServer.js');
const {_electron: electron} = require('playwright');
const chai = require('chai')
const expect = chai.expect
const path = require('path');
const fs = require('fs');

let electronApp, page, num=0;


module.exports = () => {

  const setupFxn = function() {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      page = electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);
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

  describe('gRPC Testing Controller', () => {
    setupFxn();
    // Store the text data from hw2.proto into a variable labeled proto.
    let proto = '';

    // These functions run before any of the "it" tests.
    
    before(async () => {
      // try {
        
        await page.locator('button>> text=GRPC').click();
      // Read the data on the hw2.proto file.
      try {
        fs.readFile(path.join(__dirname, '../hw2.proto'), 'utf8', (err, data) => {
          if (err) console.log(err);
          // Save the data to the proto file.
          proto = data;
        });
      } catch (err) {
        console.error(err);
      }

      grpcServer('open');
      await composerSetup();
      // } catch (err) {
      //   console.error(err);
      // }
    });

    // comment back in if testing grpcTestingTest on its own
    // before(async () => {
    //   try {
    //     // Clear the workspace.
    //     // await grpcObj.removeBtn.click();
    //     // Invoke the "main" function (to instantiate a server) from grpcServer.js
    //     // grpcServer("open");
    //     // Set up the composer with some boilerplate.
    //     // await composerSetup();
    //     // await grpcObj.openSelectServiceDropdown.click();
    //   } catch (err) {
    //     console.error(err);
    //   }
    // });

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
      } catch (err) {
        console.error(err);
      }
    };

    // Bring in the Clear & Fill Test Script Area for improved code readability.
    const clearAndFillTestScriptArea = async (script) => {
      try {
        // click the view tests button to reveal the test code editor
        await page.locator('span >> text=View Tests').click();
        // set the value of the code editor to be some hard coded simple assertion tests
        
        const codeMirror2 = await page.locator('#test-script-entry');
        await codeMirror2.click();
        const scriptBody = await codeMirror2.locator('.cm-content');

        try {
          scriptBody.fill('')
          await scriptBody.fill(script);
        } catch (err) {
          console.error(err);
        }

        // Close the tests view pane.
        await page.locator('span >> text=Hide Tests').click();
      } catch (err) {
        console.error(err);
      }
    };

    it('Basic testing functionality should work.', async () => {
      await page.locator('#SayHelloBidi-button').click();
      await page.locator('a >> text=SayHello').click();
      // Write the script, and add it to the tests inside of composer.
      const script = "assert.strictEqual(3, 3, 'Expect correct types.');";
      await clearAndFillTestScriptArea(script);
      await addReqAndSend(num);
      // Select the Tests column inside of Responses pane.
      await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
      // Select the results of the first test, and check to see its status.
      const testStatus = await page.locator('#TestResult-0-status').innerText();
      // Check status.
      expect(testStatus).to.equal('PASS');
      await page.locator('button >> text=Remove').click();
    });

    it('Testing functionality for expects should pass.', async () => {
      const script =
        "expect([1, 2]).to.be.an('array').that.does.not.include(3);";
      await clearAndFillTestScriptArea(script);
      await addReqAndSend(num);
      await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
      const testStatus = await page.locator('#TestResult-0-status').innerText();
      expect(testStatus).to.equal('PASS');
      await page.locator('button >> text=Remove').click();
    });

    it('Should access headers properties within the response object.', async () => {
      // Dot notation does not work with hyphenated names.
      const script =
        "assert.strictEqual(response.headers['content-type'], 'application/grpc+proto');";
      await clearAndFillTestScriptArea(script);
      await addReqAndSend(num);
      await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
      const testStatus = await page.locator('#TestResult-0-status').innerText();
      expect(testStatus).to.equal('PASS');
      await page.locator('button >> text=Remove').click();
    });

    it('Should access events properties within the response object.', async () => {
      const script = `assert.strictEqual(response.events[0].message, "Hello string");`;
      await clearAndFillTestScriptArea(script);
      await addReqAndSend(num);
      await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
      const testStatus = await page.locator('#TestResult-0-status').innerText();
      expect(testStatus).to.equal('PASS');
      await page.locator('button >> text=Remove').click();
    });

    it('Should handle multiple variable declarations and newlines.', async () => {
      const script = `const grpcTestVariable = "Hello string"; \nassert.strictEqual(response.events[0].message, grpcTestVariable)`;
      await clearAndFillTestScriptArea(script);
      await addReqAndSend(num);
      await page.locator('a >> text=Tests').click(); // This causes rendering to fail >_>
      const testStatus = await page.locator('#TestResult-0-status').innerText();
      expect(testStatus).to.equal('PASS');
      await page.locator('button >> text=Remove').click();
    });
  }).timeout(20000);
};
