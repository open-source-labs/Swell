const app = require('../testApp.js');

class ComposerObj {

  get tabsComposer() {
    return app.client.$('a=Composer')
  }

  get tabsHistory() {
    return app.client.$('a=History')
  }

  // COMPOSER => COMPOSER
  // PROTOCOL SELECTOR
  get selectedNetwork() {
    return app.client.$('#selected-network')
  }

  get url() { 
    return app.client.$('.input-is-medium');
  };

  get headers(){
    return app.client.$$('.header-row');
  }

  get cookies(){
    return app.client.$$('.cookie-row');
  };

  get restBodyCode() {
    const codeMirror = app.client.$('#body-entry-select');
    codeMirror.click();
    return codeMirror.$("textarea")
  }
  
  clearRestBodyAndWriteKeys = async (keys) => {
    const backspace = [];
    for (let i = 0; i < 30; i += 1) {
      backspace.push('Backspace')
    }

    try {
      await this.restBodyCode.keys(backspace);
      await this.restBodyCode.keys(keys);
    } catch(err) {
      console.error(err)
    }
  }




}; 

module.exports = new ComposerObj(); 