// test to verify main window is opened with a title
const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron");
const path = require("path");

describe("Application launch", function () {
  setTimeout(10000);
  beforeEach(function () {
    app = new Application({
      // Your electron path can be any binary
      // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
      // But for the sake of the example we fetch it from our node_modules.
      path: path.resolve(__dirname, "../main.js"),
      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      // args: [path.join(__dirname, '..')]
    });
    return app.start();
  });

  afterEach(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it("shows an initial window", function () {
    return app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1);
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      // assert.equal(count, 2)
    });
  });
});

// const app = new Application({
//   path: path.resolve(__dirname, "../main.js"),
// path: electronPath,
// args: [path.resolve(__dirname, "../")],
// });
// app
//   .start()
//   .then(() => {
//     // check if window is visible
//     return app.browserWindow.isVisible();
//   })
//   .then((isVisible) => {
//     // verify that the window is visible
//     assert.equal(isVisible, true);
//   })
//   .then(() => {
//     // get the window's title
//     return app.client.getTitle();
//   })
//   .then((title) => {
//     // verify the window's title
//     assert.equal(title, "Swell");
//   })
//   .then(() => {
//     // stop the application
//     return app.stop();
//   })
//   .catch((err) => {
//     // log any errors
//     console.error("test failed", err.message);
//   })
