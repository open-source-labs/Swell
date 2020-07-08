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

// npm libraries
const { app, BrowserWindow, TouchBar, ipcMain, dialog } = require("electron");
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require("electron-devtools-installer");
// Import Auto-Updater- Swell will update itself
const { autoUpdater } = require("electron-updater");
// TouchBarButtons are our nav buttons(ex: Select All, Deselect All, Open Selected, Close Selected, Clear All)
const { TouchBarButton, TouchBarSpacer } = TouchBar;

const path = require("path");
const url = require("url");
const fs = require("fs");
const log = require("electron-log");

// basic http cookie parser
const cookie = require("cookie");
// node-fetch for the fetch request
const fetch2 = require("node-fetch");

// grpc libraries
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// GraphQL imports
const { ApolloClient } = require("apollo-client");
const gql = require("graphql-tag");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { createHttpLink } = require("apollo-link-http");
const { ApolloLink } = require("apollo-link");

// proto-parser func for parsing .proto files
const protoParserFunc = require("./src/client/protoParser.js");

// require menu file
require("./menu/mainMenu");
// require http controller file
require("./httpMainController.js")();

// configure logging
// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = "info";
// log.info("App starting...");

let mainWindow;

/****************************
 ** Create Touchbar buttons **
 *****************************/

const tbSelectAllButton = new TouchBarButton({
  label: "Select All",
  backgroundColor: "#3DADC2",
  click: () => {
    mainWindow.webContents.send("selectAll");
  },
});

const tbDeselectAllButton = new TouchBarButton({
  label: "Deselect All",
  backgroundColor: "#3DADC2",
  click: () => {
    mainWindow.webContents.send("deselectAll");
  },
});

const tbOpenSelectedButton = new TouchBarButton({
  label: "Open Selected",
  backgroundColor: "#00E28B",
  click: () => {
    mainWindow.webContents.send("openAllSelected");
  },
});

const tbCloseSelectedButton = new TouchBarButton({
  label: "Close Selected",
  backgroundColor: "#DB5D58",
  click: () => {
    mainWindow.webContents.send("closeAllSelected");
  },
});

const tbMinimizeAllButton = new TouchBarButton({
  label: "Minimize All",
  backgroundColor: "#3DADC2",
  click: () => {
    mainWindow.webContents.send("minimizeAll");
  },
});

const tbExpandAllButton = new TouchBarButton({
  label: "Expand All",
  backgroundColor: "#3DADC2",
  click: () => {
    mainWindow.webContents.send("expandedAll");
  },
});

const tbClearAllButton = new TouchBarButton({
  label: "Clear All",
  backgroundColor: "#708090",
  click: () => {
    mainWindow.webContents.send("clearAll");
  },
});

const tbSpacer = new TouchBarSpacer();

const tbFlexSpacer = new TouchBarSpacer({
  size: "flexible",
});

/********************************
 ** Attach buttons to touchbar **
 ********************************/

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

/************************
 ******** SET isDev *****
 ************************/

let isDev;
// if using Spectron, run it in production
process.argv.includes("--noDevServer") || process.argv.includes("TEST_MODE")
  ? (isDev = false)
  : (isDev = true);

/*************************
 ******* MODE DISPLAY ****
 *************************/

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

// let isDev = false;
// console.log("process.defaultApp ->", process.defaultApp);
// console.log("process.execPath -> ", process.execPath);

// if (
//   process.defaultApp ||
//   /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
//   /[\\/]electron[\\/]/.test(process.execPath)
// ) {
//   isDev = true;
// }
// console.log(
//   "current regex test -> ",
//   /[\\/]electron-prebuilt[\\/]/.test(process.execPath)
// );
// if (isDev) console.log("isDev is TRUE");
// if (isDev === false) console.log("isDev is FALSE");
// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691

if (process.platform === "win32") {
  // if user is on windows...
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

/***********************************************
 ******* createWindow function declaration *****
 ***********************************************/

function createWindow() {
  // Create the new browser window instance.
  mainWindow = new BrowserWindow({
    width: 2000,
    height: 1000,
    minWidth: 1304,
    minHeight: 700,
    backgroundColor: "-webkit-linear-gradient(top, #3dadc2 0%,#2f4858 100%)",
    show: false,
    title: "Swell",
    // allowRunningInsecureContent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
      webSecurity: true,
      preload: path.resolve(__dirname, "preload.js"),
    },
    icon: `${__dirname}/src/assets/icons/64x64.png`,
  });

  // and load the index.html of the app.
  let indexPath;

  if (isDev) {
    // if we are in dev mode load up 'http://localhost:8080/index.html'
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });

    // If we are in developer mode Add React & Redux DevTools to Electon App
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));

    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  } else {
    indexPath = url.format({
      // if we are not in dev mode load production build file
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  // our new app window will load content depending on the boolean value of the dev variable
  mainWindow.loadURL(indexPath);

  // give our new window the earlier created touchbar
  mainWindow.setTouchBar(touchBar);

  // prevent webpack-dev-server from setting new title
  mainWindow.on("page-title-updated", (e) => e.preventDefault());

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    // tldr: Remove the BrowserWindow instance that we created earlier by setting its value to null when we exit Swell
    mainWindow = null;
  });

  // moved require mainmenu to top
}

/********* end of createWindow declaration ******/

/****************************************
 ************** EVENT LISTENERS **********
 ****************************************/

// app.on('ready') will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// if in prod mode, checkForUpdates after the window is created
app.on("ready", () => {
  // createLoadingScreen();
  createWindow();
  // if (!isDev) {
  //   autoUpdater.checkForUpdates();
  // }
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    //darwin refers to macOS...
    app.quit(); // If User is on mac exit the program when all windows are closed
  }
});

ipcMain.on("toMain", (e, args) => {
  console.log("received from ipcRenderer inside main: ", args);
  mainWindow.webContents.send(
    "fromMain",
    `sending ${args} back to ipcRenderer`
  );
});

// Auto Updating Functionality
const sendStatusToWindow = (text) => {
  log.info(text);
  if (mainWindow) {
    mainWindow.webContents.send("message", text);
  }
};

// ipcMain.on("check-for-update", () => {
//   //listens to ipcRenderer in UpdatePopUpContainer.jsx
//   if (!isDev) autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// sendStatusToWindow('Checking for update...');
// // });
// autoUpdater.on('update-available', info => {
//   sendStatusToWindow('Update available.');
// });
// autoUpdater.on('update-not-available', info => {
//   sendStatusToWindow('Update not available.');
// });
// autoUpdater.on("error", (err) => {
//   console.error("autoUpdater error -> ", err);
//   sendStatusToWindow(`Error in auto-updater`);
// });
// autoUpdater.on("download-progress", (progressObj) => {
//   sendStatusToWindow(
//     `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
//   );
// });
// autoUpdater.on("update-downloaded", (info) => {
//   sendStatusToWindow("Update downloaded.");
// });

// autoUpdater.on('update-downloaded', info => {
//   // Wait 5 seconds, then quit and install
//   // In your application, you don't need to wait 500 ms.
//   // You could call autoUpdater.quitAndInstall(); immediately
//   autoUpdater.quitAndInstall();
// });
ipcMain.on("quit-and-install", () => {
  autoUpdater.quitAndInstall();
});
// App page reloads when user selects "Refresh" from pop-up dialog
ipcMain.on("fatalError", () => {
  console.log("received fatal error");
  mainWindow.reload();
});
ipcMain.on("uncaughtException", () => {
  console.log("received uncaught fatal error");
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// export collection ipc now promise-based
ipcMain.on("export-collection", (event, args) => {
  const content = JSON.stringify(args.collection);
  dialog.showSaveDialog(null).then((resp) => {
    if (resp.filePath === undefined) {
      console.log("You didn't save the file");
      return;
    }

    // fileName is a string that contains the path and filename created in the save file dialog.
    fs.writeFile(resp.filePath, content, (err) => {
      if (err) {
        console.log("An error ocurred creating the file ", err.message);
      }
    });
  });
});

ipcMain.on("import-collection", (event, args) => {
  dialog.showOpenDialog(null).then((fileNames) => {
    // reusable error message options object
    const options = {
      type: "error",
      buttons: ["Okay"],
      defaultId: 2,
      title: "Error",
      message: "",
      detail: "",
    };

    // fileNames is an array that contains all the selected
    if (fileNames === undefined) {
      console.log("No file selected");
      return;
    }

    // get first file path - not dynamic for multiple files
    const filepath = fileNames.filePaths[0];

    // get file extension
    const ext = path.extname(filepath);

    // make sure if there is an extension that it is .txt
    if (ext && ext !== ".txt") {
      options.message = "Invalid File Type";
      options.detail = "Please use a .txt file";
      dialog.showMessageBox(null, options);
      return;
    }

    // names is the list of existing collection names in state
    const collectionNames = args.map((obj) => obj.name);

    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        alert("An error ocurred reading the file :", err.message);
        return;
      }

      // parse data, will throw error if not parsable
      let parsed;
      // parsed.name already exists
      try {
        parsed = JSON.parse(data);
      } catch {
        options.message = "Invalid File Structure";
        options.detail = "Please use a JSON object";
        dialog.showMessageBox(null, options);
        return;
      }

      if (parsed) {
        // validate parsed data type and properties
        if (
          typeof parsed !== "object" ||
          !parsed["id"] ||
          !parsed["name"] ||
          !parsed["reqResArray"] ||
          !parsed["created_at"]
        ) {
          options.message = "Invalid File";
          options.detail = "Please try again.";
          dialog.showMessageBox(null, options);
          return;
        }
        // duplicate collection exists already
        if (collectionNames.includes(parsed.name)) {
          options.message = "That collection already exists in the app";
          options.detail = "Please rename file to something else";
          dialog.showMessageBox(null, options);
          return;
        }
      }

      // send data to chromium for state update
      ipcMain.send("add-collection", { data });
    });
  });
});

// ============ CONFIRM CLEAR HISTORY / RESPONSE COMMUNICATION ===============
ipcMain.on("confirm-clear-history", (event) => {
  const opts = {
    type: "warning",
    buttons: ["Okay", "Cancel"],
    message: "Are you sure you want to clear history?",
  };

  dialog
    .showMessageBox(null, opts)
    .then((response) => {
      console.log("response to clear-history : ", response);
      mainWindow.webContents.send("clear-history-response", response);
    })
    .catch((err) => console.log(`Error on 'confirm-clear-history': ${err}`));
});

// ================= GRPCProtoEntryForm Calls that uses protoParserFunc =======

// import-proto

ipcMain.on("import-proto", (event) => {
  console.log("import-proto event fired!!");
  let importedProto;
  dialog
    .showOpenDialog({
      buttonLabel: "Import Proto File",
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Protos", extensions: ["proto"] }],
    })
    .then((filePaths) => {
      if (!filePaths) return undefined;
      // read uploaded proto file & save protoContent in the store
      fs.readFile(filePaths.filePaths[0], "utf-8", (err, file) => {
        // handle read error
        if (err) {
          return console.log("error reading file : ", err);
        }
        importedProto = file;
        protoParserFunc(importedProto).then((protoObj) => {
          console.log(
            "finished with logic. about to send importedProto : ",
            importedProto,
            " and protoObj : ",
            protoObj
          );
          mainWindow.webContents.send("proto-info", importedProto, protoObj);
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// protoParserFunc-request. Just runs the function and returns the value back to GRPCProtoEntryForm

ipcMain.on("protoParserFunc-request", (event, data) => {
  protoParserFunc(data)
    .then((result) => {
      mainWindow.webContents.send("protoParserFunc-return", result);
    })
    .catch((err) =>
      console.log("err inside protoParserFunc-request listener in main", err)
    );
});

// ======================= grpcController.openGrpcConnection

ipcMain
  .on("fetch-meta-and-client", (event, data) => {
    const { rpcType, reqResObj } = data;
    const { protoPath: PROTO_PATH, packageName, service, url, rpc } = reqResObj;

    // console.log("rpcType is", rpcType);
    // console.log(
    //   "PROTO_PATH, packageName, service, url, rpc",
    //   PROTO_PATH,
    //   packageName,
    //   service,
    //   url,
    //   rpc
    // );

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    // create client credentials
    const serverName = grpc.loadPackageDefinition(packageDefinition)[
      packageName
    ];
    const client = new serverName[service](
      `${url}`,
      grpc.credentials.createInsecure()
    );
    // create client requested metadata key and value pair for each type of streaming
    const meta = new grpc.Metadata();
    const metaArr = reqResObj.request.headers;
    for (let i = 0; i < metaArr.length; i += 1) {
      const currentHeader = metaArr[i];
      meta.add(currentHeader.key, currentHeader.value);
    }
    // console.log("rpcType", rpcType);
    // instead of sending back meta and client, try to do more stuff directly inside here, in main
    if (rpcType === "UNARY") {
      // console.log("inside UNARY if statement");
      const query = reqResObj.queryArr[0];
      const time = {};

      // Open Connection and set time sent for Unary
      reqResObj.connection = "open";

      time.timeSent = Date.now();
      // make Unary call
      client[rpc](query, meta, (err, data) => {
        if (err) {
          console.log("unary error", err);
        } else {
          console.log("client[rpc] WORKED in main!!!");
        }
      });

      // Close Connection and set time received for Unary
      reqResObj.timeSent = time.timeSent;

      time.timeReceived = Date.now();
      reqResObj.timeReceived = time.timeReceived;

      reqResObj.connection = "closed";
      reqResObj.response.events.push(data);
      reqResObj.response.times.push(time);
    }
    // send back to grpc to save to front end
    //   store.default.dispatch(actions.reqResUpdate(reqResObj));
  }) // metadata from server
  .on("metadata", (metadata) => {
    // if metadata is sent back from the server, analyze and handle
    console.log("INSIDE metadata listener!!!");
    const keys = Object.keys(metadata._internal_repr);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      reqResObj.response.headers[key] = metadata._internal_repr[key][0];
    }
    // store.default.dispatch(actions.reqResUpdate(reqResObj));
  });

// ====================== OLDER STUFF =======================

// ipcMain listener that
ipcMain.on("http1-fetch-message", (event, arg) => {
  const { method, headers, body } = arg.options;

  fetch2(headers.url, { method, headers, body })
    .then((response) => {
      const headers = response.headers.raw();
      // check if the endpoint sends SSE
      // add status code for regular http requests in the response header

      if (headers["content-type"][0].includes("stream")) {
        // invoke another func that fetches to SSE and reads stream
        // params: method, headers, body
        event.sender.send("http1-fetch-reply", {
          headers,
          body: { error: "This Is An SSE endpoint" },
        });
      } else {
        headers[":status"] = response.status;

        const receivedCookie = headers["set-cookie"];
        headers.cookies = receivedCookie;

        const contents = /json/.test(response.headers.get("content-type"))
          ? response.json()
          : response.text();
        contents
          .then((body) => {
            event.sender.send("http1-fetch-reply", { headers, body });
          })
          .catch((error) => console.log("ERROR", error));
      }
    })
    .catch((error) => console.log(error));
});

ipcMain.on("open-gql", (event, args) => {
  const reqResObj = args.reqResObj;

  // populating headers object with response headers - except for Content-Type
  const headers = {};
  reqResObj.request.headers
    .filter((item) => item.key !== "Content-Type")
    .forEach((item) => {
      headers[item.key] = item.value;
    });

  // request cookies from reqResObj to request headers
  let cookies;
  if (reqResObj.request.cookies.length) {
    cookies = reqResObj.request.cookies.reduce((acc, userCookie) => {
      return acc + `${userCookie.key}=${userCookie.value}; `;
    }, "");
  }
  headers.Cookie = cookies;

  // afterware takes headers from context response object, copies to reqResObj
  const afterLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const context = operation.getContext();
      const headers = context.response.headers.entries();
      for (const headerItem of headers) {
        const key = headerItem[0]
          .split("-")
          .map((item) => item[0].toUpperCase() + item.slice(1))
          .join("-");
        reqResObj.response.headers[key] = headerItem[1];

        // if cookies were sent by server, parse first key-value pair, then cookie.parse the rest
        if (headerItem[0] === "set-cookie") {
          const parsedCookies = [];
          const cookieStrArr = headerItem[1].split(", ");
          cookieStrArr.forEach((thisCookie) => {
            thisCookie = thisCookie.toLowerCase();
            // index of first semicolon
            const idx = thisCookie.search(/[;]/g);
            // first key value pair
            const keyValueArr = thisCookie.slice(0, idx).split("=");
            // cookie contents after first key value pair
            const parsedRemainingCookieProperties = cookie.parse(
              thisCookie.slice(idx + 1)
            );

            const parsedCookie = {
              ...parsedRemainingCookieProperties,
              name: keyValueArr[0],
              value: keyValueArr[1],
            };

            parsedCookies.push(parsedCookie);
          });
          reqResObj.response.cookies = parsedCookies;
        }
      }

      return response;
    });
  });

  // creates http connection to host
  const httpLink = createHttpLink({
    uri: reqResObj.url,
    headers,
    credentials: "include",
    fetch: fetch2,
  });

  // additive composition of multiple links
  const link = ApolloLink.from([afterLink, httpLink]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  const body = gql`
    ${reqResObj.request.body}
  `;
  const variables = reqResObj.request.bodyVariables
    ? JSON.parse(reqResObj.request.bodyVariables)
    : {};

  if (reqResObj.request.method === "QUERY") {
    client
      .query({ query: body, variables })

      .then((data) => {
        event.sender.send("reply-gql", { reqResObj, data });
      })
      .catch((err) => {
        console.error(err);
        event.sender.send("reply-gql", { error: err.networkError, reqResObj });
      });
  } else if (reqResObj.request.method === "MUTATION") {
    client
      .mutate({ mutation: body, variables })
      .then((data) => event.sender.send("reply-gql", { reqResObj, data }))
      .catch((err) => {
        console.error(err);
      });
  }
});

// export main window so we can access ipcMain from other files
module.exports = mainWindow;
