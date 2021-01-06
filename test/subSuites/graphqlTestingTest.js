const chai = require("chai");
const composerObj = require('../pageObjects/ComposerObj.js');
const workspaceObj = require('../pageObjects/WorkspaceObj.js');
const app = require('../testApp.js');
const graphqlServer = require('../graphqlServer')

const expect = chai.expect;

module.exports = () => {
  describe("GraphQL Testing Controller", () => {


    // This will fill out the composer with a GraphQL request when invoked.
    const fillGQLRequest = async (url, method, body = '', variables = '', headers = [], cookies = []) => {

      try {
        // click and check GRAPHQL
        await composerObj.selectedNetwork.click();
        await app.client.$('a=REST').click();
        await composerObj.selectedNetwork.click();
        await app.client.$('a=GRAPHQL').click();

        // click and select METHOD if it isn't QUERY
        if (method !== 'QUERY') {
          await app.client.$('span=QUERY').click();
          await app.client.$(`a=${method}`).click();
        }

        // type in url
        await composerObj.url.setValue(url);

        // set headers
        headers.forEach(async ({ key, value }, index) => {
          await app.client.$(`//*[@id="header-row${index}"]/input[1]`).setValue(key);
          await app.client.$(`//*[@id="header-row${index}"]/input[2]`).setValue(value);
          await app.client.$('button=+ Header').click();
        });

        // set cookies
        cookies.forEach(async ({ key, value }, index) => {
          await app.client.$(`//*[@id="cookie-row${index}"]/input[1]`).setValue(key);
          await app.client.$(`//*[@id="cookie-row${index}"]/input[2]`).setValue(value);
          await app.client.$('button=+ Cookie').click();
        });

        // select Body and type in body
        await composerObj.clearGQLBodyAndWriteKeys(body);

        // select Variables and type in variables
        await composerObj.clickGQLVariablesAndWriteKeys(variables);

      } catch (err) {
        console.error(err)
      }
    };

    // This will add and send the most recent request in the workspace.
    const addAndSend = async () => {
      try {
        await composerObj.addRequestBtn.click();
        await workspaceObj.latestSendRequestBtn.click();
      } catch (err) {
        console.error(err);
      }
    }

    const clearAndFillTestScriptArea = async (script) => {
      try {
        // click the view tests button to reveal the test code editor
        await app.client.$("span=View Tests").click();
        // set the value of the code editor to be some hard coded simple assertion tests
        await composerObj.clearTestScriptAreaAndWriteKeys(script);
        // Close the tests view pane.
        await app.client.$("span=Hide Tests").click();
      } catch (err) {
        console.error(err);
      }
    };

    before(() => {
      app.client.$('button=Clear Workspace').click();
    })

    after(() => {
      try {
        graphqlServer.close();
        console.log('graphqlServer closed')
      } catch (err) {
        console.error(err)
      }
    })

    it("it should be able to resolve a simple passing test", async () => {
        const method = "QUERY";
        const url = "https://countries.trevorblades.com/";
        const query = 'query($code: ID!) {country(code: $code) {capital}}';
        const variables = '{"code": "AE"}';
        const script = "assert.strictEqual(3, 3, 'Expect correct types.');";

        // type in url
        await fillGQLRequest(url, method, query, variables);
        await clearAndFillTestScriptArea(script);
        await addAndSend();

        // Select the Tests column inside of Responses pane.
        await app.client.$("a=Tests").click();

        const testStatus = await new Promise((resolve) => {
          setTimeout(async () => {
            const text = await app.client.$("#TestResult-0-status").getText();
            resolve(text);
          }, 500);
          // block for 500 ms since we need to wait for a response; normally test server would
          // respond fast enough since it is localhost and not a remote server
        });
        expect(testStatus).to.equal("PASS");
    });

    it("it should be able to resolve a simple failing test", async () => {
      const method = "QUERY";
      const url = "https://countries.trevorblades.com/";
      const query = 'query($code: ID!) {country(code: $code) {capital}}';
      const variables = '{"code": "AE"}';
      const script = "assert.strictEqual(3, 2, 'Expect failing test.');";

      // type in url
      await fillGQLRequest(url, method, query, variables);
      await clearAndFillTestScriptArea(script);
      await addAndSend();

      // Select the Tests column inside of Responses pane.
      await app.client.$("a=Tests").click();

      const testStatus = await new Promise((resolve) => {
        setTimeout(async () => {
          const text = await app.client.$("#TestResult-0-status").getText();
          resolve(text);
        }, 1000);
        // block for 500 ms since we need to wait for a response; normally test server would
        // respond fast enough since it is localhost and not a remote server
      });
      expect(testStatus).to.equal("FAIL");
  });

  it("it should be run test on response data", async () => {
    const method = "QUERY";
    const url = "https://countries.trevorblades.com/";
    const query = 'query($code: ID!) {country(code: $code) {capital}}';
    const variables = '{"code": "AE"}';
    const script =
        "expect(response.headers, 'headers exists on response object').to.exist;";

    // type in url
    await fillGQLRequest(url, method, query, variables);
    await clearAndFillTestScriptArea(script);
    await addAndSend();

    // Select the Tests column inside of Responses pane.
    await app.client.$("a=Tests").click();

    const testStatus = await new Promise((resolve) => {
      setTimeout(async () => {
        const text = await app.client.$("#TestResult-0-status").getText();
        resolve(text);
      }, 500);
      // block for 500 ms since we need to wait for a response; normally test server would
      // respond fast enough since it is localhost and not a remote server
    });
    expect(testStatus).to.equal("PASS");
  });

  })
}
