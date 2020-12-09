const { ipcRenderer, contextBridge } = require("electron");

const apiObj = {
  send: (channel, ...data) => {
    // allowlist channels SENDING to Main
    const allowedChannels = [
      "check-for-update",
      "confirm-clear-history",
      "export-collection",
      "fatalError",
      "import-collection",
      "import-proto",
      "open-http",
      "close-http",
      "open-gql",
      "open-grpc",
      "protoParserFunc-request",
      "quit-and-install",
      "uncaughtException",
      "introspect",
      "open-ws",
      "send-ws",
      "close-ws",
      "testFileSent"
    ];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, ...data);
    }
  },
  receive: (channel, cb) => {
    // allowlist channels
    const allowedChannels = [
      "add-collection",
      "clear-history-response",
      "message",
      "proto-info",
      "protoParserFunc-return",
      "reply-gql",
      "reqResUpdate",
      "introspect-reply",
      "update-connectionArray",
      "testResult"
    ];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cb(...args));
    }
  },
};

// this is because we need to have context isolation to be false for spectron tests to run, but context bridge only runs if context isolation is true
// basically we are assigning certain node functionality (require, ipcRenderer) to the window object in an UN-isolated context only for testing
// security is reduced for testing, but remains sturdy otherwise
if (process.env.NODE_ENV === "test") {
  console.log("made it into here");
  window.electronRequire = require;
  window.api = apiObj;
} else {
  contextBridge.exposeInMainWorld("api", apiObj);
}
