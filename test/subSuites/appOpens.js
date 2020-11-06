const assert = require("assert");
const path = require("path");
const fs = require("fs");
const app = require('../testApp');


module.exports = () => {

  describe('App opens and renders a page', () => {
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
      it("Composer panel exists", async () => {
        await app.client.waitUntilWindowLoaded();
        // $ is basically querySelector
        const composer = await app.client.$("#composer");
        return assert.notEqual(composer.value, null);
      });
      it("Workspace exists", async () => {
        await app.client.waitUntilWindowLoaded();
        const workspace = await app.client.$("#workspace");
        return assert.notEqual(workspace.value, null);
      });
      it("Responses panel exists", async () => {
        await app.client.waitUntilWindowLoaded();
        const responses = await app.client.$("#responses");
        return assert.notEqual(responses.value, null);
      });
    });
  }); 
}