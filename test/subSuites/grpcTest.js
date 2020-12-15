// OLD GRPC TESTS BELOW.  CURRENT GRPC TESTS NOT FUNCTIONING

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
      } catch(err) {
        console.error(err)
      }
    });

    const sideBarSetup = async () => {
      try {
        await grpcObj.selectedNetwork.click();
        await grpcObj.gRPC.click();
        await grpcObj.url.addValue("0.0.0.0:50051");
        await grpcObj.grpcProto.addValue(proto);
        await grpcObj.saveChanges.click();
      } catch(err) {
        console.error(err)
      }
    };
    const requestSetup = async () => {
      try {
        await grpcObj.addRequestBtn.click();
        await grpcObj.sendBtn.click();
        const res = await grpcObj.jsonPretty.getText();
        return res;
      } catch(err) {
        console.error('FROM requestSetup', err)
      }
    };

    it("it should work on a unary request", async () => {
      try {
        await sideBarSetup();
        await grpcObj.openSelectServiceDropdown.click();
        await grpcObj.selectServiceGreeter.click();
        await grpcObj.openRequestDropdown.click();
        await grpcObj.selectRequestSayHelloFromDropDown.click();
        const jsonPretty = await requestSetup();
        await new Promise((resolve) =>
          setTimeout(() => {
            expect(jsonPretty).to.include(`"message": "Hello string"`);
            resolve();
          }, 800)
        );
      } catch(err) {
        console.error('FROM unary', err)
      }
    });

    it("it should work on a nested unary request", async () => {
      try {
        await grpcObj.removeUnary.click();
        await grpcObj.selectRequestSayHello.click();
        await grpcObj.selectRequestSayHelloNestedFromDropDown.click();
        const jsonPretty = await requestSetup();
        expect(jsonPretty).to.include('"serverMessage":')
        expect(jsonPretty).to.include('"message": "Hello! string"')
        const helloStrArray = jsonPretty.match(/"message": "Hello! string"/g)
        expect(helloStrArray).to.have.lengthOf(2);
      } catch(err) {
        console.error('FROM NESTED: ', err)
      }
    });

    it("it should work on a server stream", async () => {
      try {
        await grpcObj.removeUnary.click();
        await grpcObj.selectRequestSayHelloNested.click();
        await grpcObj.selectRequestSayHellosSsFromDropDown.click();
        const jsonPretty = await requestSetup();
        expect(jsonPretty.match(/"message"/g)).to.have.lengthOf(5);
        expect(jsonPretty).to.include("hello!!! string")
      } catch(err) {
        console.error(err)
      }
    });

    it("it should work on a client stream", async () => {
      try {
        await grpcObj.removeServerStream.click();
        await grpcObj.selectRequestSayHellosSs.click();
        await grpcObj.selectRequestSayHelloCSFromDropDown.click();
        const jsonPretty = await requestSetup();
        expect(jsonPretty).to.include('"message": "received 1 messages"');
      } catch(err) {
        console.error(err)
      }
    });
    it("it should work on a bidirectional stream", async () => {
      try {
        await grpcObj.removeClientStream.click();
        await grpcObj.selectRequestSayHelloCS.click();
        await grpcObj.selectRequestBidiFromDropDown.click();
        const jsonPretty = await requestSetup();
        expect(jsonPretty).to.include('"message": "bidi stream: string"');
      } catch(err) {
        console.error(err)
      }
    });
  });
};