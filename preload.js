const { ipcRenderer, contextBridge } = require("electron");

const apiObj =  {
  send: (channel, ...data) => {
    // allowlist channels
    const allowedChannels = [
      "toMain",
      "confirm-clear-history",
      "import-proto",
      "quit-and-install",
      "open-gql",
      "import-collection",
      "export-collection",
      'open-http',
    ];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, ...data);
    }
  },
  receive: (channel, cb) => {
    // allowlist channels
    const allowedChannels = [
      "fromMain",
      "add-collection",
      "clear-history-response",
      "proto-info",
      "message",
      "reply-gql",
      'reqResUpdate',
    ];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cb(...args));
    }
  },
}

// this is because we need to have context isolation to be false for spectron tests to run, but context bridge only runs if context isolation is true
// basically we are assigning certain node functionality (require, ipcRenderer) to the window object in an UN-isolated context only for testing
// security is reduced for testing, but remains sturdy otherwise
if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require;
  window.api = apiObj; 
}

contextBridge.exposeInMainWorld("api", apiObj);


