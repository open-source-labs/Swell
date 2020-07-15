const app = require('../testApp.js');

class Sidebar {

  get url() { 
    return app.client.$('input.composer_url_input');
  };

  get requestMethod() { 
    return app.client.$('select.composer_method_select.http');
  };

  get choosePost() { 
    return app.client.$('option=POST');
  }; 

  get chooseGet(){ 
    return app.client.$('option=GET');
  };

  get activateHeaders(){
    return app.client.$('.composer_subtitle=Headers'); 
  };

  get headers(){
    return app.client.$$('.header_container');
  }

  get headerCheckbox(){
    return app.client.$$('.header_checkbox');
  };

  get headerKey(){
    return app.client.$('.header_key');
  };

  get headerValue(){
    return app.client.$('.header_value'); 
  }
}; 

module.exports = new Sidebar(); 