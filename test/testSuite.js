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

describe('Electron Tests', function () {
  this.timeout(200000);
  // before and after here are to test if the app can be opened and closed
  before(() => app.start());

  after(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
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
