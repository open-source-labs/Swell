const { ipcMain } = require('electron');
const fs = require('fs');
const fetch = require('cross-fetch');
const http2 = require('http2');
const setCookie = require('set-cookie-parser');
const SSEController = require('./SSEController');
const testingController = require('./main_testingController');

// Use this for HTTPS cert when in Dev or Test environment and
// using a server with self-signed cert on localhost
const LOCALHOST_CERT_PATH = 'test/HTTP2_cert.pem';

const httpController = {
  openHTTP2Connections: {},
  openHTTP2Streams: {},

  // opens HTTP connections
  openHTTPConnection(event, reqResObj) {
    // HTTP2 currently only on HTTPS
    reqResObj.protocol === 'https://'
      ? this.establishHTTP2Connection(event, reqResObj)
      : this.establishHTTP1Connection(event, reqResObj);
  },

  // closes HTTP connections
  closeHTTPConnection(event, reqResObj) {
    reqResObj.isHTTP2
      ? this.closeHTTP2Stream(event, reqResObj)
      : this.closeHTTP1Connection(event, reqResObj);
  },

  // if Server Sent Event (SSE), invokes SSEController to close connection
  closeHTTP1Connection(event, reqResObj) {
    if (reqResObj.request.isSSE) {
      SSEController.closeConnection(reqResObj.id);
    }
  },

  // if HTTP/2 stream is open, closes it
  closeHTTP2Stream(event, reqResObj) {
    const stream = this.openHTTP2Streams[reqResObj.id];
    if (stream) {
      stream.close();
      delete this.openHTTP2Streams[reqResObj.id];
    }
  },

  // establishes HTTP/2 connection
  establishHTTP2Connection(event, reqResObj) {
    const { host } = reqResObj;
    const foundHTTP2Connection = httpController.openHTTP2Connections[host];

    // if connection already exists, attach request to existing connection
    if (foundHTTP2Connection) {
      const { client } = foundHTTP2Connection;

      // periodically check connection
      const interval = setInterval(() => {
        if (client.destroyed || client.closed) {
          clearInterval(interval);
          delete httpController.openHTTP2Connections[host];
          httpController.openHTTPConnection(event, reqResObj);
        } else if (foundHTTP2Connection.status === 'failed') {
          clearInterval(interval);
          delete httpController.openHTTP2Connections[host];
          httpController.establishHTTP1Connection(event, reqResObj);
        } else if (foundHTTP2Connection.status === 'connected') {
          clearInterval(interval);
          httpController.attachRequestToHTTP2Client(client, event, reqResObj);
        }
      }, 50);

      // if no change in 10 seconds, destroy client and clean up memory, send as error to front-end
      setTimeout(() => {
        clearInterval(interval);
        if (foundHTTP2Connection.status === 'initialized') {
          client.destroy();
          delete httpController.openHTTP2Connections[host];
          reqResObj.connection = 'error';
          event.sender.send('reqResUpdate', reqResObj);
        }
      }, 10000);
      // if no pre-existing connection, create new connection
    } else {
      console.log('No pre-existing http/2 found');

      const clientOptions = {};
      // for self-signed certs on localhost in dev and test environments
      if (host.includes('localhost')) {
        clientOptions.ca = fs.readFileSync(LOCALHOST_CERT_PATH);
      }

      try {
        // create HTTP2 client
        const http2Client = http2.connect(host, clientOptions, () =>
          console.log('Connected! reqRes.Obj.host: ', host)
        );

        // save HTTP2 connection to open connection collection
        const http2Connection = {
          client: http2Client,
          status: 'initialized',
        };

        httpController.openHTTP2Connections[host] = http2Connection;

        // if connection fails, destroy http2Client, delete from openHTTP2Connections, and try again with fetch (HTTP1)
        http2Client.on('error', (err) => {
          console.log('HTTP2 FAILED...trying HTTP1\n', err);
          http2Connection.status = 'failed';
          console.log('http2Connection.status: ', http2Connection.status);
          try {
            http2Client.destroy();
            console.log('Destroyed http/2 client');
            delete httpController.openHTTP2Connections[host];
            console.log('Deleted http/2 connection from collection');
            httpController.establishHTTP1Connection(event, reqResObj);
          } catch (error) {
            console.log('Error destroying http/2 client', error);
          }
        });

        // if connection succeeds, attach request to client
        try {
          http2Client.on('connect', () => {
            http2Connection.status = 'connected';
            console.log('Connected successfully with http/2');
            this.attachRequestToHTTP2Client(http2Client, event, reqResObj);
            console.log('Attached request to http/2 client');
          });
        } catch (error) {
          console.log('Error attaching request to http/2 client: ', error);
        }
      } catch (error) {
        console.log('Error connecting with http/2: ', error);
        httpController.establishHTTP1Connection(event, reqResObj);
      }
    }
  },

  attachRequestToHTTP2Client(client, event, reqResObj) {
    const { request, response } = reqResObj;
    // initialize / clear response data and update front end
    response.headers = {};
    response.events = [];
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();

    // send updated reqResObj to renderer process
    event.sender.send('reqResUpdate', reqResObj);

    // format headers in chosen reqResObj so we can add them to our request
    const formattedHeaders = {};

    reqResObj.request.headers.forEach((header) => {
      formattedHeaders[header.key] = header.value;
    });

    formattedHeaders[':path'] = reqResObj.path;
    formattedHeaders[':method'] = reqResObj.request.method;

    // initiate request, do not immediately close the *writable* side of the http2 stream
    const reqStream = client.request(formattedHeaders, {
      endStream: false,
    });
    // save stream to collection for later access
    this.openHTTP2Streams[reqResObj.id] = reqStream;

    // close the writable side of our stream
    request.method !== 'GET' && request.method !== 'HEAD'
      ? reqStream.end(request.body)
      : reqStream.end();

    // persists outside of listeners
    let isSSE = false;
    let data = '';

    reqStream.setEncoding('utf8');

    // handle response received from HTTP2 server
    reqStream.on('response', (headers, flags) => {
      // if SSE, headers will have content-type: 'stream'
      isSSE =
        headers['content-type'] && headers['content-type'].includes('stream');

      if (isSSE) {
        reqResObj.connection = 'open';
        reqResObj.connectionType = 'SSE';
      } else {
        reqResObj.connection = 'closed';
        reqResObj.connectionType = 'plain';
      }

      // FIXME: There is something wrong with the logic below.
      // First, it is checking if the headers have a 'content-length'
      // or 'Content-Length' property. If it does not, it sets the
      // responseSize to null. It it does, it checks if the headers have
      // a 'content-length' property. If it does, it sets the contentLength
      // to 'content-length' or 'Content-Length'. This does not make sense.
      // I think it should be setting contentLength to headers['content-length']
      // or headers['Content-Length'].

      // check if response comes with 'content-length' header
      if (!headers['content-length'] && !headers['Content-Length']) {
        response.responseSize = null;
      } else {
        let contentLength;
        headers['content-length']
          ? (contentLength = 'content-length')
          : (contentLength = 'Content-Length');

        // FIXME: A previous group used a conversion figure of 1023.89427 to
        // convert octets to bytes. This is incorrect because both an octet
        // and byte are exactly 8 bits in modern computing. There could, however,
        // be some ambiguity because "bytes" may have a different meaning in legacy
        // systems. Check out this link for more info: https://en.wikipedia.org/wiki/Octet_(computing).
        // If the desired responseSize is in bytes, it is enough to simply assign the value
        // of the content-length header.

        // Converting content length octets into bytes
        const conversionFigure = 1023.89427;
        const octetToByteConversion =
          headers[`${contentLength}`] / conversionFigure;
        response.responseSize =
          Math.round((octetToByteConversion + Number.EPSILON) * 100) / 100;
      }

      // content length is received in different letter cases. Whichever is returned will be used as the length for the calculation.
      reqResObj.isHTTP2 = true;
      reqResObj.timeReceived = Date.now();
      response.headers = headers;
      response.status = headers[':status'];

      // if cookie exists, parse the cookie(s)
      if (headers['set-cookie']) {
        const parsedCookies = setCookie.parse(headers['set-cookie']);
        response.cookies = httpController.cookieFormatter(parsedCookies);
      }
      // send updated reqResObj to renderer process
      event.sender.send('reqResUpdate', reqResObj);
    });

    // handle the 'data' event for the HTTP/2 request stream
    reqStream.on('data', (chunk) => {
      data += chunk;

      if (!isSSE) return;

      const chunkTimestamp = Date.now();

      // split the data into an array of SSE events using regex
      const dataEventArr = data.match(/[\s\S]*\n\n/g);

      // loop over each SSE event in the array and parse it into an object
      while (dataEventArr && dataEventArr.length) {
        const dataEvent = httpController.parseSSEFields(dataEventArr.shift());

        dataEvent.timeReceived = chunkTimestamp;
        reqResObj.response.events.push(dataEvent);

        // send updated reqResObj to renderer process before next iteration
        event.sender.send('reqResUpdate', reqResObj);

        data = dataEventArr.join('\n\n');
      }
    });

    // handle the 'end' event for the HTTP/2 request stream
    reqStream.on('end', () => {
      reqResObj.connection = 'closed';
      delete httpController.openHTTP2Streams[reqResObj.id];

      let dataEvent;

      if (isSSE) {
        dataEvent = httpController.parseSSEFields(data);
        dataEvent.timeReceived = Date.now();
      } else if (
        data &&
        reqResObj.response.headers['content-type'].includes('application/json')
      ) {
        dataEvent = JSON.parse(data);
      } else {
        dataEvent = data;
      }

      reqResObj.response.events.push(dataEvent);


      console.log('this is reqresobj respons right beforetest', reqResObj.response);
      // check if there is a test script to run
      if (reqResObj.request.testContent) {
         reqResObj.response.testResult = testingController.runTest(
           reqResObj.request.testContent,
           reqResObj
         );
      }

      event.sender.send('reqResUpdate', reqResObj);
    });
  },

  // makes the actual HTTP request
  makeFetch: async (args, event, reqResObj) => {
    try {
      const { method, headers, body } = args.options;
      const response = await fetch(headers.url, { method, headers, body });
      const headersResponse = response.headers.raw();
      if (headersResponse['content-type'][0].includes('stream')) {
        return {
          headers: headersResponse,
          body: { error: 'This Is An SSE endpoint' },
        };
      }

      headersResponse[':status'] = response.status;
      const receivedCookie = headersResponse['set-cookie'];
      headersResponse.cookies = receivedCookie;

      const contentType = response.headers.get('content-type');
      const contents = /json/.test(contentType)
        ? await response.json()
        : await response.text();

      return {
        headers: headersResponse,
        body: contents,
      };
    } catch (error) {
      reqResObj.connection = 'error';
      reqResObj.error = error;
      reqResObj.response.events.push(error);
      event.sender.send('reqResUpdate', reqResObj);
      throw error;
    }
  },

  // establishes a standard HTTP/1.1 connection
  establishHTTP1Connection: async function (event, reqResObj) {
    // initialize / clear response data and update front end
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();

    const options = this.parseFetchOptionsFromReqRes(reqResObj);
    //-----------------------------------------
    // Check if the URL provided is a stream
    //-----------------------------------------
    if (reqResObj.request.isSSE) {
      event.sender.send('reqResUpdate', reqResObj);
      // if so, send us over to SSEController
      SSEController.createStream(reqResObj, options, event);
    } else {
      try {
        const response = await this.makeFetch({ options }, event, reqResObj);

        const heads = response.headers;
        reqResObj.response.headers = heads;
        reqResObj.connection = 'closed';
        reqResObj.timeReceived = Date.now();
        reqResObj.response.status = heads[':status'];

        const theResponseHeaders = response.headers;

        const { body } = response;
        reqResObj.response.headers = theResponseHeaders;

        // if cookies exists, parse the cookie(s)
        if (setCookie.parse(theResponseHeaders.cookies)) {
          reqResObj.response.cookies = this.cookieFormatter(
            setCookie.parse(theResponseHeaders.cookies)
          );
        }

        // update reqResObj to include new event
        reqResObj = this.addSingleEvent(body, reqResObj);

        // check if there is a test script to run
        if (reqResObj.request.testContent) {
          reqResObj.response.testResult = testingController.runTest(
            reqResObj.request.testContent,
            reqResObj
          );
        }

        // send back reqResObj to renderer so it can update the redux store
        event.sender.send('reqResUpdate', reqResObj);
      } catch (err) {
        reqResObj.connection = 'error';
        // send back reqResObj to renderer so it can update the redux store
        event.sender.send('reqResUpdate', reqResObj);
      }
    }
  },

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

    if (cookies) {
      cookies.forEach((cookie) => {
        const cookieString = `${cookie.key}=${cookie.value}`;
        // attach to formattedHeaders so options object includes this
        formattedHeaders.cookie = formattedHeaders.cookie + ';' + cookieString;
      });
    }

    const outputObj = {
      method,
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: formattedHeaders,
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
    };

    if (method !== 'GET' && method !== 'HEAD') {
      outputObj.body = body;
    }

    return outputObj;
  },

  addSingleEvent(event, reqResObj) {
    // adds new event to reqResObj and returns it so obj can be sent back to renderer process
    reqResObj.timeReceived = Date.now();
    reqResObj.response.events.push(event);
    reqResObj.connectionType = 'plain';
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
        expirationDate: eachCookie.expires ? eachCookie.expires : '',
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
      .split('\n')
      .reduce((obj, field) => {
        const [key, value] = field.split(': ');
        obj[key] = value;
        return obj;
      }, {});
  },
};

module.exports = () => {
  // create event listeners for IPC events
  ipcMain.on('open-http', (event, reqResObj) => {
    httpController.openHTTPConnection(event, reqResObj);
  });

  ipcMain.on('close-http', (event, reqResObj) => {
    httpController.closeHTTPConnection(event, reqResObj);
  });
};
