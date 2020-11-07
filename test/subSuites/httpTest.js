const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require('../testApp.js');
const sideBar = require("../pageObjects/Sidebar.js");
const composerObj = require('../pageObjects/ComposerObj.js'); 
const workspaceObj = require('../pageObjects/WorkspaceObj.js'); 
const reqRes = require("../pageObjects/ReqRes.js");
const httpServer = require('../httpServer');

chai.use(chaiHttp);
const expect = chai.expect;

module.exports = () => {
  describe("HTTP/S requests", () => {
    const fillRestRequest = async (url, method, headers = [], cookies = [], body = '') => {
      
      try {

        // click and check REST
        await composerObj.selectedNetwork.click();
        await app.client.$('a=REST').click();
        
        // click and select METHOD if it isn't GET
        if(method !== 'GET') {
          await app.client.$('span=GET').click();
          await app.client.$(`a=${method}`).click();
        }

        // type in url
        await composerObj.url.setValue(url);

        // set headers
        headers.forEach(async ({ key, value },index) => {
          await app.client.$(`//*[@id="header-row${index}"]/input[1]`).setValue(key);
          await app.client.$(`//*[@id="header-row${index}"]/input[2]`).setValue(value);
          await app.client.$('button=+ Header').click();
        });

        // set cookies
        cookies.forEach(async ({ key, value },index) => {
          await app.client.$(`//*[@id="cookie-row${index}"]/input[1]`).setValue(key);
          await app.client.$(`//*[@id="cookie-row${index}"]/input[2]`).setValue(value);
          await app.client.$('button=+ Cookie').click();
        });

        // Add BODY as JSON if it isn't GET
        if (method !== "GET") {
          // select body type JSON
          await app.client.$('span=text/plain').click();
          await app.client.$('a=application/json').click();
          // insert JSON content into body
          await composerObj.clearRestBodyAndWriteKeys(body, false);
        }
      } catch(err) {
        console.error(err)
      }
    };

    const addAndSend = async () => {
      try {
        await composerObj.addRequestBtn.click();
        await workspaceObj.latestSendRequestBtn.click();
      } catch(err) {
        console.error(err);
      }
    }

    describe("public API", () => {
      it("it should GET information from a public API", async () => {
        try {
          // TEST GET Request from JSON Placeholder
          const url = "http://jsonplaceholder.typicode.com/posts";
          const method = 'GET';
          await fillRestRequest(url, method);
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
                        const statusCode = await app.client.$('.status-tag').getText();
                        const events = await app.client.$('#events-display .CodeMirror-code').getText();
                        expect(statusCode).to.equal("200");
                        expect(events.slice(1,100)).to.include("userId");
                        resolve();
                      }, 500)
          );
        } catch(err) {
          console.error(err)
        }
      });
    });

    /***************** !! FOR BELOW TO WORK, YOU MUST ADD YOUR OWN MONGO URI TO A .ENV FILE WITH (MONGO_URI = "YOUR_URI") !! *****************/
    describe("httpTest Server", () => {

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

      it("it should GET information from an http test server", async () => {
        try {
          const url = "http://localhost:3000/book";
          const method = 'GET';
          await fillRestRequest(url, method);
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
                        const statusCode = await app.client.$('.status-tag').getText();
                        const events = await app.client.$('#events-display .CodeMirror-code').getText();
                        expect(statusCode).to.equal("200");
                        expect(events).to.include("[]");
                        resolve();
                      }, 500)
          );
        } catch(err) {
          console.error(err)
        }
      });
    });

    /***************** !! FOR BELOW TO WORK, YOU MUST ADD YOUR OWN MONGO URI TO A .ENV FILE WITH (MONGO_URI = "YOUR_URI") !! *****************/
    //TODO: current linux and travis have trouble testing http request
    //currently leaving out but works appropriately outside testing environment
  //   if(!process.env.TRAVIS_LOCAL_API) {
  //   describe("local API", () => {
  //     before("CLEAR DB", (done) => {
  //       chai
  //         .request("http://localhost:3000")
  //         .get("/clear")
  //         .end((err, res) => {
  //           done();
  //         });
  //     });

  //     after("CLEAR DB", (done) => {
  //       chai
  //         .request("http://localhost:3000")
  //         .get("/clear")
  //         .end((err, res) => {
  //           done();
  //         });
  //     });

  //     it("it should GET from local API", async () => {
  //       try {
  //         await sideBar.chooseGet.click();
  //         await urlAndClick("GET");
  //         await sideBar.url.setValue("http://localhost:3000/book");
  //         await addAndSend();
  //         await new Promise((resolve) =>
  //           setTimeout(async () => {
  //             try {
  //               const statusCode = await reqRes.statusCode.getText();
  //               const jsonPretty = await reqRes.jsonPretty.getText();
  //               expect(statusCode).to.equal("Status: 200");
  //               expect(jsonPretty).to.equal("[]");
  //               resolve();
  //             } catch(err) {
  //               console.error(err)
  //             }
  //           }, 700)
  //         );
  //       } catch(err) {
  //         console.error(err)
  //       }
  //     });

  //     it("it should not POST without a required field", async () => {
  //       try {
  //         await urlAndClick("POST", `{"title": "HarryPotter"}`);
  //         await addAndSend();
  //         await new Promise((resolve) =>
  //           setTimeout(async () => {
  //             try {
  //               const statusCode = await reqRes.statusCode.getText();
  //               const jsonPrettyError = await reqRes.jsonPrettyError.getText();
  //               expect(statusCode).to.equal("Status: 500");
  //               expect(jsonPrettyError).to.include("validation failed");
  //               resolve();
  //             } catch(err) {
  //               console.error(err)
  //             }
  //           }, 700)
  //         );
  //       } catch(err) {
  //         console.error(err)
  //       }
  //     });

  //     it("it should POST to local API", async () => {
  //       try {
  //         await urlAndClick("POST", `{"title": "HarryPotter", "author": "JK Rowling", "pages": 500}`, "show");
  //         await addAndSend();
  //         await new Promise((resolve) =>
  //           setTimeout(async () => {
  //             try {
  //               const statusCode = await reqRes.statusCode.getText();
  //               const jsonPretty = await reqRes.jsonPretty.getText();
  //               expect(statusCode).to.equal("Status: 200");
  //               expect(jsonPretty).to.include("JK Rowling");
  //               resolve();
  //             } catch(err) {
  //               console.error(err)
  //             }
  //           }, 700)
  //         );
  //       } catch(err) {
  //         console.error(err)
  //       }
  //     });

  //     it("it should PUT to local API given a param", async () => {
  //       try {
  //         await urlAndClick("PUT", `{"author": "Ron Weasley", "pages": 400}`, "show");
  //         await sideBar.url.setValue("http://localhost:3000/book/HarryPotter");
  //         await addAndSend();
  //         await new Promise((resolve) =>
  //           setTimeout(async () => {
  //             try {
  //               const statusCode = await reqRes.statusCode.getText();
  //               const jsonPretty = await reqRes.jsonPretty.getText();
  //               expect(statusCode).to.equal("Status: 200");
  //               expect(jsonPretty).to.include("Ron Weasley");
  //               resolve();
  //             } catch(err) {
  //               console.error(err)
  //             }
  //           }, 700)
  //         );
  //       } catch(err) {
  //         console.error(err)
  //       }
  //     });

  //     it("it should PATCH to local API given a param", async () => {
  //       try {
  //         await urlAndClick("PATCH", `{"author": "Hermoine Granger"}`, "show");
  //         await addAndSend();
  //         await new Promise((resolve) =>
  //           setTimeout(async () => {
  //             try {
  //               const statusCode = await reqRes.statusCode.getText();
  //               const jsonPretty = await reqRes.jsonPretty.getText();
  //               expect(statusCode).to.equal("Status: 200");
  //               expect(jsonPretty).to.include("Hermoine Granger");
  //               resolve();
  //             } catch(err) {
  //               console.error(err)
  //             }
  //           }, 700)
  //         );
  //       } catch(err) {
  //         console.error(err)
  //       }
  //     });

  //     it("it should DELETE in local API given a param", async () => {
  //       try {
  //         await urlAndClick("DELETE", `{}`, "show");
  //         await addAndSend();
  //         await new Promise((resolve) =>
  //           setTimeout(async () => {
  //             try {
  //               const statusCode = await reqRes.statusCode.getText();
  //               const jsonPretty = await reqRes.jsonPretty.getText();
  //               expect(statusCode).to.equal("Status: 200");
  //               expect(jsonPretty).to.include("Hermoine Granger");
  //               resolve();
  //             } catch(err) {
  //               console.error(err)
  //             }
  //           }, 700)
  //         );
  //         await reqRes.removeBtn.click();
  //         await sideBar.chooseGet.click();
  //         await urlAndClick("GET");
  //         await sideBar.url.setValue("http://localhost:3000/book");
  //         await addAndSend();
  //         await new Promise((resolve) =>
  //           setTimeout(async () => {
  //             try {
  //               const statusCode = await reqRes.statusCode.getText();
  //               const jsonPretty = await reqRes.jsonPretty.getText();
  //               expect(statusCode).to.equal("Status: 200");
  //               expect(jsonPretty).to.equal("[]");
  //               resolve();
  //             } catch(err) {
  //               console.error(err)
  //             }
  //           }, 700)
  //         );
  //       } catch(err) {
  //         console.error(err)
  //       }
  //     });
  //   })
  // };
  });
};
