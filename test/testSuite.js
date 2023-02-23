/**
 * @file End-to-end testing on the electron app using Playwright
 * ****** use "npm run test-mocha" or "npm run test" to run these tests ******
 *
 * This testing suite uses Playwright to launch an instance of the Electron
 * application. Each test is in the suite below is run with a separate instance
 * of Electron, this is what setupFxn() in each of the files is. It will set up
 * Electron, and also set up functionality to screenshot the window on a failed
 * test.
 *
 * Please note many of these tests are written contingent on each other, and
 * there is room for better optimization of end-to-end testing.
 *
 * @todo openAPI testing and webRTC testing is extremely thin, essentially
 * non-existent. Webhook testing needs to be added
 *
 * @todo Much of the UI is untested, recommended to add testing suites either
 * here or in the Jest suite to confirm UI rendering. i.e. "View Response
 * History" is untested, populating the composer from workspaces is untested,
 * response cookies and headers are untested. These may be added in end-to-end
 * testing for confirmation of functionality, and in integration testing for
 * confirmation of proper rendering and usage.
 */

// Import various tests
const appOpensTests = require('./subSuites/appOpens');
const reqInputTests = require('./subSuites/reqInputTests');
const httpTest = require('./subSuites/httpTest');
const websocketTest = require('./subSuites/websocketTest');
const grpcTest = require('./subSuites/grpcTest');
const graphqlTest = require('./subSuites/graphqlTest');
const openAPITest = require('./subSuites/openAPITest');
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
}).timeout(20000);

describe('Protocol selection and usage', function () {
  reqInputTests();
  httpTest();
  graphqlTest();
  websocketTest();
  grpcTest();
  webRTCTest();
  openAPITest();
}).timeout(20000);

describe('Request/response testing functionality', function () {
  httpTestingTest();
  grpcTestingTest();
  graphqlTestingTest();
}).timeout(20000);
