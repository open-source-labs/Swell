// Allow self-signing HTTPS over TLS
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Import parts of electron to use
// app - Control your application's event lifecycle
// ipcMain - Communicate asynchronously from the main process to renderer processes
const { app, BrowserWindow, TouchBar, ipcMain } = require('electron')
const path = require('path');
const url = require('url');

// Import Auto-Updater- Swell will update itself
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
// TouchBarButtons are our nav buttons(ex: Select All, Deselect All, Open Selected, Close Selected, Clear All)
const { TouchBarButton, TouchBarSpacer } = TouchBar;

// // configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

// -----------------------------------------------------------------
// Create Touchbar buttons
// -----------------------------------------------------------------
const tbSelectAllButton = new TouchBarButton({
  label: 'Select All',
  backgroundColor: '#3DADC2',
  click: () => {
    mainWindow.webContents.send('selectAll');
  },
});

const tbDeselectAllButton = new TouchBarButton({
  label: 'Deselect All',
  backgroundColor: '#3DADC2',
  click: () => {
    mainWindow.webContents.send('deselectAll');
  },
});

const tbOpenSelectedButton = new TouchBarButton({
  label: 'Open Selected',
  backgroundColor: '#00E28B',
  click: () => {
    mainWindow.webContents.send('openAllSelected');
  },
});

const tbCloseSelectedButton = new TouchBarButton({
  label: 'Close Selected',
  backgroundColor: '#DB5D58',
  click: () => {
    mainWindow.webContents.send('closeAllSelected');
  },
});

const tbMinimizeALlButton = new TouchBarButton({
  label: 'Minimize All',
  backgroundColor: '#3DADC2',
  click: () => {
    mainWindow.webContents.send('minimizeAll');
  },
});

const tbExpandAllButton = new TouchBarButton({
  label: 'Expand All',
  backgroundColor: '#3DADC2',
  click: () => {
    mainWindow.webContents.send('expandedAll');
  },
});

const tbClearAllButton = new TouchBarButton({
  label: 'Clear All',
  backgroundColor: '#708090',
  click: () => {
    // console.log('clearing all');
    mainWindow.webContents.send('clearAll');
  },
});


const tbSpacer = new TouchBarSpacer();

const tbFlexSpacer = new TouchBarSpacer({
  size: 'flexible',
});
// -----------------------------------------------------------------
// Attach earlier made buttons to a touch bar
// -----------------------------------------------------------------

const touchBar = new TouchBar([tbSpacer, tbSelectAllButton, tbDeselectAllButton, tbOpenSelectedButton, tbCloseSelectedButton, , tbMinimizeALlButton, tbExpandAllButton, tbClearAllButton]);


// Keep a reference for dev mode
let dev = false;

if (
  process.defaultApp
  || /[\\/]electron-prebuilt[\\/]/.test(process.execPath)
  || /[\\/]electron[\\/]/.test(process.execPath)
) {
  dev = true;
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {// if user is on windows...
  app.commandLine.appendSwitch('high-dpi-support', 'true');
  app.commandLine.appendSwitch('force-device-scale-factor', '1');
}

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
    allowRunningInsecureContent: true,
    webPreferences: {
      "nodeIntegration": true,
      "sandbox": false,
      webSecurity: false,
    },
    icon: `${__dirname}/src/assets/icons/64x64.png`
  })

  if (dev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
    // If we are in developer mode Add React & Redux DevTools to Electon App
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err));

    installExtension(REDUX_DEVTOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err));
  }

  // and load the index.html of the app.
  let indexPath;

  if (dev && process.argv.indexOf('--noDevServer') === -1) {// if we are in dev mode load up 'http://localhost:8080/index.html'
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true,
    });
  }
  else {
    indexPath = url.format({// if we are not in dev mode load production build file
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
  mainWindow.on('page-title-updated', e => e.preventDefault());

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Open the DevTools automatically if developing
    if (dev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    //tldr: Remove the BrowserWindow instance that we created earlier by setting its value to null when we exit Swell
    mainWindow = null;
  });

  //require menu file
  require('./menu/mainMenu')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // createLoadingScreen();
  createWindow();
  if (!dev) { autoUpdater.checkForUpdates() };
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {//darwin refers to macOS... 
    app.quit();// If User is on mac exit the program when all windows are closed
  }
});

// Auto Updating Functionality
const sendStatusToWindow = (text) => {
  log.info(text);
  if (mainWindow) {
    mainWindow.webContents.send('message', text);
  }
};

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', info => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', info => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', err => {
  sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
});
autoUpdater.on('download-progress', progressObj => {
  sendStatusToWindow(
    `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
  );
});
autoUpdater.on('update-downloaded', info => {
  sendStatusToWindow('Update downloaded; will install now');
});

autoUpdater.on('update-downloaded', info => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 500 ms.
  // You could call autoUpdater.quitAndInstall(); immediately
  autoUpdater.quitAndInstall();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
