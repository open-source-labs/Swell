const app = require('../testApp.js');

class Sidebar {

  // URL/METHOD INPUTS
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

  // BODY INPUTS
  get activateBodyInput(){
    return app.client.$('.composer_subtitle=Body');
  };

  get rawBtn(){
    return app.client.$('.composer_bodytype_button=Raw');
  };

  get urlencodedBtn(){
    return app.client.$('.composer_bodytype_button=x-www-form-urlencoded');
  };

  get noneBtn(){
    return app.client.$('.composer_bodytype_button=None');
  };

  get contentTypeBtn(){
    return app.client.$('select.composer_rawtype_select');
  };

  get chooseJSON(){
    return app.client.$('option=JSON (application/json)');
  };

  get bodyInput(){
    return app.client.$('textarea.composer_textarea');
  };


  get prettyJSON(){
    return app.client.$('.composer_pretty_print');
  };
  
  // HEADER INPUTS

  get activateHeaders(){
    return app.client.$('.composer_subtitle=Headers'); 
  };

  get headers(){
    return app.client.$$('.header_container');
  }

  get firstHeaderCheckbox(){
    return app.client.$('.header_checkbox')
  };

  get headerKey(){
    return app.client.$('.header_key');
  };

  get headerValue(){
    return app.client.$('.header_value'); 
  };

  get addHeader(){
    return app.client.$('button=Add Header');
  };

  // COOKIE INPUTS
  get cookies(){
    return app.client.$$('.cookie_container');
  };

  get activateCookies(){
    return app.client.$('.composer_subtitle=Cookies');
  }

  get firstCookieCheckbox(){
    return app.client.$('.cookie_checkbox');
  };

  get cookieKey(){
    return app.client.$('.cookie_key');
  };

  get cookieValue(){
    return app.client.$('.cookie_value');
  };

  // ADD REQUEST BUTTON
  get addRequestBtn(){
    return app.client.$('button=Add New Request')
  }
}; 

module.exports = new Sidebar(); 