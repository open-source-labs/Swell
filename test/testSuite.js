// Integration test for electron for spectron
// ****** use "npm run test-mocha" to run these tests ******

// import other tests
const appOpensTests = require("./subSuites/appOpens");
const reqInputTests = require("./subSuites/reqInputTests");
const addRequestTests = require("./subSuites/addRequestTests");
const httpTest = require("./subSuites/httpTest");
const websocketTest = require("./subSuites/websocketTest");
const grpcTest = require("./subSuites/grpcTest");
const graphqlTest = require('./subSuites/graphqlTest')

const app = require("./testApp");

describe("Electron Tests", function () {
  this.timeout(60000);
  before(function () {
    return app.start();
  });

  after(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  // these are are test suites within this broader suite
  appOpensTests();

  describe("CRUD functionality", function () {
    reqInputTests();
    addRequestTests();
    httpTest();
    websocketTest();
    grpcTest();
    graphqlTest();
  });
});
