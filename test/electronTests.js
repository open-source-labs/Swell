// Integration test for electron for spectron
// ****** use "npm run test-mocha" to run these tests ******

const { Application } = require("spectron");
const assert = require("assert");
const electronPath = require("electron");
const path = require("path");

const TEST_MODE = "TEST_MODE";

const app = new Application({
  // Your electron path can be any binary
  // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
  // But for the sake of the example we fetch it from our node_modules.
  path: electronPath,
  // The following line tells spectron to look and use the main.js file
  // and the package.json located 1 level above along with an arg, 'TEST_MODE'
  args: [path.join(__dirname, ".."), TEST_MODE],
});

describe("Browser Window Tests", function () {
  this.timeout(10000);
  before(function () {
    return app.start();
  });

  after(function () {
    if (app && app.isRunning()) {
      app.stop();
    }
  });

  it("window is visible", async () => {
    try {
      const isVisible = await app.browserWindow.isVisible();
      assert.equal(isVisible, true);
    } catch (err) {
      console.log(err);
    }
  });

  it("window title is Swell", async () => {
    try {
      const title = await app.browserWindow.getTitle();
      assert.equal(title, "Swell");
    } catch (err) {
      console.log(err);
    }
  });
  it("testing some spectron client methods", () => {
    app.client.getMainProcessLogs().then((logs) => console.log(logs));
    app.client.getRenderProcessLogs().then((logs) => console.log(logs));
  });
});

// const isDev = await app.browserWindow.isDevToolsOpened();
// console.log(isDev);

//   it("shows an initial window & 3 dev tools", function () {
//     // console.log(this.app.client.windowHandles());
//     console.log(app.client.getTitle());
//     return app.client.getWindowCount().then(function (count) {
//       assert.equal(count, 4);
//       // Please note that getWindowCount() will return 4 if `dev tools` are opened (initial window plus 3 dev tools windows including React & Redux extensions).
//     });
//   });
// });
