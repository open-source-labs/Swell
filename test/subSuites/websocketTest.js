const chai = require("chai");
const app = require('../testApp.js');
const composerObj = require('../pageObjects/ComposerObj.js'); 
const workspaceObj = require('../pageObjects/WorkspaceObj.js'); 

const expect = chai.expect;

module.exports = () => {
  describe("Websocket requests", () => {
    
    before(() => {
      app.client.$('button=Clear Workspace').click();
    })

    const addAndSend = async () => {
      try {
        await composerObj.addRequestBtn.click();
        await workspaceObj.latestSendRequestBtn.click();
      } catch(err) {
        console.error(err);
      }
    }

    it("it should send and receive messages to public echo test", async () => {
      try {
        // select web sockets
        await composerObj.selectedNetwork.click();
        await app.client.$('a=WEB SOCKETS').click();
        
        // type in url
        await composerObj.url.setValue('wss://echo.websocket.org');

        await addAndSend();

        await new Promise((resolve) =>
          setTimeout(async () => {
            try {
              await app.client.$('#responses input').click().keys("testing websocket protocol");
              await app.client.$('button=Send Message').click();

              await new Promise((resolve) =>
                setTimeout(async () => {
                  try {
                    const messageClient = await app.client.$('#ws-msg-0').getText();
                    const messageServer = await app.client.$('#ws-msg-1').getText();
                    expect(messageClient).to.include("testing websocket protocol");
                    expect(messageServer).to.include("testing websocket protocol");
                    resolve();
                  } catch(err) {
                    console.error(err)
                  }
                }, 300)
              );
              resolve();
            } catch(err) {
              console.error(err)
            }
          }, 1000)
        );
      } catch(err) {
        console.error(err)
      }
    });
  });
};
