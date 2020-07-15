// Integration test for electron for spectron
// ****** use "npm run test-mocha" to run these tests ******

const { Application } = require("spectron");
const assert = require("assert");
const electronPath = require("electron");
const path = require("path");
const fs = require("fs");

const TEST_MODE = "TEST_MODE";

const app = new Application({
  // Your electron path can be any binary
  // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
  // But for the sake of the example we fetch it from our node_modules.
  requireName: 'electronRequire',
  path: electronPath,
  // The following line tells spectron to look and use the main.js file
  // and the package.json located 1 level above along with an arg, 'TEST_MODE'
  args: [path.join(__dirname, ".."), TEST_MODE],
});

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

  describe("Browser Window Tests", () => {
    it("window is visible", async () => {
      const isVisible = await app.browserWindow.isVisible();
      return assert.equal(isVisible, true);
    });
    it("browser window title is 'Swell'", async () => {
      const titleWithBrowser = await app.browserWindow.getTitle();
      return assert.equal(titleWithBrowser, "Swell");
    });

    it("Confirm browser window count is 1", async () => {
      const windowCount = await app.client.getWindowCount();
      return assert.equal(1, windowCount);
    });
    it("take a snapshot of app", async () => {
      const imageBuffer = await app.browserWindow.capturePage();
      fs.writeFileSync(path.resolve(__dirname, "snapshot.png"), imageBuffer);
    });
  });
  describe("DOM Tests", () => {
    it("html file title is 'Swell'", async () => {
      const titleWithClient = await app.client
        .waitUntilWindowLoaded()
        .getTitle(); // the dom set inside dist/index.html which is set inside webpack htmlPlugin
      return assert.equal(titleWithClient, "Swell");
    });

    it("devTool should NOT open since we are in production mode", async () => {
      const isOpen = await app.browserWindow.isDevToolsOpened();
      return assert.equal(isOpen, false);
    });
    it("Sidebar exists", async () => {
      await app.client.waitUntilWindowLoaded();
      // $ is basically querySelector
      const sidebar = await app.client.$(".sidebar_composer-console");
      return assert.notEqual(sidebar.value, null);
    });
    it("Main Component exists", async () => {
      await app.client.waitUntilWindowLoaded();
      const content = await app.client.$(".contents");
      return assert.notEqual(content.value, null);
    });
  });
});
