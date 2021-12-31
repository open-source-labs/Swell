const assert = require('assert');
const composerObj = require('../pageObjects/ComposerObj.js');
const app = require('../testApp.js');

module.exports = () => {
  describe('URL/request method inputs', () => {
    it('can switch tabs in the composer pane', async () => {
      // click and check history
      await (await composerObj.tabsHistory).click();
      const historySelected = await (
        await app.client.$('.is-active')
      ).getText();
      assert.strictEqual(historySelected, 'History');

      // click and check composer
      await (await composerObj.tabsComposer).click();
      const composerSelected = await (
        await app.client.$('.is-active')
      ).getText();
      return assert.strictEqual(composerSelected, 'Composer');
    });

    it('can select a request type', async () => {
      let selectedNetworkText = '';
      // click and check graphQL
      await (await composerObj.selectedNetwork).click();
      await (await app.client.$('a=GRAPHQL')).click();
      selectedNetworkText = await (await composerObj.selectedNetwork).getText();
      assert.strictEqual(selectedNetworkText, 'GRAPHQL');

      // click and check WS
      await (await composerObj.selectedNetwork).click();
      await (await app.client.$('a=WEB SOCKETS')).click();
      selectedNetworkText = await (await composerObj.selectedNetwork).getText();
      assert.strictEqual(selectedNetworkText, 'WEB SOCKETS');

      // click and check gRPC
      await (await composerObj.selectedNetwork).click();
      await (await app.client.$('a=gRPC')).click();
      selectedNetworkText = await (await composerObj.selectedNetwork).getText();
      assert.strictEqual(selectedNetworkText, 'gRPC');

      // click and check WebRTC
      await (await composerObj.selectedNetwork).click();
      await (await app.client.$('a=WebRTC')).click();
      selectedNetworkText = await (await composerObj.selectedNetwork).getText();
      assert.strictEqual(selectedNetworkText, 'WebRTC');

      // click and check OpenAPI
      await (await composerObj.selectedNetwork).click();
      await (await app.client.$('a=OpenAPI')).click();
      selectedNetworkText = await (await composerObj.selectedNetwork).getText();
      assert.strictEqual(selectedNetworkText, 'OpenAPI');

      // // click and check Webhook
      // await (await composerObj.selectedNetwork).click();
      // await (await app.client.$('a=Webhook')).click();
      // selectedNetworkText = await (await composerObj.selectedNetwork).getText();
      // assert.strictEqual(selectedNetworkText, 'Webhook');

      // click and check REST
      await (await composerObj.selectedNetwork).click();
      await (await app.client.$('a=REST')).click();
      selectedNetworkText = await (await composerObj.selectedNetwork).getText();
      return assert.strictEqual(selectedNetworkText, 'REST');
    });

    it('can select a REST method', async () => {
      await (await composerObj.selectedNetwork).click();
      await (await app.client.$('a=REST')).click();

      // click and select POST
      await (await app.client.$('span=GET')).click();
      await (await app.client.$('a=POST')).click();
      assert.notStrictEqual(await app.client.$('span=POST'), null);

      // click and select PUT
      await (await app.client.$('span=POST')).click();
      await (await app.client.$('a=PUT')).click();
      assert.notStrictEqual(await app.client.$('span=PUT'), null);

      // click and select GET
      await (await app.client.$('span=PUT')).click();
      await (await app.client.$('a=GET')).click();
      assert.notStrictEqual(await app.client.$('span=PUT'), null);

      // click and select PATCH
      await (await app.client.$('span=GET')).click();
      await (await app.client.$('a=PATCH')).click();
      assert.notStrictEqual(await app.client.$('span=GET'), null);

      // click and select DELETE
      await (await app.client.$('span=PATCH')).click();
      await (await app.client.$('a=DELETE')).click();
      assert.notStrictEqual(await app.client.$('span=PATCH'), null);
    });

    it('can type url into url input', async () => {
      await (
        await composerObj.url
      ).setValue('http://jsonplaceholder.typicode.com/posts/1');
      const input = await (await composerObj.url).getValue();

      return assert.strictEqual(
        input,
        'http://jsonplaceholder.typicode.com/posts/1'
      );
    });
  });

  // W.I.P. .....
  // describe('headers inputs', async () => {
  //   it('should open headers input, rendering single input at first', async () => {
  //     // count header rows
  //     const headers = await app.client.$$('.header-row');
  //     assert.strictEqual(headers.length, 1);
  //   });

  //   it('can add new headers in request and type in keys & values', async () => {
  //     // click add header
  //     await (await app.client.$('button=+ Header')).click();

  //     // change 2nd header key / value
  //     await (await app.client.$('\/\/*[@id="header-row1"]/input[1]')).setValue('header-key');
  //     await (await app.client.$('\/\/*[@id="header-row1"]/input[2]')).setValue('header-value');

  //     // select 2nd header key / value
  //     const headerKey = await app.client.$('\/\/*[@id="header-row1"]/input[1]').getValue();
  //     const headerValue = await app.client.$('\/\/*[@id="header-row1"]/input[2]').getValue();

  //     assert.strictEqual(await headerKey, 'header-key');
  //     assert.strictEqual(await headerValue, 'header-value');
  //   });

  // });

  describe('cookies inputs', async () => {
    it('should open cookies input, rendering single input at first', async () => {
      // count cookie rows
      const cookies = await app.client.$$('.cookie-row');
      assert.strictEqual(cookies.length, 1);
    });

    it('can add new cookies in request and type in keys & values', async () => {
      // click add cookie
      await (await app.client.$('button=+ Cookie')).click();

      // change 2nd cookie key / value
      await (
        await app.client.$('\/\/*[@id="cookie-row1"]/input[1]')
      ).setValue('cookie-key');
      await (
        await app.client.$('\/\/*[@id="cookie-row1"]/input[2]')
      ).setValue('cookie-value');

      // select 2nd cookie key / value
      const cookieKey = await (
        await app.client.$('\/\/*[@id="cookie-row1"]/input[1]')
      ).getValue();
      const cookieValue = await (
        await app.client.$('\/\/*[@id="cookie-row1"]/input[2]')
      ).getValue();

      assert.strictEqual(await cookieKey, 'cookie-key');
      assert.strictEqual(await cookieValue, 'cookie-value');
    });
  });

  describe('request body inputs', () => {
    it('body input appears for all other requests', async () => {
      bodyInputVisible = await (
        await app.client.$('#body-entry-select')
      ).isExisting();
      assert.strictEqual(bodyInputVisible, true);
    });

    it('can type plain text into body', async () => {
      const input = 'Team Swell is the best!';
      await composerObj.clearRestBodyAndWriteKeys(input, true);
      assert.strictEqual(
        await (
          await app.client.$('#body-entry-select .CodeMirror-line')
        ).getText(),
        input
      );
    });
  });
};
