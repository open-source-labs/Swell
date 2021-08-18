// Allow self-signing HTTPS over TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
// Allow self-signing HTTPS over TLS
// Disabling Node's rejection of invalid/unauthorized certificates
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// from stack overflow: https://stackoverflow.com/a/35633993/11606641
// Your fix is insecure and shouldn't really be done at all, but is often done in development (it should never be done in production).
// The proper solution should be to put the self-signed certificate in your trusted root store OR to get a proper certificate signed by an existing Certificate Authority (which is already trusted by your server).

// Import parts of electron to use
// app - Control your application's event lifecycle
// ipcMain - Communicate asynchronously from the main process to renderer processes

const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const { autoUpdater } = require('electron-updater');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require('electron-devtools-installer');

const path = require('path');
const url = require('url');
const fs = require('fs');
const log = require('electron-log');

// proto-parser func for parsing .proto files
const protoParserFunc = require('./main_process/protoParser.js');

// openapi parser func for parsing openAPI documents in JSON or YAML format
const openapiParserFunc = require('./main_process/openapiParser.js');

// require menu file
require('./menu/mainMenu');
// require http controller file
require('./main_process/main_httpController.js')();
// require gql controller file
require('./main_process/main_graphqlController')();
// require grpc controller file
require('./main_process/main_grpcController.js')();
// require ws controller file
require('./main_process/main_wsController.js')();
// require mac touchBar
const { touchBar } = require('./main_process/main_touchbar.js');

// configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

/** **********************
 ******** SET isDev *****
 *********************** */
// default to production mode
let isDev = false;
// if running webpack-server, change to development mode
if (process.argv.includes('dev')) {
  isDev = true;
}

/** ***********************
 ******* MODE DISPLAY ****
 ************************ */

isDev
  ? console.log(`

=========================
  Launching in DEV mode
=========================
  `)
  : console.log(`

================================
  Launching in PRODUCTION mode
================================
  `);

if (process.platform === 'win32') {
  // if user is on windows...
  app.commandLine.appendSwitch('high-dpi-support', 'true');
  // app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

/** *********************************************
 ******* createWindow function declaration *****
 ********************************************** */

function createWindow() {
  // Create the new browser window instance.
  mainWindow = new BrowserWindow({
    width: 2000,
    height: 1000,
    minWidth: 1304,
    minHeight: 700,
    backgroundColor: '-webkit-linear-gradient(top, #3dadc2 0%,#2f4858 100%)',
    show: false,
    title: 'Swell',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: process.env.NODE_ENV !== 'test', // true if in dev mode
      sandbox: process.env.NODE_ENV !== 'test',
      webSecurity: true,
      preload: path.resolve(__dirname, 'preload.js'),
    },
    icon: `${__dirname}/src/assets/icons/64x64.png`,
  });

  // and load the index.html of the app.
  let indexPath;

  if (isDev) {
    // if we are in dev mode load up 'http://localhost:8080/index.html'
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true,
    });

    // If we are in developer mode Add React & Redux DevTools to Electron App
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));

    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  } else {
    indexPath = url.format({
      // if we are not in dev mode load production build file
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true,
    });
  }

  // our new app window will load content depending on the boolean value of the dev variable
  mainWindow.loadURL(indexPath);

  // give our new window the earlier created touchbar
  mainWindow.setTouchBar(touchBar);

  // prevent webpack-dev-server from setting new title
  mainWindow.on('page-title-updated', (e) => e.preventDefault());

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if (isDev && process.env.NODE_ENV !== 'test') {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    // tldr: Remove the BrowserWindow instance that we created earlier by setting its value to null when we exit Swell
    mainWindow = null;
  });
}

/** ******* end of createWindow declaration ***** */

/** **************************************
 ************** EVENT LISTENERS **********
 *************************************** */

// app.on('ready') will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// if in prod mode, checkForUpdates after the window is created
app.on('ready', () => {
  createWindow();
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

// Auto Updating Functionality
const sendStatusToWindow = (text) => {
  log.info(text);
  if (mainWindow) {
    mainWindow.webContents.send('message', text);
  }
};

ipcMain.on('check-for-update', () => {
  // listens to ipcRenderer in UpdatePopUpContainer.jsx
  console.log('check for update');
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
});
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (err) => {
  console.error('autoUpdater error -> ', err);
  sendStatusToWindow(`Error in auto-updater`);
});
autoUpdater.on('download-progress', (progressObj) => {
  sendStatusToWindow(
    `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
  );
});
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded.');
});

autoUpdater.on('update-downloaded', (info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 500 ms.
  // You could call autoUpdater.quitAndInstall(); immediately
  autoUpdater.quitAndInstall();
});
ipcMain.on('quit-and-install', () => {
  autoUpdater.quitAndInstall();
});
// App page reloads when user selects "Refresh" from pop-up dialog
ipcMain.on('fatalError', () => {
  console.log('received fatal error');
  mainWindow.reload();
});
ipcMain.on('uncaughtException', () => {
  console.log('received uncaught fatal error');
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// export collection ipc now promise-based
ipcMain.on('export-collection', (event, args) => {
  const content = JSON.stringify(args.collection);
  dialog.showSaveDialog(null).then((resp) => {
    if (resp.filePath === undefined) {
      console.log("You didn't save the file");
      return;
    }

    // fileName is a string that contains the path and filename created in the save file dialog.
    fs.writeFile(resp.filePath, content, (err) => {
      if (err) {
        console.log('An error ocurred creating the file ', err.message);
      }
    });
  });
});

ipcMain.on('import-collection', (event, args) => {
  dialog.showOpenDialog(null).then((fileNames) => {
    // reusable error message options object
    const options = {
      type: 'error',
      buttons: ['Okay'],
      defaultId: 2,
      title: 'Error',
      message: '',
      detail: '',
    };

    // fileNames is an array that contains all the selected
    if (fileNames === undefined) {
      console.log('No file selected');
      return;
    }

    // get first file path - not dynamic for multiple files
    const filepath = fileNames.filePaths[0];

    // get file extension
    const ext = path.extname(filepath);

    // make sure if there is an extension that it is .txt
    if (ext && ext !== '.txt') {
      options.message = 'Invalid File Type';
      options.detail = 'Please use a .txt file';
      dialog.showMessageBox(null, options);
      return;
    }

    // names is the list of existing collection names in state
    const collectionNames = args.map((obj) => obj.name);
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) {
        alert('An error ocurred reading the file :', err.message);
        return;
      }
      // parse data, will throw error if not parsable
      let parsed;
      // parsed.name already exists
      try {
        parsed = JSON.parse(data);
      } catch {
        options.message = 'Invalid File Structure';
        options.detail = 'Please use a JSON object';
        dialog.showMessageBox(null, options);
        return;
      }

      if (parsed) {
        // validate parsed data type and properties
        if (
          typeof parsed !== 'object' ||
          !parsed.id ||
          !parsed.name ||
          !parsed.reqResArray ||
          !parsed.created_at
        ) {
          options.message = 'Invalid File';
          options.detail = 'Please try again.';
          dialog.showMessageBox(null, options);
          return;
        }
        // duplicate collection exists already
        if (collectionNames.includes(parsed.name)) {
          options.message = 'That collection already exists in the app';
          options.detail = 'Please rename file to something else';
          dialog.showMessageBox(null, options);
          return;
        }
      }
      // send data to chromium for state update
      event.sender.send('add-collection', JSON.stringify(JSON.parse(data)));
    });
  });
});

// ============ CONFIRM CLEAR HISTORY / RESPONSE COMMUNICATION ===============
ipcMain.on('confirm-clear-history', (event) => {
  const opts = {
    type: 'warning',
    buttons: ['Okay', 'Cancel'],
    message: 'Are you sure you want to clear history?',
  };

  dialog
    .showMessageBox(null, opts)
    .then((response) => {
      mainWindow.webContents.send('clear-history-response', response);
    })
    .catch((err) => console.log(`Error on 'confirm-clear-history': ${err}`));
});

// ================= GRPCProtoEntryForm Calls that uses protoParserFunc =======
ipcMain.on('import-proto', (event) => {
  let importedProto;
  dialog
    .showOpenDialog({
      buttonLabel: 'Import Proto File',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Protos', extensions: ['proto'] }],
    })
    .then((filePaths) => {
      if (!filePaths) return undefined;
      // read uploaded proto file & save protoContent in the store
      fs.readFile(filePaths.filePaths[0], 'utf-8', (err, file) => {
        // handle read error
        if (err) {
          return console.log('import-proto error reading file : ', err);
        }
        importedProto = file;
        protoParserFunc(importedProto).then((protoObj) => {
          // console.log(
          //   "finished with logic. about to send importedProto : ",
          //   importedProto,
          //   " and protoObj : ",
          //   protoObj
          // );
          mainWindow.webContents.send('proto-info', importedProto, protoObj);
        });
      });
    })
    .catch((err) => {
      console.log('error in import-proto', err);
    });
});

// protoParserFunc-request
// Runs the function and returns the value back to GRPCProtoEntryForm
ipcMain.on('protoParserFunc-request', (event, data) => {
  protoParserFunc(data)
    .then((result) => {
      mainWindow.webContents.send('protoParserFunc-return', result);
    })
    .catch((err) => {
      console.log('error in protoParserFunc-request:, ', err);
      mainWindow.webContents.send('protoParserFunc-return', { error: err });
    });
});

// ====== Loading and parsing an OpenAPI Document with openapiParserFunc ======
ipcMain.on('import-openapi', (event) => {
  let importedDocument;
  dialog
    .showOpenDialog({
      buttonLabel: 'Import OpenApi File',
      properties: ['openFile', 'multiSelections'],
    })
    .then((filePaths) => {
      if (!filePaths) return undefined;
      // read uploaded document & save in the redux store
      fs.readFile(filePaths.filePaths[0], 'utf-8', (err, file) => {
        // handle read error
        if (err) {
          return console.log('import-openapi error reading file : ', err);
        }
        importedDocument = file;
        const documentObj = openapiParserFunc(importedDocument);
        mainWindow.webContents.send(
          'openapi-info',
          importedDocument,
          documentObj
        );
      });
    })
    .catch((err) => {
      console.log('error in import-openapi', err);
    });
});

// openapiParserFunc-request.
// Runs the function and returns the value back to OpenAPIDocumentEntryForm
ipcMain.on('openapiParserFunc-request', (event, data) => {
  openapiParserFunc(data)
    .then((result) => {
      mainWindow.webContents.send('openapiParserFunc-return', result);
    })
    .catch((err) => {
      console.log('error in openapiParserFunc-request:, ', err);
      mainWindow.webContents.send('openapiParserFunc-return', { error: err });
    });
});
