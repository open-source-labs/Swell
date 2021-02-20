const { Application } = require("spectron");
const electronPath = require("electron");
// Require Electron from the binaries included in node_modules.
const path = require("path");

/* ## How to run tests

To run functional tests that check for functionality of each API network protocol, use: "npm run test-mocha"

Note: For the HTTP test to work, you will have to add a .env file with any MONGO URI.
E.g., MONGO_URI = "mongodb+srv://YOUR_URL"
*/

const TEST_MODE = "TEST_MODE";

const app = new Application({
  // Your electron path can be any binary
  // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
  // But for the sake of the example we fetch it from our node_modules.
  requireName: "electronRequire",
  path: electronPath,
  // The following line tells spectron to look and use the main.js file
  // and the package.json located 1 level above along with an arg, 'TEST_MODE'
  args: [path.join(__dirname, ".."), TEST_MODE],
});

module.exports = app;
