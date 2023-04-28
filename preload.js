const { ipcRenderer, contextBridge } = require('electron');

const apiObj = {
  send: (channel, ...data) => {
    // allow list channels SENDING to Main
    const allowedChannels = [
      'check-for-update',
      'confirm-clear-history',
      'export-collection',
      'fatalError',
      'import-collection',
      'import-proto',
      'import-openapi',
      'open-http',
      'close-http',
      'open-gql',
      'open-grpc',
      'protoParserFunc-request',
      'openapiParserFunc-request',
      'quit-and-install',
      'uncaughtException',
      'introspect',
      'open-ws',
      'send-ws',
      'set-cookie',
      'close-ws',
      'open-openapi',
      'exportChatLog',
      'start-mock-server',
      'stop-mock-server',
      'submit-mock-request',
    ];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, ...data);
    } else {
      console.log('Channel not allowed: ', channel);
    }
  },
  receive: (channel, cb) => {
    // allow list channels
    const allowedChannels = [
      'add-collections',
      'clear-history-response',
      'introspect-reply',
      'message',
      'openapi-info',
      'openapiParserFunc-return',
      'proto-info',
      'protoParserFunc-return',
      'reply-gql',
      'reqResUpdate',
      'set-cookie',
      'update-connectionArray',
    ];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cb(...args));
    } else {
      console.log('Channel not allowed: ', channel);
    }
  },
  removeAllListeners: (channel, cb) => {
    // allow list channels
    const allowedChannels = ['reqResUpdate', 'reply-gql'];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel, (event, ...args) => cb(...args));
    } else {
      console.log('Channel not allowed: ', channel);
    }
  },
};

// this is because we need to have context isolation to be false for spectron 
// tests to run, but context bridge only runs if context isolation is true
// basically we are assigning certain node functionality (require, ipcRenderer) 
// to the window object in an UN-isolated context only for testing
// security is reduced for testing, but remains sturdy otherwise

if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require;
  window.api = apiObj;
} else {
  contextBridge.exposeInMainWorld('api', apiObj);
}
