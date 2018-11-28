'use strict';

// Allow self-signing HTTPS over TLS
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Import parts of electron to use
const { app, BrowserWindow, TouchBar } = require('electron');
const path = require('path');
const url = require('url');

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require('electron-devtools-installer');

// const player = require('play-sound')
// const wave = new Audio('./src/assets/audio/wavebig.mpg')

const {
  TouchBarLabel,
  TouchBarButton,
  TouchBarSpacer,
  TouchBarColorPicker,
  TouchBarSlider,
  TouchBarPopover,
} = TouchBar;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let winHeight;

const tbRefreshButton = new TouchBarButton({
  label: 'Update',
  iconPosition: 'right',
  // backgroundColor: '#00E28B',
  click: () => {
    app.relaunch();
    app.exit(0);
  },
});

const tbSelectAllButton = new TouchBarButton({
  label: 'Select All',
  backgroundColor: '#3DADC2',
  click: () => {
    console.log('select all');
    mainWindow.webContents.send('selectAll');
  },
});

const tbDeselectAllButton = new TouchBarButton({
  label: 'Deselect All',
  backgroundColor: '#3DADC2',
  click: () => {
    console.log('deselect all');
    mainWindow.webContents.send('deselectAll');
  },
});

const tbOpenSelectedButton = new TouchBarButton({
  label: 'Open Selected',
  backgroundColor: '#00E28B',
  click: () => {
    console.log('opening all selected');
    mainWindow.webContents.send('openAllSelected');
  },
});

const tbCloseSelectedButton = new TouchBarButton({
  label: 'Close Selected',
  backgroundColor: '#DB5D58',
  click: () => {
    console.log('closing all selected');
    mainWindow.webContents.send('closeAllSelected');
  },
});

const tbClearAllButton = new TouchBarButton({
  label: 'Clear All',
  backgroundColor: '#708090',
  click: () => {
    console.log('clearing all');
    mainWindow.webContents.send('clearAll');
  },
});

const tbSlider = new TouchBarSlider({
  label: 'Size',
  minValue: 500,
  maxValue: 2000,
  value: 1024,
  change: (val) => {
    mainWindow.setSize(val, winHeight, true);
  },
});

const tbPopover = new TouchBarPopover({
  items: new TouchBar([tbSlider]),
  label: 'Size',
});

const tbPicker = new TouchBarColorPicker({
  change: (color) => {
    mainWindow.webContents.insertCSS(`.btn{background-color:${color};`);
  },
});

const tbSpacer = new TouchBarSpacer();

const tbFlexSpacer = new TouchBarSpacer({
  size: 'flexible',
});

const tbLabel = new TouchBarLabel({
  label: 'Swell Touch Bar',
});

const touchBar = new TouchBar([
  tbLabel,
  tbSpacer,
  tbSelectAllButton,
  tbDeselectAllButton,
  tbOpenSelectedButton,
  tbCloseSelectedButton,
  tbClearAllButton,
  tbFlexSpacer,
  tbRefreshButton,
]);

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
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true');
  app.commandLine.appendSwitch('force-device-scale-factor', '1');
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    title: 'Swell',
    webPreferences: { webSecurity: false },
    icon: `${__dirname}/icons/64x64.png`,
  });

  // Adding React & Redux DevTools to Electon App
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));

  installExtension(REDUX_DEVTOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));

  // and load the index.html of the app.
  let indexPath;

  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  mainWindow.setTouchBar(touchBar);

  // prevent webpack-dev-server from setting new title
  mainWindow.on('page-title-updated', e => e.preventDefault());

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('app data path', app.getPath('appData'));
    // wave.play()
    // play wave crash on open
    // player.Play('./src/assets/audio/wavebig.mpg', (err) => {
    //   if (err) throw err
    // })

    [winHeight] = mainWindow.getSize();

    // Open the DevTools automatically if developing
    if (dev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
