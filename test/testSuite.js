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
 * there is room for better optimizatilson of end-to-end testing.
 *
 * @todo As of v.13, all tests should be passing EXCEPT:
 * - openAPITest()
 *
 *  Above tests are failing due to one of the following:
 * - Test-cases are no longer up-to-date with how the current UI functions
 * - Functionality in the app simply is not working as intended
 *
 * These features have incomplete and/or non-existent testing infrastructure:
 * - webRTCTest() - for read-only server input (which is the current state of the app)
 * - tRPC feature does not have E2E tests
 *
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

//& new integration tests
const httpIntegrationTests = require('./IntegrationTests/httpIntegrationTests');
const grpcIntegrationTests = require('./IntegrationTests/grpcIntegrationTests');
const graphQLIntegrationTests = require('./IntegrationTests/graphqlIntegrationTests');
const webRTCIntegrationTests = require('./IntegrationTests/webRTCIntegrationTests');
const websocketIntegrationTests = require('./IntegrationTests/websocketIntegrationTests');

// Package requirements
const path = require('path');
const fs = require('fs-extra');

// Remove all files from "failedTests" directory on launching the tests, we want only the most recent test screenshots
fs.emptyDirSync(path.resolve(__dirname + '/failedTests'));

// Testing suite
describe('Electron UI Rendering', function () {
  // group of tests that focuses on how app renders its UI + handles screenshots for failed tests
  appOpensTests();
}).timeout(20000);

describe('Protocol selection and usage', function () {
  //group of tests that focuses on how application handles different protocols
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

describe('Integration testing', function () {
  httpIntegrationTests();
  grpcIntegrationTests();
  graphQLIntegrationTests();
  webRTCIntegrationTests();
  websocketIntegrationTests();
}).timeout(20000)
