const chai = require("chai");
const fs = require("fs");
const path = require("path");
const sideBar = require("../pageObjects/Sidebar.js");
const reqRes = require("../pageObjects/ReqRes.js");
const grpcServer = require('../grpcServer')

const expect = chai.expect;

module.exports = () => {
  describe("gRPC requests", () => {

    beforeEach(async () => {
      try {
        await reqRes.removeBtn.click();
      } catch(err) {
        console.error(err)
      }
    });

    let body = "";

    before((done) => {
      fs.readFile(path.join(__dirname, "../hw2.proto"), "utf8", (err, data) => {
        if (err) console.log(err);
        body = data;
        done();
      });
    });

    before(() => {
      try {
        grpcServer('open')
      } catch(err) {
        console.error(err)
      }
    });

    after(() => {
      try {
        grpcServer('close');
      } catch(err) {
        console.error(err)
      }
    });

    const sideBarSetup = async () => {
      try {
        await sideBar.gRPC.click();
        await sideBar.url.setValue("0.0.0.0:50051");
        await sideBar.grpcBody.addValue(body);
        await sideBar.saveChanges.click();
      } catch(err) {
        console.error(err)
      }
    };
    const requestSetup = async (index) => {
      try {
        await sideBar.selectRequest.selectByIndex(index);
        await sideBar.addRequestBtn.click();
        await reqRes.sendBtn.click();
        const res = await reqRes.jsonPretty.getText();
        return res;
      } catch(err) {
        console.error(err)
      }
    };
    it("it should work on a unary request", async () => {
      try {
        await sideBarSetup();
        await sideBar.selectService.selectByIndex(1);
        const jsonPretty = await requestSetup(1);
        await new Promise((resolve) =>
          setTimeout(async () => {
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
        const jsonPretty = await requestSetup(2);
        expect(jsonPretty).to.include(
          `{\n    "serverMessage": [\n        {\n            "message": "Hello! string"\n        },\n        {\n            "message": "Hello! string"\n        }\n    ]\n}`
        );
      } catch(err) {
        console.error(err)
      }
    });
    it("it should work on a server stream", async () => {
      try {
        const jsonPretty = await requestSetup(3);
        expect(jsonPretty).to.include(
          `{\n    "response": [\n        {\n            "message": "You"\n        },\n        {\n            "message": "Are"\n`
        );
      } catch(err) {
        console.error(err)
      }
    });
    it("it should work on a client stream", async () => {
      try {
        const jsonPretty = await requestSetup(4);
        expect(jsonPretty).to.include(
          `{\n    "message": "received 1 messages"\n}`
        );
      } catch(err) {
        console.error(err)
      }
    });
    it("it should work on a bidirectional stream", async () => {
      try {
        const jsonPretty = await requestSetup(5);
        expect(jsonPretty).to.include(
          `{\n    "message": "bidi stream: string"\n}`
        );
      } catch(err) {
        console.error(err)
      }
    });
  });
};
