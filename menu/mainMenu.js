const { Menu } = require('electron');
const electron = require('electron');

const { app } = electron;
// --------------------------------------------------------------------------------------------------
// Here we are creating an array of menu tabs. Each menu tab will have its own list items(aka a sub-menu).
// This array called template will be our default menu set up
// --------------------------------------------------------------------------------------------------
const template = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },

      // A dividing line between menu items
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R', // keyboard shortcut that will reload the current window
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        },
      },

      // THIS ENABLES DEVELOPER TOOLS IN THE BUILT APPLICATION
      {
        label: 'Toggle Developer Tools',
        visible: process.env.NODE_ENV === 'development',
        accelerator:
          process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I', // another keyboard shortcut that will be conditionally assigned depending on whether or not user is on macOS
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        },
      },

      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },

  { role: 'window', submenu: [{ role: 'minimize' }, { role: 'close' }] },

  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() {
          electron.shell.openExternal('http://electron.atom.io');
        },
      },
    ],
  },
];
// --------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------
// If the user is on mac create an extra menu tab that will be labeled as the name of your app
// This new tab will have submenu features that windows and linux users will not have access to
// --------------------------------------------------------------------------------------------------
if (process.platform === 'darwin') {
  // if user is on mac...
  const { name } = app;
  template.unshift({
    // add on these new menu items
    label: name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  });
  // template[1] refers to the Edit menu.
  template[1].submenu.push(
    // If user is on macOS also provide speech based submenu items in addition to the edit menu's other submenu items that were set earlier
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
    }
  );
  // template[3] refers to the Window menu.
  template[3].submenu = [
    // if user is on macOS replace the Window menu that we created earlier with the submenu below
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close',
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize',
    },
    {
      label: 'Zoom',
      role: 'zoom',
    },
    {
      type: 'separator',
    },
    {
      label: 'Bring All to Front',
      role: 'front',
    },
  ];
}
// create our menu with the Menu module imported from electron,
// use its built in method buildFromTemplate
// and pass in the template we've just created
const menu = Menu.buildFromTemplate(template);

// append our newly created menu to our app
Menu.setApplicationMenu(menu);
