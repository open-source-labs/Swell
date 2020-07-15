// Integration test for electron for spectron
// ****** use "npm run test-mocha" to run these tests ******

// import other tests
const historyTests = require('./subSuites/historyTests');
const appOpensTests = require('./subSuites/appOpens'); 

const app = require('./testApp');

describe("Electron Tests", function () {
  this.timeout(10000);
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
  historyTests();
});
