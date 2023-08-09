const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');

// const { RootState } = require('../../src/client/toolkit-refactor/store.ts');

let electronApp,
  page,
  num = 0;

//TODO: May need to wrap this test tile in the following export below
// module.exports = () => {}

//TODO: may have to change project path 
const projectPath = path.resolve(__dirname, '..', '..', 'main.js');

//TODO: start server in this file rather than manually

module.exports = () => {
  describe('HTTP Integration Tests', function () {
    //~ Launch app
    before(async () => {
      electronApp = await electron.launch({ args: [projectPath] });
      await new Promise(resolve => setTimeout(resolve, 1000));
      page = await electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);
    });

    //~ Reset before each request
    beforeEach(async () => {
      // clear workspace
      if (page) await page.locator('button >> text=Clear Workspace').click();

      // clear DB
      await new Promise((resolve, reject) => {
        chai
          .request('http://localhost:3004')
          .get('/clear')
          .end((err, res) => {
            if (err) reject(err);
            else resolve(res);
          });
      });
    })

    // //~ If failed, add screenshot to folder
    // afterEach(async function () {
    //   if (this.currentTest.state === 'failed') {
    //     console.log(`Screenshotting failed test window`);
    //     const imageBuffer = await page.screenshot();
    //     fs.writeFileSync(
    //       path.resolve(
    //         __dirname + '/../failedTests',
    //         `FAILED_${this.currentTest.title}.png`
    //       ),
    //       imageBuffer
    //     );
    //   }
    // });

    // //~ close electron app when complete
    // after(async () => {
    //   console.log('here')
    //   if (page) await page.locator('button >> text=Clear Workspace').click();
    //   await electronApp.close();
    // });

    describe('HTTP POST Request Test', async () => {
      const url = 'http://localhost:3004/book';

      // // Load RootState before running the tests
      // before(async () => {
      //   const module = await import('../../src/client/toolkit-refactor/store.ts');
      //   RootState = module.RootState;
      // });

      //& check if state changed
      it('Changes newRequestFields state to have correct url', async () => {
        await page.locator('#url-input').fill(url);
        // await console.log(RootState.newRequestFields)
        // Fetch and log the Redux state from Electron app
        // const reduxState = await page.evaluate(() => window.getReduxState());
        const reduxState = await page.evaluate(() => window.getReduxState());
        console.log(reduxState);

      });
    });


  }).timeout(20000);
};
