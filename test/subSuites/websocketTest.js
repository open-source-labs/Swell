const chai = require("chai");
const path = require("path");
//for this the previous group used Chai instead of 'assert'from node
const app = require("../testApp.js");
const composerObj = require("../pageObjects/ComposerObj.js");
const workspaceObj = require("../pageObjects/WorkspaceObj.js");
const websocketServer = require("../websocketServer");

const expect = chai.expect;

module.exports = () => {
  describe("Websocket requests", () => {
    before(() => {
      app.client.$("button=Clear Workspace").click();
    });

    const addAndSend = async () => {
      try {
        await composerObj.addRequestBtn.click();
        await workspaceObj.latestSendRequestBtn.click();
      } catch (err) {
        console.error(err);
      }
    };

    after(() => {
      app.client.$("button=Clear Workspace").click();
    });

    it("it should send and receive messages to the mock server", async () => {
      try {
        // select web sockets
        await composerObj.selectedNetwork.click();
        await app.client.$("a=WEB SOCKETS").click();

        // type in url
        await composerObj.url.setValue("ws://localhost:5000/");

        //

        await addAndSend();

        await new Promise((resolve) =>
          setTimeout(async () => {
            try {
              await app.client
                .$("#wsSendData")
                .click()
                .$("#wsMsgInput")
                .click()
                .keys("testing websocket protocol");
              await app.client.$("button=Send Message").click();

              await new Promise((resolve) =>
                setTimeout(async () => {
                  try {
                    const messageClient = await app.client
                      .$("#ws-msg-0")
                      .getText();
                    const messageServer = await app.client
                      .$("#ws-msg-1")
                      .getText();
                    expect(messageClient).to.include(
                      "testing websocket protocol"
                    );
                    expect(messageServer).to.include(
                      "testing websocket protocol"
                    );
                    resolve();
                  } catch (err) {
                    console.error(err);
                  }
                }, 300)
              );
              resolve();
            } catch (err) {
              console.error(err);
            }
          }, 1000)
        );
      } catch (err) {
        console.error(err);
      }
    });

    it("it should send and receive images to public echo test", async () => {
      try {
        await new Promise(async (resolve) => {
          try {
            //instead of this, we need to click "select file", and choose a file
            const toUpload = path.join(
              __dirname,
              "..",
              "..",
              "build",
              "icons",
              "png",
              "128x128.png"
            );

            console.log("toUpload=>", toUpload);
            // /var/folders/wt/p4tb3xz50csfvrfj897gy4ww0000gn/T/.org.chromium.Chromium.kSmkVs/uploadyVlAPI/128x128.png
            await app.client.chooseFile("#wsFileInput", toUpload);
            // const val = app.client.getValue("#upload-test");
            await app.client.$("#wsSendImgBtn").click();

            await new Promise((resolve) =>
              setTimeout(async () => {
                try {
                  const messageClient = await app.client
                    .$("#ws-msg-0")
                    .getText();
                  const messageServer = await app.client
                    .$("#ws-msg-1")
                    .getText();
                  expect(messageClient).to.include(
                    "testing websocket protocol"
                  );
                  expect(messageServer).to.include(
                    "testing websocket protocol"
                  );
                  resolve();
                } catch (err) {
                  console.error(err);
                }
              }, 300)
            );
            resolve();
          } catch (err) {
            console.error(err);
          }
        });
      } catch (err) {
        console.error(err);
      }
    });

    // it("it should be able to close and re-open connection", async () => {
    //   try {
    //     await composerObj.closeConnectonBtn.click();
    //     await composerObj.reopenConnectionBtn.click();
    //   } catch (err) {
    //     console.error(err);
    //   }
    // });
  });
};
