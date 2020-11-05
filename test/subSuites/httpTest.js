const chai = require("chai");
const chaiHttp = require("chai-http");
const sideBar = require("../pageObjects/Sidebar.js");
const reqRes = require("../pageObjects/ReqRes.js");
const httpServer = require('../httpServer');

chai.use(chaiHttp);
const expect = chai.expect;

module.exports = () => {
  xdescribe("HTTP/S requests", () => {
    const urlAndClick = async (method, body, header) => {
      try {
        if (method !== "GET") {
          // request method
          await sideBar.requestMethod.click();
  
          if (method === "POST") await sideBar.choosePost.click();
          if (method === "PUT") await sideBar.choosePut.click();
          if (method === "PATCH") await sideBar.choosePatch.click();
          if (method === "DELETE") await sideBar.chooseDelete.click();
  
          // headers
          if (header !== "show") {
            await sideBar.activateHeaders.click();
          }
          await sideBar.headerKey.addValue("Content-Type");
          await sideBar.headerValue.addValue("application/json");
          await sideBar.addHeader.click();
  
          // content type
          await sideBar.contentTypeBtn.click();
          await sideBar.chooseJSON.click();
  
          // body
          await sideBar.bodyInput.clearElement();
          await sideBar.bodyInput.addValue(body);
        }
      } catch(err) {
        console.error(err)
      }
    };

    const addAndSend = async () => {
      try {
        await sideBar.addRequestBtn.click();
        await reqRes.sendBtn.click();
      } catch(err) {
        console.error(err);
      }
    }

    beforeEach(async () => {
      try {
        await reqRes.removeBtn.click();
      } catch(err) {
        console.error(err)
      }
    });

    after(() => {
      try {
         httpServer.close();
         console.log('httpServer closed')
      } catch(err) {
        console.error(err)
      }
    })

    describe("public API", () => {
      it("it should GET information from a public API", async () => {
        try {
          await sideBar.chooseGet.click();
          await urlAndClick("GET");
          await sideBar.url.setValue("https://pokeapi.co/api/v2/pokemon?limit=5");
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
              try {
                const statusCode = await reqRes.statusCode.getText();
                const jsonPretty = await reqRes.jsonPretty.getText();
                expect(statusCode).to.equal("Status: 200");
                expect(jsonPretty).to.include("bulbasaur");
                resolve();
              } catch(err) {
                console.error(err)
              }
            }, 700)
          );
        } catch(err) {
          console.error(err)
        }
      });
    });

    /***************** !! FOR BELOW TO WORK, YOU MUST ADD YOUR OWN MONGO URI TO A .ENV FILE WITH (MONGO_URI = "YOUR_URI") !! *****************/
    //TODO: current linux and travis have trouble testing http request
    //currently leaving out but works appropriately outside testing environment
    if(!process.env.TRAVIS_LOCAL_API) {
    describe("local API", () => {
      before("CLEAR DB", (done) => {
        chai
          .request("http://localhost:3000")
          .get("/clear")
          .end((err, res) => {
            done();
          });
      });

      after("CLEAR DB", (done) => {
        chai
          .request("http://localhost:3000")
          .get("/clear")
          .end((err, res) => {
            done();
          });
      });

      it("it should GET from local API", async () => {
        try {
          await sideBar.chooseGet.click();
          await urlAndClick("GET");
          await sideBar.url.setValue("http://localhost:3000/book");
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
              try {
                const statusCode = await reqRes.statusCode.getText();
                const jsonPretty = await reqRes.jsonPretty.getText();
                expect(statusCode).to.equal("Status: 200");
                expect(jsonPretty).to.equal("[]");
                resolve();
              } catch(err) {
                console.error(err)
              }
            }, 700)
          );
        } catch(err) {
          console.error(err)
        }
      });

      it("it should not POST without a required field", async () => {
        try {
          await urlAndClick("POST", `{"title": "HarryPotter"}`);
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
              try {
                const statusCode = await reqRes.statusCode.getText();
                const jsonPrettyError = await reqRes.jsonPrettyError.getText();
                expect(statusCode).to.equal("Status: 500");
                expect(jsonPrettyError).to.include("validation failed");
                resolve();
              } catch(err) {
                console.error(err)
              }
            }, 700)
          );
        } catch(err) {
          console.error(err)
        }
      });

      it("it should POST to local API", async () => {
        try {
          await urlAndClick("POST", `{"title": "HarryPotter", "author": "JK Rowling", "pages": 500}`, "show");
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
              try {
                const statusCode = await reqRes.statusCode.getText();
                const jsonPretty = await reqRes.jsonPretty.getText();
                expect(statusCode).to.equal("Status: 200");
                expect(jsonPretty).to.include("JK Rowling");
                resolve();
              } catch(err) {
                console.error(err)
              }
            }, 700)
          );
        } catch(err) {
          console.error(err)
        }
      });

      it("it should PUT to local API given a param", async () => {
        try {
          await urlAndClick("PUT", `{"author": "Ron Weasley", "pages": 400}`, "show");
          await sideBar.url.setValue("http://localhost:3000/book/HarryPotter");
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
              try {
                const statusCode = await reqRes.statusCode.getText();
                const jsonPretty = await reqRes.jsonPretty.getText();
                expect(statusCode).to.equal("Status: 200");
                expect(jsonPretty).to.include("Ron Weasley");
                resolve();
              } catch(err) {
                console.error(err)
              }
            }, 700)
          );
        } catch(err) {
          console.error(err)
        }
      });

      it("it should PATCH to local API given a param", async () => {
        try {
          await urlAndClick("PATCH", `{"author": "Hermoine Granger"}`, "show");
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
              try {
                const statusCode = await reqRes.statusCode.getText();
                const jsonPretty = await reqRes.jsonPretty.getText();
                expect(statusCode).to.equal("Status: 200");
                expect(jsonPretty).to.include("Hermoine Granger");
                resolve();
              } catch(err) {
                console.error(err)
              }
            }, 700)
          );
        } catch(err) {
          console.error(err)
        }
      });

      it("it should DELETE in local API given a param", async () => {
        try {
          await urlAndClick("DELETE", `{}`, "show");
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
              try {
                const statusCode = await reqRes.statusCode.getText();
                const jsonPretty = await reqRes.jsonPretty.getText();
                expect(statusCode).to.equal("Status: 200");
                expect(jsonPretty).to.include("Hermoine Granger");
                resolve();
              } catch(err) {
                console.error(err)
              }
            }, 700)
          );
          await reqRes.removeBtn.click();
          await sideBar.chooseGet.click();
          await urlAndClick("GET");
          await sideBar.url.setValue("http://localhost:3000/book");
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
              try {
                const statusCode = await reqRes.statusCode.getText();
                const jsonPretty = await reqRes.jsonPretty.getText();
                expect(statusCode).to.equal("Status: 200");
                expect(jsonPretty).to.equal("[]");
                resolve();
              } catch(err) {
                console.error(err)
              }
            }, 700)
          );
        } catch(err) {
          console.error(err)
        }
      });
    })
  };
  });
};
