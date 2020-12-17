const chai = require('chai');
const chaiHttp = require("chai-http");
const app = require('../testApp.js');
const composerObj = require('../pageObjects/ComposerObj');
const workspaceObj = require('../pageObjects/WorkspaceObj');

const { expect } = chai;

module.exports = () => {
  describe("HTTP Testing Controller", function() {
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

    afterEach("HIDE TESTS", (done) => {
      (async () => await app.client.$('span=Hide Tests').click())();
      done();
    });

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

      it("a simple assertion (assert) should PASS when making a GET request", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "assert.strictEqual(3, 3, 'correct types');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("PASS");
        }, 500);
      });

      it("a simple assertion (assert) should FAIL when making a GET request", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "assert.strictEqual(3, '3', 'wrong types');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("FAIL");
        }, 500);
      });

      it("a simple assertion (expect) should PASS when making a GET request", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "expect(3, 'correct types').to.equal(3);";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("PASS");
        }, 500);
      });

      it("a simple assertion (expect) should FAIL when making a GET request", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "expect(3, 'correct types').to.equal('3');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("FAIL");
        }, 500);
      });
    });

    describe("Multiple assertion statements", function() {
      it("should handle multiple different simple assert statements", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "assert.strictEqual(3, '3', 'wrong types');\nassert.strictEqual(3, '3', 'this assert is a message');\nassert.strictEqual(3, 3, 'correct types');\nassert.strictEqual(3, 3, 'this assert is a message');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const firstStatus = await app.client.$('#TestResult-0-status').getText();
          const secondStatus = await app.client.$('#TestResult-1-status').getText();
          const thirdStatus = await app.client.$('#TestResult-2-status').getText();
          const fourthStatus = await app.client.$('#TestResult-3-status').getText();
  
          expect(firstStatus).to.equal("FAIL");
          expect(secondStatus).to.equal("FAIL");
          expect(thirdStatus).to.equal("PASS");
          expect(fourthStatus).to.equal("PASS");
        }, 500);
      });

      it("should handle multiple different simple expect statements", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "expect(3, 'wrong types').to.equal('3');\nexpect(3, 'this expect is a message').to.equal('3');\nexpect(3, 'correct types').to.equal(3);\nexpect(3, 'this expect is a message').to.equal(3);";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const firstStatus = await app.client.$('#TestResult-0-status').getText();
          const secondStatus = await app.client.$('#TestResult-1-status').getText();
          const thirdStatus = await app.client.$('#TestResult-2-status').getText();
          const fourthStatus = await app.client.$('#TestResult-3-status').getText();
  
          expect(firstStatus).to.equal("FAIL");
          expect(secondStatus).to.equal("FAIL");
          expect(thirdStatus).to.equal("PASS");
          expect(fourthStatus).to.equal("PASS");
        }, 500);
      });
    })

    describe("Assertions on response object", function () {
      it("chai.assert: should be able to access the response object", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "assert.exists(response, 'response is object');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("PASS");
        }, 500);
      });

      it("chai.assert: should be able to access the status code from the response object", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "assert.strictEqual(response.status, 200, 'response is 200');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();
        
        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("PASS");
        }, 500);
      });

      it("chai.assert: should be able to access the cookies from the response object", async function() {
        const url = "http://google.com";
        const method = "GET";
        const script = "assert.exists(response.cookies, 'cookies exists on response object');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("PASS");
        }, 500);
      });

      it("chai.assert: should be able to access the headers from the response object", async function() {
        const url = "http://google.com";
        const method = "GET";
        const script = "assert.exists(response.headers, 'headers exists on response object');";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("PASS");
        }, 500);
      });

      it("chai.expect: should be able to access the response object", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "expect(response, 'response exists').to.exist;";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("PASS");
        }, 500);
      });

      it("chai.expect: should be able to access the status code from the response object", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "expect(response.status, 'response is 200').to.equal(200);";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();
        
        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("PASS");
        }, 500);
      });

      it("chai.expect: should be able to access the cookies from the response object", async function() {
        const url = "http://google.com";
        const method = "GET";
        const script = "expect(response.cookies, 'cookies exists on response object').to.exist;";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("PASS");
        }, 500);
      });

      it("chai.expect: should be able to access the headers from the response object", async function() {
        const url = "http://google.com";
        const method = "GET";
        const script = "expect(response.headers, 'headers exists on reponse object').to.exist;";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        setTimeout(async () => {
          const testStatus = await app.client.$('#TestResult-0-status').getText();
          expect(testStatus).to.equal("PASS");
        }, 500);
      });
    });

    describe("Using variables", function() {
      it("Test results do not render if JavaScript is entered but specifically not assertion tests", async function() {
        const url = "http://localhost:3000/book";
        const method = "GET";
        const script = "const foo = 'bar';";
        await fillRestRequest(url, method);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        await app.client.$('a=Tests').click();
        const emptyState = await app.client.$('.empty-state-wrapper');
        expect(emptyState.selector).to.equal('.empty-state-wrapper');
      })
    });
  });
};
