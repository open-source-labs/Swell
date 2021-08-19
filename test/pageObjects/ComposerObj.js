const app = require('../testApp.js');

class ComposerObj {
  get tabsComposer() {
    return app.client.$('a=Composer');
  }

  get tabsHistory() {
    return app.client.$('a=History');
  }

  // COMPOSER => COMPOSER
  // PROTOCOL SELECTOR
  get selectedNetwork() {
    return app.client.$('#selected-network');
  }

  get url() {
    return app.client.$('.input-is-medium');
  }

  get headers() {
    return app.client.$$('.header-row');
  }

  get cookies() {
    return app.client.$$('.cookie-row');
  }

  get restBodyCode() {
    const codeMirror = app.client.$('#body-entry-select');
    codeMirror.click();
    return codeMirror.$('textarea');
  }

  get gqlBodyCode() {
    const codeMirror = app.client.$('#gql-body-entry');
    codeMirror.click();
    return codeMirror.$('textarea');
  }

  get gqlVariableCode() {
    const codeMirror = app.client.$('#gql-var-entry');
    codeMirror.click();
    return codeMirror.$('textarea');
  }

  get addRequestBtn() {
    return app.client.$('button=Add New Request');
  }

  get closeConnectionBtn() {
    return app.client.$('button=Close Connection');
  }

  get reopenConnectionBtn() {
    return app.client.$('button=Re-Open Connection');
  }

  get testScriptCode() {
    const codeMirror = app.client.$('#test-script-entry');
    codeMirror.click();
    return codeMirror.$('textarea');
  }

  async clearRestBodyAndWriteKeys(keys, clear = true) {
    const backspace = [];
    for (let i = 0; i < 30; i += 1) {
      backspace.push('Backspace');
    }

    try {
      if (clear) await this.restBodyCode.keys(backspace);
      await this.restBodyCode.keys(keys);
    } catch (err) {
      console.error(err);
    }
  }

  async clearGQLBodyAndWriteKeys(keys, clear = true) {
    const backspace = [];
    for (let i = 0; i < 30; i += 1) {
      backspace.push('Backspace');
    }

    try {
      if (clear) await this.gqlBodyCode.keys(backspace);
      await this.gqlBodyCode.keys(keys);
    } catch (err) {
      console.error(err);
    }
  }

  async clickGQLVariablesAndWriteKeys(keys) {
    try {
      await this.gqlVariableCode.keys(keys);
    } catch (err) {
      console.error(err);
    }
  }

  async clearTestScriptAreaAndWriteKeys(keys, clear = true) {
    const backspace = [];
    for (let i = 0; i < 100; i += 1) {
      backspace.push('Backspace');
    }

    try {
      if (clear) await this.testScriptCode.keys(backspace);
      await this.testScriptCode.keys(keys);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new ComposerObj();
