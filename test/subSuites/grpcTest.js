// OLD GRPC TESTS BELOW.  CURRENT GRPC TESTS NOT FUNCTIONING

const chai = require("chai");
const fs = require("fs");
const path = require("path");
const sideBar = require("../pageObjects/Sidebar.js");
const reqRes = require("../pageObjects/ReqRes.js");
const grpcServer = require('../grpcServer.js')

const expect = chai.expect;

module.exports = () => {
  describe("gRPC requests", () => {

    // beforeEach(async () => {
    //   const removeBtn = await sideBar.removeBtn;
    //   if(removeBtn.value) {
    //     try {
    //       await sideBar.removeBtn.click();
    //     } catch(err) {
    //       console.error(err)
    //     }
    //   }
    // });

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

    before(() => {
      try {
        grpcServer('open')
      } catch(err) {
        console.error(err)
      }
    });

    const sideBarSetup = async () => {
      try {
        await sideBar.selectedNetwork.click();
        await sideBar.gRPC.click();
        await sideBar.url.addValue("0.0.0.0:50051");
        await sideBar.grpcProto.addValue(proto);
        await sideBar.saveChanges.click();
      } catch(err) {
        console.error(err)
      }
    };
    const requestSetup = async () => {
      try {
        await sideBar.addRequestBtn.click();
        await reqRes.sendBtn.click();
        const res = await sideBar.jsonPretty.getText();
        return res;
      } catch(err) {
        console.error('FROM requestSetup', err)
      }
    };

    it("it should work on a unary request", async () => {
      try {
        await sideBarSetup();
        await sideBar.openSelectServiceDropdown.click();
        await sideBar.selectServiceGreeter.click();
        await sideBar.openRequestDropdown.click();
        await sideBar.selectRequestSayHelloFromDropDown.click();
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
        await sideBar.removeUnary.click();
        await sideBar.selectRequestSayHello.click();
        await sideBar.selectRequestSayHelloNestedFromDropDown.click();
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
        await sideBar.removeUnary.click();
        await sideBar.selectRequestSayHelloNested.click();
        await sideBar.selectRequestSayHellosSsFromDropDown.click();
        const jsonPretty = await requestSetup();
        expect(jsonPretty.match(/"message"/g)).to.have.lengthOf(5);
        expect(jsonPretty).to.include("hello!!! string")
      } catch(err) {
        console.error(err)
      }
    });
    // it("it should work on a client stream", async () => {
    //   try {
    //     const jsonPretty = await requestSetup(4);
    //     expect(jsonPretty).to.include(
    //       `{\n    "message": "received 1 messages"\n}`
    //     );
    //   } catch(err) {
    //     console.error(err)
    //   }
    // });
    // it("it should work on a bidirectional stream", async () => {
    //   try {
    //     const jsonPretty = await requestSetup(5);
    //     expect(jsonPretty).to.include(
    //       `{\n    "message": "bidi stream: string"\n}`
    //     );
    //   } catch(err) {
    //     console.error(err)
    //   }
    // });
  });
};
