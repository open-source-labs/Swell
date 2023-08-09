const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');

let electronApp,
  page,
  num = 0;

//TODO: May need to wrap this test tile in the following export below
// module.exports = () => {}

//TODO: may have to change project path 
const projectPath = path.resolve(__dirname, '..', '..', 'main.js');

//TODO: start server in this file rather than manually

describe('HTTP Integration Tests', function () {
  //~ Launch app
  before(async () => {
    electronApp = await electron.launch({ args: [projectPath] });
  });

  //~ Clear database and workspace before each request
  beforeEach( async () => {
    
    
    await page.locator('button >> text=Clear Workspace').click();
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

  //~ close electron app when complete
  after(async () => {
    await page.locator('button >> text=Clear Workspace').click();
    await electronApp.close();
  });

  describe('HTTP POST Request Test', () => {
    it('sample test...', () => {
    });
  });


}).timeout(20000);
