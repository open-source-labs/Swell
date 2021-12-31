const chai = require('chai');
const fs = require('fs');
const path = require('path');
const grpcObj = require('../pageObjects/GrpcObj.js');
const grpcServer = require('../grpcServer.js');

const { expect } = chai;

module.exports = () => {
  describe('gRPC requests', () => {
    let proto = '';

    before((done) => {
      try {
        fs.readFile(
          path.join(__dirname, '../hw2.proto'),
          'utf8',
          (err, data) => {
            if (err) console.log(err);
            proto = data;
            done();
          }
        );
      } catch (err) {
        console.error(err);
      }
    });

    before(async () => {
      try {
        grpcServer('open');
        await composerSetup();
        await (await grpcObj.openSelectServiceDropdown).click();
      } catch (err) {
        console.error(err);
      }
    });

    after(async () => {
      try {
        await (await grpcObj.clearWorkspace).click();
      } catch (err) {
        console.log(err);
      }
    });

    const composerSetup = async () => {
      try {
        await (await grpcObj.selectedNetwork).click();
        await (await grpcObj.gRPCNetwork).click();
        await (await grpcObj.url).addValue('0.0.0.0:30051');
        await (await grpcObj.grpcProto).addValue(proto);
        await (await grpcObj.saveChanges).click();
      } catch (err) {
        console.error(err);
      }
    };
    const addReqAndSend = async () => {
      try {
        await (await grpcObj.addRequestBtn).click();
        await (await grpcObj.sendBtn).click();
        const res = await (await grpcObj.jsonPretty).getText();
        return res;
      } catch (err) {
        console.error(err);
      }
    };

    it('it should work on a unary request', async () => {
      try {
        await (await grpcObj.selectServiceGreeter).click();
        await (await grpcObj.openRequestDropdown).click();
        await (await grpcObj.selectRequestSayHelloFromDropDown).click();
        const jsonPretty = await addReqAndSend();
        await new Promise((resolve) =>
          setTimeout(() => {
            expect(jsonPretty).to.include(`"message": "Hello string"`);
            resolve();
          }, 800)
        );
      } catch (err) {
        console.error(err);
      }
    });

    it('it should work on a nested unary request', async () => {
      try {
        await (await grpcObj.selectRequestSayHello).click();
        await (await grpcObj.selectRequestSayHelloNestedFromDropDown).click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty).to.include('"serverMessage":');
        expect(jsonPretty).to.include('"message": "Hello! string"');
        const helloStrArray = jsonPretty.match(/"message": "Hello! string"/g);
        expect(helloStrArray).to.have.lengthOf(2);
      } catch (err) {
        console.error(err);
      }
    });

    it('it should work on a server stream', async () => {
      try {
        await (await grpcObj.selectRequestSayHelloNested).click();
        await (await grpcObj.selectRequestSayHellosSsFromDropDown).click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty.match(/"message"/g)).to.have.lengthOf(5);
        expect(jsonPretty).to.include('hello!!! string');
      } catch (err) {
        console.error(err);
      }
    });

    it('it should work on a client stream', async () => {
      try {
        await (await grpcObj.selectRequestSayHellosSs).click();
        await (await grpcObj.selectRequestSayHelloCSFromDropDown).click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty).to.include('"message": "received 1 messages"');
      } catch (err) {
        console.error(err);
      }
    });
    it('it should work on a bidirectional stream', async () => {
      try {
        await (await grpcObj.selectRequestSayHelloCS).click();
        await (await grpcObj.selectRequestBidiFromDropDown).click();
        const jsonPretty = await addReqAndSend();
        expect(jsonPretty).to.include('"message": "bidi stream: string"');
      } catch (err) {
        console.error(err);
      }
    });
  });
};
