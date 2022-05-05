// End-to-end testing on the electron app using Playwright
// ****** use "npm run test-mocha" or "npm run test" to run these tests ******

// Import various tests
const appOpensTests = require('./subSuites/appOpens');
const reqInputTests = require('./subSuites/reqInputTests');
const httpTest = require('./subSuites/httpTest');
const websocketTest = require('./subSuites/websocketTest');
const grpcTest = require('./subSuites/grpcTest');
const graphqlTest = require('./subSuites/graphqlTest');
const httpTestingTest = require('./subSuites/httpTestingTest');
const graphqlTestingTest = require('./subSuites/graphqlTestingTest');
const grpcTestingTest = require('./subSuites/grpcTestingTest');
const webRTCTest = require('./subSuites/webRTCTest');

// Package requirements
const path = require('path');
const fs = require('fs-extra');

// Remove all files from "failedTests" directory on launching the tests, we want only the most recent test screenshots
fs.emptyDirSync(path.resolve(__dirname + '/failedTests'));


// Testing suite 
describe('Electron UI Rendering', function () {
  appOpensTests();
}).timeout(10000);

describe('CRUD functionality', function () {
  reqInputTests(); 
  httpTest(); //Comment out because no Mongo URI for test server
  graphqlTest();
  websocketTest();
  grpcTest();
  webRTCTest();
}).timeout(10000);

describe("Swell Testing functionality", function () {
  httpTestingTest();
  grpcTestingTest();
  graphqlTestingTest();
}).timeout(10000);

