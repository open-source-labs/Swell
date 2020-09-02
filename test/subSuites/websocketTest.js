const chai = require("chai");
const sideBar = require("../pageObjects/Sidebar.js");
const reqRes = require("../pageObjects/ReqRes.js");

const expect = chai.expect;

module.exports = () => {
  describe("Websocket requests", () => {
    it("it should send and receive messages", async () => {
      try {
        await reqRes.removeBtn.click();
        await sideBar.websocket.click();
        await sideBar.url.setValue("wss://echo.websocket.org");
        await sideBar.addRequestBtn.click();
        await reqRes.sendBtn.click();
        await new Promise((resolve) =>
          setTimeout(async () => {
            try {
              await reqRes.messageTextArea.addValue("testing websocket protocol");
              await reqRes.messageBtn.click();
              const messageClient = await reqRes.messageClient.getText();
              await new Promise((resolve) =>
                setTimeout(async () => {
                  try {
                    const messageServer = await reqRes.messageServer.getText();
                    expect(messageClient).to.equal("testing websocket protocol");
                    expect(messageServer).to.equal(messageClient);
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
          }, 2000)
        );
      } catch(err) {
        console.error(err)
      }
    });
  });
};
