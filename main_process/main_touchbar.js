const { TouchBar } = require('electron');
// TouchBarButtons are our nav buttons(ex: Select All, Deselect All, Open Selected, Close Selected, Clear All)

const { TouchBarButton, TouchBarSpacer } = TouchBar;

/** **************************
 ** Create Touchbar buttons **
 **************************** */

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

const tbMinimizeAllButton = new TouchBarButton({
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
    mainWindow.webContents.send('clearAll');
  },
});

const tbSpacer = new TouchBarSpacer();

const tbFlexSpacer = new TouchBarSpacer({
  size: 'flexible',
});

/** ******************************
 ** Attach buttons to touchbar **
 ******************************* */

const touchBar = new TouchBar([
  tbSpacer,
  tbSelectAllButton,
  tbDeselectAllButton,
  tbOpenSelectedButton,
  tbCloseSelectedButton,
  tbMinimizeAllButton,
  tbExpandAllButton,
  tbClearAllButton,
]);

module.exports = touchBar;
