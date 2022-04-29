const assert = require('assert'); // node's own assertion module
const path = require('path');
const fs = require('fs');
// const app = require('../testApp');

module.exports = (electronApp) => {
  describe('App opens and renders a page', () => {
    describe('Browser Window Tests', () => {
      it('window is visible', async () => {
        // const window = await electronApp.firstWindow();
        // console.log(window)
        // // // Print the title.
        // // console.log(window.title);
        const isVisible = await electronApp.firstWindow.isVisible();
        return assert.strictEqual(isVisible, true);
      });

      it("browser window title is 'Swell'", async () => {
        const titleWithBrowser = await app.browserWindow.getTitle();
        return assert.strictEqual(titleWithBrowser, 'Swell');
      });

      it('Confirm browser window count is 1', async () => {
        const windowCount = await app.client.getWindowCount();
        return assert.strictEqual(1, windowCount);
      });

      it('take a snapshot of app', async () => {
        const imageBuffer = await app.browserWindow.capturePage();
        fs.writeFileSync(path.resolve(__dirname, 'snapshot.png'), imageBuffer);
      });
    });
    describe('DOM Tests', () => {
      it("html file title is 'Swell'", async () => {
        const titleWithClient = await app.client
          .waitUntilWindowLoaded()
          .getTitle(); // the dom set inside dist/index.html which is set inside webpack htmlPlugin
        return assert.strictEqual(titleWithClient, 'Swell');
      });

      it('devTool should NOT open since we are in production mode', async () => {
        const isOpen = await app.browserWindow.isDevToolsOpened();
        return assert.strictEqual(isOpen, false);
      });
      it('Composer panel exists', async () => {
        await app.client.waitUntilWindowLoaded();
        // $ is basically querySelector
        const composer = await app.client.$('#composer');
        return assert.notStrictEqual(composer.value, null);
      });
      it('Workspace exists', async () => {
        await app.client.waitUntilWindowLoaded();
        const workspace = await app.client.$('#workspace');
        return assert.notStrictEqual(workspace.value, null);
      });
      it('Responses panel exists', async () => {
        await app.client.waitUntilWindowLoaded();
        const responses = await app.client.$('#responses');
        return assert.notStrictEqual(responses.value, null);
      });
    });
  });
};
