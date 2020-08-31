const app = require('../testApp.js');

class Sidebar {
  // NETWORK PROTOCOL
  get websocket() {
    return app.client.$('div.composer_protocol_button.ws')
  }

  get graphQL() {
    return app.client.$('div.composer_protocol_button.gql')
  }

  get gRPC() {
    return app.client.$('div.composer_protocol_button.grpc')
  }

  // URL/METHOD INPUTS
  get url() { 
    return app.client.$('input.composer_url_input');
  };

  get requestMethod() { 
    return app.client.$('select.composer_method_select.http');
  };
  
  get chooseGet(){ 
    return app.client.$('option=GET');
  };

  get choosePost() { 
    return app.client.$('option=POST');
  }; 

  get choosePut() { 
    return app.client.$('option=PUT');
  }; 

  get choosePatch() { 
    return app.client.$('option=PATCH');
  }; 

  get chooseDelete() {
    return app.client.$('option=DELETE')
  }

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

  // gRPC
  get grpcBody(){
    return app.client.$('textarea#grpcProtoEntryTextArea.composer_textarea.grpc.composer_bodyform_container-open');
  };

  get saveChanges() {
    return app.client.$('button#save-proto.save-proto.small-btn-open')
  }

  get selectService() {
    return app.client.$('select#dropdownService.dropdownService')
  }

  get selectRequest() {
    return app.client.$('select#dropdownRequest.dropdownService')
  }

  // graphQL
  get schemaOpen() {
    return app.client.$('#schema-click')
  }

  get variableOpen() {
    return app.client.$('#variable-click')
  }

  get introspect() {
    return app.client.$('button=Introspect')
  }

  get introspectionText() {
    return app.client.$('textarea#introspection-text')
  }

  get graphqlText() {
    const codeMirror = app.client.$('div#graphql-body');
    codeMirror.click();
    return codeMirror.$("textarea")
  }

  get graphqlVariable() {
    const codeMirrorVariable = app.client.$('div#graphql-variable');
    codeMirrorVariable.click();
    return codeMirrorVariable.$("textarea")
  }

  get chooseMutation() { 
    return app.client.$('option=MUTATION');
  }; 

  get chooseSubscription() { 
    return app.client.$('option=SUBSCRIPTION');
  }; 

  // HEADER INPUTS

  get activateHeaders(){
    return app.client.$('#headers-click'); 
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
    return app.client.$('#cookie-click');
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

  // HISTORY
  get history(){
    return app.client.$('div.history-url')
  }

  // ADD REQUEST BUTTON
  get addRequestBtn(){
    return app.client.$('button=Add New Request')
  }
}; 

module.exports = new Sidebar(); 