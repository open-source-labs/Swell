const chai = require("chai");
const fs = require("fs");
const path = require("path");
const grpcObj = require("../pageObjects/GrpcObj.js");
const grpcServer = require("../grpcServer.js");
const app = require("../testApp.js");

const { expect } = chai;

module.exports = () => {
  describe("gRPC Testing Controller", () => {
    // Store the text data from hw2.proto into a variable labeled proto.
    let proto = "";

    // These functions run before any of the "it" tests.
    before(async () => {
      // try {
      await grpcObj.selectedNetwork.click();
      await grpcObj.gRPCNetwork.click();
      // Read the data on the hw2.proto file.
      fs.readFile(path.join(__dirname, "../hw2.proto"), "utf8", (err, data) => {
        if (err) console.log(err);
        // Save the data to the proto file.
        proto = data;
      });
      // } catch (err) {
      //   console.error(err);
      // }
    });

    before(async () => {
      try {
        // Clear the workspace.
        // await grpcObj.removeBtn.click();
        // Invoke the "main" function (to instantiate a server) from grpcServer.js
        // grpcServer("open");
        // Set up the composer with some boilerplate.
        // await composerSetup();
        // await grpcObj.openSelectServiceDropdown.click();
      } catch (err) {
        console.error(err);
      }
    });

    const composerSetup = async () => {
      try {
        await grpcObj.selectedNetwork.click();
        await grpcObj.gRPCNetwork.click();
        await grpcObj.url.addValue("0.0.0.0:30051");
        await grpcObj.grpcProto.addValue(proto);
        await grpcObj.saveChanges.click();
      } catch (err) {
        console.error(err);
      }
    };

    const addReqAndSend = async () => {
      try {
        // Adds request to the Workspace.
        await grpcObj.addRequestBtn.click();
        // Sends the request.
        await grpcObj.sendBtn.click();
      } catch (err) {
        console.error(err);
      }
    };

    // Bring in the Clear & Fill Test Script Area for improved code readability.

    const clearAndFillTestScriptArea = async (script) => {
      try {
        // click the view tests button to reveal the test code editor
        await app.client.$("span=View Tests").click();
        // set the value of the code editor to be some hard coded simple assertion tests
        await grpcObj.clearTestScriptAreaAndWriteKeys(script);
        // Close the tests view pane.
        await app.client.$("span=Hide Tests").click();
      } catch (err) {
        console.error(err);
      }
    };

    it("Basic testing functionality should work.", async () => {
      // await grpcObj.selectServiceGreeter.click();
      await grpcObj.selectRequestBidiButton.click();
      await grpcObj.selectRequestSayHelloFromDropDown.click();
      // Write the script, and add it to the tests inside of composer.
      const script = "assert.strictEqual(3, 3, 'Expect correct types.');";
      await clearAndFillTestScriptArea(script);
      await addReqAndSend();
      // Select the Tests column inside of Responses pane.
      await app.client.$("a=Tests").click();
      // Select the results of the first test, and check to see its status.
      const testStatus = await app.client.$("#TestResult-0-status").getText();
      // Check status.
      expect(testStatus).to.equal("PASS");
      await grpcObj.removeBtn.click();
    });

    it("Testing functionality for expects should pass.", async () => {
      const script =
        "expect([1, 2]).to.be.an('array').that.does.not.include(3);";
      await clearAndFillTestScriptArea(script);
      await addReqAndSend();
      await app.client.$("a=Tests").click();
      const testStatus = await app.client.$("#TestResult-0-status").getText();
      expect(testStatus).to.equal("PASS");
      await grpcObj.removeBtn.click();
    });

    it("Should access headers properties within the response object.", async () => {
      // Dot notation does not work with hyphenated names.
      const script =
        "assert.strictEqual(response.headers['content-type'], 'application/grpc+proto');";
      await clearAndFillTestScriptArea(script);
      await addReqAndSend();
      await app.client.$("a=Tests").click();
      const testStatus = await app.client.$("#TestResult-0-status").getText();
      expect(testStatus).to.equal("PASS");
      await grpcObj.removeBtn.click();
    });

    it("Should access events properties within the response object.", async () => {
      const script = `assert.strictEqual(response.events[0].message, "Hello string");`;
      await clearAndFillTestScriptArea(script);
      await addReqAndSend();
      await app.client.$("a=Tests").click();
      const testStatus = await app.client.$("#TestResult-0-status").getText();
      expect(testStatus).to.equal("PASS");
      await grpcObj.removeBtn.click();
    });

    it("Should handle multiple variable declarations and newlines.", async () => {
      const script = `const grpcTestVariable = "Hello string"; \nassert.strictEqual(response.events[0].message, grpcTestVariable)`;
      await clearAndFillTestScriptArea(script);
      await addReqAndSend();
      await app.client.$("a=Tests").click();
      const testStatus = await app.client.$("#TestResult-0-status").getText();
      expect(testStatus).to.equal("PASS");
      await grpcObj.removeBtn.click();
    });
  });
};
