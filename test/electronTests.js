// Integration test for electron for spectron
// ****** use "npm run test-mocha" to run these tests ******

const assert = require("assert");
const path = require("path");
const fs = require("fs");

// import other tests
const historyTests = require('./historyTests');
const appOpensTests = require('./appOpens'); 

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

  appOpensTests();
  historyTests();
});
