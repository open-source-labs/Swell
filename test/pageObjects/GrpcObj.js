const app = require('../testApp.js');

class GrpcObj {

  get tabsComposer() {
    return app.client.$('a=Composer')
  }

  get selectedNetwork() {
    return app.client.$('#selected-network')
  }

  get gRPC() {
    return app.client.$('a=gRPC')
  }

  get url() { 
    return app.client.$('.input-is-medium');
  };

  get removeBtn() {
		return app.client.$('button=Remove')
	}

  get saveChanges() {
    return app.client.$('#save-proto')
  }

  get openSelectServiceDropdown() {
    return app.client.$('#Select-Service-button')
  }

  get selectServiceGreeter() {
    return app.client.$('a=Greeter')
  }

  get openRequestDropdown() {
    return app.client.$('#Select-Request-button')
  }

  get removeUnary() {
    return app.client.$('#UNARY')
  }

  get removeServerStream() {
    return app.client.$('#SERVER-STREAM')
  }

  get removeClientStream() {
    return app.client.$('#CLIENT-STREAM')
  }

  get selectRequestSayHelloFromDropDown() {
    return app.client.$('a=SayHello')
  }

  get selectRequestSayHello() {
    return app.client.$('#SayHello-button')
  }

  get selectRequestSayHelloNestedFromDropDown() {
    return app.client.$('a=SayHelloNested')
  }

  get selectRequestSayHelloNested() {
    return app.client.$('#SayHelloNested-button')
  }

  get selectRequestSayHellosSs() {
    return app.client.$('#SayHellosSs-button')
  }

  get selectRequestSayHellosSsFromDropDown() {
    return app.client.$('a=SayHellosSs')
  }

  get selectRequestSayHelloCSFromDropDown() {
    return app.client.$('a=SayHelloCS')
  }

  get selectRequestSayHelloCS() {
    return app.client.$('#SayHelloCS-button')
  }

  get selectRequestBidiFromDropDown() {
    return app.client.$('a=SayHelloBidi')
  }

  get grpcProto() {
    const codeMirror = app.client.$('#grpcProtoEntryTextArea');
    codeMirror.click();
    return codeMirror.$("textarea")
  }

  get jsonPretty() {
		return app.client.$('#events-display')
	}

  get addRequestBtn(){
    return app.client.$('button=Add New Request')
  }

  get sendBtn() {
		return app.client.$('button=Send')
	}
}; 

module.exports = new GrpcObj(); 