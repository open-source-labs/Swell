const chai = require("chai");
const fs = require("fs");
const path = require("path");
const grpcObj = require("../pageObjects/GrpcObj.js");
const grpcServer = require('../grpcServer.js')

const expect = chai.expect;

module.exports = () => {
  describe("gRPC requests", () => {

    let proto = "";

    before((done) => {
      try{
        fs.readFile(path.join(__dirname, "../hw2.proto"), "utf8", (err, data) => {
          if (err) console.log(err);
          proto = data;
          done();
        });
      } catch (err) {
        console.error(err);
      }
    });

    before(async () => {
      try {
        await grpcObj.removeBtn.click();
        grpcServer('open')
        await composerSetup();
        await grpcObj.openSelectServiceDropdown.click();
      } catch(err) {
        console.error(err)
      }
    });

    const composerSetup = async () => {
      try {
        await grpcObj.selectedNetwork.click();
        await grpcObj.gRPCNetwork.click();
        await grpcObj.url.addValue("0.0.0.0:30051");
        await grpcObj.grpcProto.addValue(proto);
        await grpcObj.saveChanges.click();
      } catch(err) {
        console.error(err)
      }
    };
    const addReqAndSend = async () => {
      try {
        await grpcObj.addRequestBtn.click();
        await grpcObj.sendBtn.click();
        const res = await grpcObj.jsonPretty.getText();
        return res;
      } catch(err) {
        console.error(err)
      }
    };

    it("it should work on a unary request", async () => {
      try {
        await grpcObj.selectServiceGreeter.click();
        await grpcObj.openRequestDropdown.click();
        await grpcObj.selectRequestSayHelloFromDropDown.click();
        const jsonPretty = await addReqAndSend();
        await new Promise((resolve) =>
          setTimeout(() => {
            expect(jsonPretty).to.include(`"message": "Hello string"`);
            resolve();
          }, 800)
        );
      } catch(err) {
        console.error(err)
      }
    });

    it("it should work on a nested unary request", async () => {
      try {
        await grpcObj.selectRequestSayHello.click();
        await grpcObj.selectRequestSayHelloNestedFromDropDown.click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty).to.include('"serverMessage":')
        expect(jsonPretty).to.include('"message": "Hello! string"')
        const helloStrArray = jsonPretty.match(/"message": "Hello! string"/g)
        expect(helloStrArray).to.have.lengthOf(2);
      } catch(err) {
        console.error(err)
      }
    });

    it("it should work on a server stream", async () => {
      try {
        await grpcObj.selectRequestSayHelloNested.click();
        await grpcObj.selectRequestSayHellosSsFromDropDown.click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty.match(/"message"/g)).to.have.lengthOf(5);
        expect(jsonPretty).to.include("hello!!! string")
      } catch(err) {
        console.error(err)
      }
    });

    it("it should work on a client stream", async () => {
      try {
        await grpcObj.selectRequestSayHellosSs.click();
        await grpcObj.selectRequestSayHelloCSFromDropDown.click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty).to.include('"message": "received 1 messages"');
      } catch(err) {
        console.error(err)
      }
    });
    it("it should work on a bidirectional stream", async () => {
      try {
        await grpcObj.selectRequestSayHelloCS.click();
        await grpcObj.selectRequestBidiFromDropDown.click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty).to.include('"message": "bidi stream: string"');
      } catch(err) {
        console.error(err)
      }
    });
  });
};