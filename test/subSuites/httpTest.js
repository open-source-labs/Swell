const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require('../testApp.js');
const composerObj = require('../pageObjects/ComposerObj.js'); 
const workspaceObj = require('../pageObjects/WorkspaceObj.js'); 
const httpServer = require('../httpServer');

chai.use(chaiHttp);
const expect = chai.expect;

module.exports = () => {
  describe("HTTP/S requests", () => {
    const fillRestRequest = async (url, method, body = '', headers = [], cookies = []) => {
      
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
          await composerObj.clearRestBodyAndWriteKeys(body);
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
        chai.request("http://localhost:3000")
          .get("/clear")
          .end(function(err, res) {
            done();                               // <= Call done to signal callback end
          });
      });

      after("CLEAR DB", (done) => {
        chai.request("http://localhost:3000")
          .get("/clear")
          .send()
          .end(function(err, res) {
            done();                               // <= Call done to signal callback end
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

      it("it should POST to local http test server", async () => {
        try {
          const url = "http://localhost:3000/book";
          const method = 'POST';
          const body = '"title": "HarryPotter", "author": "JK Rowling", "pages": 500}'
          await fillRestRequest(url, method, body);
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
                        const statusCode = await app.client.$('.status-tag').getText();
                        const events = await app.client.$('#events-display .CodeMirror-code').getText();
                        expect(statusCode).to.equal("200");
                        expect(events).to.include("JK Rowling");
                        resolve();
                      }, 500)
          );
        } catch(err) {
          console.error(err)
        }
      });

      it("it should PUT to local http test server", async () => {
        try {
          const url = "http://localhost:3000/book/HarryPotter";
          const method = 'PUT';
          const body = '"author": "Ron Weasley", "pages": 400}';
          await fillRestRequest(url, method, body);
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
                        const statusCode = await app.client.$('.status-tag').getText();
                        const events = await app.client.$('#events-display .CodeMirror-code').getText();
                        expect(statusCode).to.equal("200");
                        expect(events).to.include("Ron Weasley");
                        resolve();
                      }, 500)
          );
        } catch(err) {
          console.error(err)
        }
      });

      it("it should PATCH to local http test server", async () => {
        try {
          const url = "http://localhost:3000/book/HarryPotter";
          const method = 'PATCH';
          const body = '"author": "Hermoine Granger"}';
          await fillRestRequest(url, method, body);
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
                        const statusCode = await app.client.$('.status-tag').getText();
                        const events = await app.client.$('#events-display .CodeMirror-code').getText();
                        expect(statusCode).to.equal("200");
                        expect(events).to.include("Hermoine Granger");
                        resolve();
                      }, 500)
          );
        } catch(err) {
          console.error(err)
        }
      });

      it("it should DELETE to local http test server", async () => {
        // DELETE HARRYPOTTER
        try {
          const url = "http://localhost:3000/book/HarryPotter";
          const method = 'DELETE';
          await fillRestRequest(url, method);
          await addAndSend();
          await new Promise((resolve) =>
            setTimeout(async () => {
                        const statusCode = await app.client.$('.status-tag').getText();
                        const events = await app.client.$('#events-display .CodeMirror-code').getText();
                        expect(statusCode).to.equal("200");
                        expect(events).to.include("Hermoine Granger");
                        resolve();
                      }, 500)
          );
        } catch(err) {
          console.error(err)
        }
        // CHECK TO SEE IF IT IS DELETED
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
  });
};
