const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');

let electronApp,
  page,
  num = 0;

  const projectPath = path.resolve(__dirname, '..', '..', 'main.js');

  //TODO: Make an integration test that covers the state changes that occur in Mutation/Query 
    //check for test redundancy 
  
    //NOTE: There is only a POST Mutation set up in the local
    // mock API server
    const url = 'http://localhost:4000/graphql';

module.exports = () => {
  describe('GraphQL Integration Tests', function() {
    
    // open Electron App, click on GraphQL section, fill in mock server URL
    before(async () => {
      electronApp = await electron.launch({ args: [projectPath] });
      await new Promise(resolve => setTimeout(resolve, 1000)); // giving electron time to initialize
      page = await electronApp.windows()[0]; // defining page variable
      await page.waitForLoadState(`domcontentloaded`);
      const gqlPath = 'button >> text=GraphQL';
      await page.locator(gqlPath).click();
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
      }
    });

    describe('Check to see if GraphQL functionality properly interacts with back-end for Mutations', async () => {
      
      it('Changes method on newRequestFields state when navigating to MUTATION type query', async() => {
        await page.locator('button >> text=QUERY').click();
        await page.locator('div a.dropdown-item:has-text("MUTATION")').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequestFields.method).to.equal("MUTATION");
      });

      it('Navigation to GraphQL sets newRequestHeaders state appropriately', async() => {
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequest.newRequestHeaders.headersArr[0].key).to.equal("Content-Type");
        expect(reduxState.newRequest.newRequestHeaders.headersArr[0].value).to.equal("application/json");
      });

      it('Changes newRequestFields state appropriately when filling in GraphQL URL', async() => {
        await page.locator('#url-input').fill(url);
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequestFields.gqlUrl).to.equal(url);
        expect(reduxState.newRequestFields.url).to.equal(url);
      });

      it('Changes newRequestFields state appropriately when adding to Req Body', async() => {
        const mutationReqBody = `mutation {post(url: "www.newsite.com" description: "newdesc"){url description}}`
        const codeMirror = await page.locator('#gql-body-entry');
        await codeMirror.click();
        const gqlBodyCode = await codeMirror.locator('.cm-content');
        await gqlBodyCode.fill(mutationReqBody);
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequest.newRequestBody.bodyContent).to.equal('mutation {post(url: "www.newsite.com" description: "newdesc"){url description}}');
      });

      it('Adding mutation to workspace appropriately changes reqRes state', async() => {
        
      })
    });
  });
};