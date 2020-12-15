const chai = require('chai');
const chaiHttp = require("chai-http");
const app = require('../testApp.js');
const composerObj = require('../pageObjects/ComposerObj');
const workspaceObj = require('../pageObjects/WorkspaceObj');

const { expect } = chai;

module.exports = () => {
  describe("HTTP Testing Controller", function() {
    // code below is from httpTest.js file
    const fillRestRequest = async (url, method, body = '', headers = [], cookies = []) => {
      try {
        // click and check REST
        await composerObj.selectedNetwork.click();
        await app.client.$('a=REST').click();
        
        // click and select METHOD if it isn't GET
        if(method !== 'GET') {
          await app.client.$('span=GET').click();
          await app.client.$(`a=${method}`).click();
        }

        // type in url
        await composerObj.url.setValue(url);

        // set headers
        headers.forEach(async ({ key, value },index) => {
          await app.client.$(`//*[@id="header-row${index}"]/input[1]`).setValue(key);
          await app.client.$(`//*[@id="header-row${index}"]/input[2]`).setValue(value);
          await app.client.$('button=+ Header').click();
        });

        // set cookies
        cookies.forEach(async ({ key, value },index) => {
          await app.client.$(`//*[@id="cookie-row${index}"]/input[1]`).setValue(key);
          await app.client.$(`//*[@id="cookie-row${index}"]/input[2]`).setValue(value);
          await app.client.$('button=+ Cookie').click();
        });

        // Add BODY as JSON if it isn't GET
        if (method !== "GET") {
          // select body type JSON
          await app.client.$('span=text/plain').click();
          await app.client.$('a=application/json').click();
          // insert JSON content into body
          await composerObj.clearRestBodyAndWriteKeys(body);
        }
      } catch(err) {
        console.error(err)
      }
    };

    const addAndSend = async () => {
      try {
        await composerObj.addRequestBtn.click();
        await workspaceObj.latestSendRequestBtn.click();
      } catch(err) {
        console.error(err);
      }
    };

    const clearAndFillTestScriptArea = async (script) => {
      try {
        // click the view tests button to reveal the test code editor
        await app.client.$('span=View Tests').click();
        // set the value of the code editor to be some hard coded simple assertion tests
        await composerObj.clearTestScriptAreaAndWriteKeys(script);
      } catch (err) {
        console.error(err);
      }
    };

    // ==================================================================

    describe("simple assertions w/ chai.assert and chai.expect", function() {
      before("CLEAR DB", (done) => {
        chai.request("http://localhost:3000")
          .get("/clear")
          .end(function(err, res) {
            done();                               // <= Call done to signal callback end
          });
      });

      after("CLEAR DB", (done) => {
        chai.request("http://localhost:3000")
          .get("/clear")
          .send()
          .end(function(err, res) {
            done();                               // <= Call done to signal callback end
          });
      });

      afterEach("HIDE TESTS", () => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            await app.client.$('span=Hide Tests').click();
            resolve();
          }, 0);
        });
      });

      it("a simple assertion (assert) should PASS when making a GET request", async function() {
        try {
          const url = "http://localhost:3000/book";
          const method = "GET";
          const script = "assert.strictEqual(3, 3, 'correct types');";
          await fillRestRequest(url, method);
          await clearAndFillTestScriptArea(script);
          await addAndSend();
          await new Promise((resolve) => 
            setTimeout(async () => {
              await app.client.$('a=Tests').click();
              const testStatus = await app.client.$('#TestResult-0-status').getText();
              expect(testStatus).to.equal("PASS");
              resolve();
            }, 0)
          );
        } catch (err) {
          console.error(err);
        }
      });

      it("a simple assertion (assert) should FAIL when making a GET request", async function() {
        try {
          const url = "http://localhost:3000/book";
          const method = "GET";
          const script = "assert.strictEqual(3, '3', 'wrong types');";
          await fillRestRequest(url, method);
          await clearAndFillTestScriptArea(script);
          await addAndSend();
          await new Promise((resolve) => 
            setTimeout(async () => {
              await app.client.$('a=Tests').click();
              const testStatus = await app.client.$('#TestResult-0-status').getText();
              expect(testStatus).to.equal("FAIL");
              resolve();
            }, 0)
          );
        } catch (er) {
          console.error(err);
        }
      });

      it("a simple assertion (expect) should PASS when making a GET request", async function() {
        try {
          const url = "http://localhost:3000/book";
          const method = "GET";
          const script = "expect(3).to.equal(3);";
          await fillRestRequest(url, method);
          await clearAndFillTestScriptArea(script);
          await addAndSend();
          await new Promise((resolve) => 
            setTimeout(async () => {
              await app.client.$('a=Tests').click();
              const testStatus = await app.client.$('#TestResult-0-status').getText();
              expect(testStatus).to.equal("PASS");
              resolve();
            }, 0)
          );
        } catch (err) {
          console.error(err);
        }
      });

      it("a simple assertion (expect) should FAIL when making a GET request", async function() {
        try {
          const url = "http://localhost:3000/book";
          const method = "GET";
          const script = "expect(3).to.equal('3');";
          await fillRestRequest(url, method);
          await clearAndFillTestScriptArea(script);
          await addAndSend();
          await new Promise((resolve) => 
            setTimeout(async () => {
              await app.client.$('a=Tests').click();
              const testStatus = await app.client.$('#TestResult-0-status').getText();
              expect(testStatus).to.equal("FAIL");
              resolve();
            }, 0)
          );
        } catch (err) {
          console.error(err);
        }
      });
      
      
    });

    // describe("Assertions on response object", () => {
      
    // });
  });
}
