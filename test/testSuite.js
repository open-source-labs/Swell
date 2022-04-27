// Integration test for electron for spectron
// ****** use "npm run test-mocha" to run these tests ******

// import other tests
const appOpensTests = require('./subSuites/appOpens');
const reqInputTests = require('./subSuites/reqInputTests');
const httpTest = require('./subSuites/httpTest');
const websocketTest = require('./subSuites/websocketTest');
const grpcTest = require('./subSuites/grpcTest');
const graphqlTest = require('./subSuites/graphqlTest');

const httpTestingTest = require('./subSuites/httpTestingTest');
const graphqlTestingTest = require('./subSuites/graphqlTestingTest');
const grpcTestingTest = require('./subSuites/grpcTestingTest');

const app = require('./testApp');
const {_electron: electron} = require('playwright');

describe('Electron Tests', function () {
  this.timeout(200000);
  // before and after here are to test if the app can be opened and closed
  let electronApp
  before(async () => {
    electronApp = await electron.launch({ args: ['main.js'] });
    // // const  = await chromium.launch();
    // const appPath = await electronApp.evaluate(async ({ app }) => {
    //   // This runs in the main Electron process, parameter here is always
    //   // the result of the require('electron') in the main app script.
    //   return app.getAppPath();
    // });
    // console.log(appPath);
  });

  after(async () => {
    await electronApp.close();
  });
  
  describe('electron app', () => {
    const window = await electronApp.firstWindow();
    // Print the title.
    console.log(await window.title());
  });
  // these are test suites within this broader suite
  appOpensTests();

  // execute differnt types of test here
  describe('CRUD functionality', () => {
    reqInputTests();
    // httpTest(); //Comment out because no Mongo URI for test server
    graphqlTest();
    websocketTest();
    grpcTest();
  });

  // describe("Swell Testing functionality", function () {
  //   httpTestingTest();
  //   grpcTestingTest();
  //   graphqlTestingTest();
  // });
});
