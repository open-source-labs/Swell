const { ipcMain } = require("electron");
const fs = require("fs");
const fetch2 = require("node-fetch");
const http2 = require("http2");
const setCookie = require("set-cookie-parser");
const SSEController = require("./SSEController");
const testingController = require("./main_testingController");

// Use this for HTTPS cert when in Dev or Test environment and
// using a server with self-signed cert on localhost
const LOCALHOST_CERT_PATH = "test/HTTP2_cert.pem";

const httpController = {
  openHTTP2Connections: {},
  openHTTP2Streams: {},

  // ----------------------------------------------------------------------------

  openHTTPconnection(event, reqResObj) {
    // HTTP2 currently only on HTTPS
    if (reqResObj.protocol === "https://") {
      httpController.establishHTTP2Connection(event, reqResObj);
    } else {
      httpController.establishHTTP1connection(event, reqResObj);
    }
  },

  closeHTTPconnection(event, reqResObj) {
    if (reqResObj.isHTTP2) this.closeHTTP2Stream(event, reqResObj);
    else this.closeHTTP1Connection(event, reqResObj);
  },

  // ----------------------------------------------------------------------------

  closeHTTP1Connection(event, reqResObj) {
    if (reqResObj.request.isSSE) {
      SSEController.closeConnection(reqResObj.id);
    }
  },

  closeHTTP2Stream(event, reqResObj) {
    const stream = this.openHTTP2Streams[reqResObj.id];
    if (stream) {
      stream.close();
      delete this.openHTTP2Streams[reqResObj.id];
    }
  },

  establishHTTP2Connection(event, reqResObj) {
    /*
      Looks for existing HTTP2 connection in openHTTP2Connections.
      If exists, use connection to initiate request
      If not, create connection and save it to openHTTP2Connections, and then initiate request
    */
    const { host } = reqResObj;
    const foundHTTP2Connection = httpController.openHTTP2Connections[host];

    // --------------------------------------------------
    // EXISTING HTTP2 CONNECTION IS FOUND -----
    // --------------------------------------------------
    if (foundHTTP2Connection) {
      const { client } = foundHTTP2Connection;

      // periodically check connection status
      // if destroyed or closed, remove from the conections collectoon and try to create a newhttp2 connection
      // if failed (could be protocol error) move to HTTP1 and delete from http2 connections collection so user can try again
      const interval = setInterval(() => {
        if (client.destroyed || client.closed) {
          clearInterval(interval);
          delete httpController.openHTTP2Connections[host];
          httpController.openHTTPconnection(event, reqResObj);
        } else if (foundHTTP2Connection.status === "failed") {
          clearInterval(interval);
          delete httpController.openHTTP2Connections[host];
          httpController.establishHTTP1connection(event, reqResObj);
        } else if (foundHTTP2Connection.status === "connected") {
          clearInterval(interval);
          httpController.attachRequestToHTTP2Client(client, event, reqResObj);
        }
      }, 50);

      // if hasnt changed in 10 seconds, destroy client and clean up memory, send as error to front-end
      setTimeout(() => {
        clearInterval(interval);
        if (foundHTTP2Connection.status === "initialized") {
          client.destroy();
          delete httpController.openHTTP2Connections[host];
          reqResObj.connection = "error";
          event.sender.send("reqResUpdate", reqResObj);
        }
      }, 10000);
    }
    // --------------------------------------------------
    // NO EXISTING HTTP2 CONNECTION - make it before attaching request
    // --------------------------------------------------
    else {
      console.log("no pre-existing http2 found");

      const clientOptions = {};
      // for self-signed certs on localhost in dev and test environments
      if (host.includes("localhost")) {
        clientOptions.ca = fs.readFileSync(LOCALHOST_CERT_PATH);
      }

      const client = http2.connect(host, clientOptions, () =>
        console.log("connected!, reqRes.Obj.host", host)
      );

      // save HTTP2 connection to open connection collection
      const http2Connection = {
        client,
        status: "initialized",
      };
      httpController.openHTTP2Connections[host] = http2Connection;

      client.on("error", (err) => {
        console.log("HTTP2 FAILED...trying HTTP1\n", err);
        http2Connection.status = "failed";
        try {
          client.destroy();
        } catch (error) {
          console.log("error destroying HTTP2 client", error);
        }
        delete httpController.openHTTP2Connections[host];

        // try again with fetch (HTTP1);
        httpController.establishHTTP1connection(event, reqResObj);
      });

      client.on("connect", () => {
        http2Connection.status = "connected";
        this.attachRequestToHTTP2Client(client, event, reqResObj);
      });
    }
  },

  // ----------------------------------------------------------------------------

  attachRequestToHTTP2Client(client, event, reqResObj) {
    // initialize / clear response data and update front end
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = "pending";
    reqResObj.timeSent = Date.now();
    event.sender.send("reqResUpdate", reqResObj);

    // format headers in chosen reqResObj so we can add them to our request
    const formattedHeaders = {};
    reqResObj.request.headers.forEach((header) => {
      formattedHeaders[header.key] = header.value;
    });
    formattedHeaders[":path"] = reqResObj.path;
    formattedHeaders[":method"] = reqResObj.request.method;

    // initiate request
    // do not immediately close the *writable* side of the http2 stream
    const reqStream = client.request(formattedHeaders, {
      endStream: false,
    });
    // save stream to collection for later access
    this.openHTTP2Streams[reqResObj.id] = reqStream;

    //now close the writable side of our stream
    if (
      reqResObj.request.method !== "GET" &&
      reqResObj.request.method !== "HEAD"
    ) {
      reqStream.end(reqResObj.request.body);
    } else {
      reqStream.end();
    }

    // persistent outside of listeners
    let isSSE = false;
    let data = "";

    reqStream.setEncoding("utf8");

    reqStream.on("response", (headers, flags) => {
      // SSE will have 'stream' in the 'content-type' header
      isSSE =
        headers["content-type"] && headers["content-type"].includes("stream");

      if (isSSE) {
        reqResObj.connection = "open";
        reqResObj.connectionType = "SSE";
      } else {
        reqResObj.connection = "closed";
        reqResObj.connectionType = "plain";
      }

      // Setting response size based on Content-length. Check if response comes with content-length
      if (!headers["content-length"] && !headers["Content-Length"]) {
        reqResObj.responseSize = null;
      } else {
        let contentLength;
        headers["content-length"]
          ? (contentLength = "content-length")
          : (contentLength = "Content-Length");

        // Converting content length octets into bytes
        const conversionFigure = 1023.89427;
        const octetToByteConversion =
          headers[`${contentLength}`] / conversionFigure;
        const responseSize =
          Math.round((octetToByteConversion + Number.EPSILON) * 100) / 100;
        reqResObj.responseSize = responseSize;
      }

      // Content length is received in different letter cases. Whichever is returned will be used as the length for the calculation.

      reqResObj.isHTTP2 = true;
      reqResObj.timeReceived = Date.now();
      reqResObj.response.headers = headers;

      // if cookies exists, parse the cookie(s)
      if (headers["set-cookie"]) {
        const parsedCookies = setCookie.parse(headers["set-cookie"]);
        reqResObj.response.cookies = httpController.cookieFormatter(
          parsedCookies
        );
      }
      event.sender.send("reqResUpdate", reqResObj);
    });

    reqStream.on("data", (chunk) => {
      data += chunk;

      if (!isSSE) return;
      const chunkTimestamp = Date.now();
      const dataEventArr = data.match(/[\s\S]*\n\n/g);

      while (dataEventArr && dataEventArr.length) {
        const dataEvent = httpController.parseSSEFields(dataEventArr.shift());
        dataEvent.timeReceived = chunkTimestamp;
        reqResObj.response.events.push(dataEvent);
        event.sender.send("reqResUpdate", reqResObj);

        // recombine with \n\n to reconstruct original, minus what was already parsed.
        data = dataEventArr.join("\n\n");
      }
    });

    reqStream.on("end", () => {
      reqResObj.connection = "closed";
      delete httpController.openHTTP2Streams[reqResObj.id];

      let dataEvent;
      if (isSSE) {
        dataEvent = httpController.parseSSEFields(data);
        dataEvent.timeReceived = Date.now();
      } else if (
        data &&
        reqResObj.response.headers &&
        reqResObj.response.headers["content-type"] &&
        reqResObj.response.headers["content-type"].includes("application/json")
      ) {
        dataEvent = JSON.parse(data);
      } else {
        dataEvent = data;
      }
      reqResObj.response.events.push(dataEvent);
      event.sender.send("reqResUpdate", reqResObj);
    });
  },
  // ----------------------------------------------------------------------------

  makeFetch(args, event, reqResObj) {
    return new Promise((resolve) => {
      const { method, headers, body } = args.options;
      fetch2(headers.url, { method, headers, body })
        .then((response) => {
          const headers = response.headers.raw();

          // check if the endpoint sends SSE
          // add status code for regular http requests in the response header
          if (headers["content-type"][0].includes("stream")) {
            // invoke another func that fetches to SSE and reads stream
            // params: method, headers, body
            resolve({
              headers,
              body: { error: "This Is An SSE endpoint" },
            });
          }
          headers[":status"] = response.status;

          const receivedCookie = headers["set-cookie"];
          headers.cookies = receivedCookie;

          const contents = /json/.test(response.headers.get("content-type"))
            ? response.json()
            : response.text();
          contents
            .then((body) => {
              resolve({
                headers,
                body,
              });
            })
            .catch((error) =>
              console.log("ERROR from makeFetch contents", error)
            );
        })
        .catch((error) => {
          //error in connections
          reqResObj.connection = "error";
          reqResObj.error = error;
          // reqResObj.response.events.push(JSON.stringify(error));
          reqResObj.response.events.push(error);
          event.sender.send("reqResUpdate", reqResObj);
        });
    });
  },
  // ----------------------------------------------------------------------------

  establishHTTP1connection(event, reqResObj) {
    // initialize / clear response data and update front end
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = "pending";
    reqResObj.timeSent = Date.now();

    const options = this.parseFetchOptionsFromReqRes(reqResObj);

    //--------------------------------------------------------------------------------------------------------------
    // Check if the URL provided is a stream
    //--------------------------------------------------------------------------------------------------------------
    if (reqResObj.request.isSSE) {
      event.sender.send("reqResUpdate", reqResObj);
      // if so, send us over to SSEController
      SSEController.createStream(reqResObj, options, event);
      // if not SSE, talk to main to fetch data and receive
    } else {
      this.makeFetch({ options }, event, reqResObj)
        .then((response) => {
          // Parse response headers now to decide if SSE or not.
          const heads = response.headers;
          reqResObj.response.headers = heads;
          reqResObj.connection = "closed";
          reqResObj.timeReceived = Date.now();
          reqResObj.response.status = heads[":status"];
          // send back reqResObj to renderer so it can update the redux store

          const theResponseHeaders = response.headers;

          const { body } = response;
          reqResObj.response.headers = theResponseHeaders;

          // if cookies exists, parse the cookie(s)
          if (setCookie.parse(theResponseHeaders.cookies)) {
            reqResObj.response.cookies = this.cookieFormatter(
              setCookie.parse(theResponseHeaders.cookies)
            );
          }
          // update reqres object to include new event
          reqResObj = this.addSingleEvent(body, reqResObj);
          // check if there is a test script to run
          if (reqResObj.request.testContent) {
            reqResObj.response.testResult = testingController.runTest(
              reqResObj.request.testContent,
              reqResObj
            );
          }
          // send back reqResObj to renderer so it can update the redux store
          event.sender.send("reqResUpdate", reqResObj);
        })
        .catch((err) => {
          reqResObj.connection = "error";
          // send back reqResObj to renderer so it can update the redux store
          event.sender.send("reqResUpdate", reqResObj);
        });
    }
  },

  // ----------------------------------------------------------------------------

  parseFetchOptionsFromReqRes(reqResObject) {
    const { headers, body, cookies } = reqResObject.request;
    let { method } = reqResObject.request;

    method = method.toUpperCase();

    const formattedHeaders = {
      url: reqResObject.url,
    };
    headers.forEach((head) => {
      if (head.active) {
        formattedHeaders[head.key] = head.value;
      }
    });

    cookies.forEach((cookie) => {
      const cookieString = `${cookie.key}=${cookie.value}`;
      // attach to formattedHeaders so options object includes this
      formattedHeaders.cookie = cookieString;
    });

    const outputObj = {
      method,
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      headers: formattedHeaders,
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
    };

    if (method !== "GET" && method !== "HEAD") {
      outputObj.body = body;
    }

    return outputObj;
  },

  // ----------------------------------------------------------------------------

  addSingleEvent(event, reqResObj) {
    // adds new event to reqResObj and returns it so obj can be sent back to renderer process
    reqResObj.timeReceived = Date.now();
    reqResObj.response.events.push(event);
    reqResObj.connectionType = "plain";
    // returns updated reqResObj
    return reqResObj;
  },

  cookieFormatter(cookieArray) {
    return cookieArray.map((eachCookie) => {
      const cookieFormat = {
        name: eachCookie.name,
        value: eachCookie.value,
        domain: eachCookie.domain,
        hostOnly: eachCookie.hostOnly ? eachCookie.hostOnly : false,
        path: eachCookie.path,
        secure: eachCookie.secure ? eachCookie.secure : false,
        httpOnly: eachCookie.httpOnly ? eachCookie.httpOnly : false,
        session: eachCookie.session ? eachCookie.session : false,
        expirationDate: eachCookie.expires ? eachCookie.expires : "",
      };
      return cookieFormat;
    });
  },

  // parses SSE format into an object
  // SSE format -> 'key1: value1\nkey2: value2\nkey3: value3\n\n
  // this separates fields by new lines and separates values from keys by removing the colon and the space
  parseSSEFields(rawString) {
    return rawString
      .slice(0, -2)
      .split("\n")
      .reduce((obj, field) => {
        const [key, value] = field.split(": ");
        obj[key] = value;
        return obj;
      }, {});
  },
};

module.exports = () => {
  // creating our event listeners for IPC events
  ipcMain.on("open-http", (event, reqResObj) => {
    // we pass the event object into these controller functions so that we can invoke event.sender.send when we need to make response to renderer process
    httpController.openHTTPconnection(event, reqResObj);
  });

  ipcMain.on("close-http", (event, reqResObj) => {
    httpController.closeHTTPconnection(event, reqResObj);
  });
};
