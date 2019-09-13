import * as store from '../store';
import * as actions from '../actions/actions';

const fetch2 = require('node-fetch');
const { session } = require('electron').remote;
const http2 = require('http2');

const { ipcRenderer } = require('electron')


const httpController = {
  openHTTP2Connections: [],

  openHTTPconnection(reqResObj, connectionArray) {
    /*
     * TRY TO CONNECT AS HTTP2 FIRST IF HTTPS. If error, fallback to HTTP1.1 (WebAPI fetch)
     */
    // if (reqResObj.protocol === 'https://' || reqResObj.protocol === 'http://') {
    //   console.log('HTTPS, TRYING HTTP2');
      httpController.establishHTTP2Connection(reqResObj, connectionArray);
    // } 
    // else {
    //   console.log('HTTP REQUEST, MOVING TO FETCH');
    //   httpController.establishHTTP1connection(reqResObj, connectionArray);
    // }
  },

  establishHTTP2Connection(reqResObj, connectionArray) {
    /*
      Attempt to find an existing HTTP2 connection in openHTTP2Connections Array.
      If exists, use connection to initiate request
      If not, create connection, push to array, and then initiate request
    */

    const foundHTTP2Connection = httpController.openHTTP2Connections.find(
      conn => conn.host === reqResObj.host,
    );

    // existing HTTP2 connection is found, attach a request to it.
    if (foundHTTP2Connection) {
      const { client } = foundHTTP2Connection;

      // periodically check if the client is open or destroyed, and attach if conditions are met
      const interval = setInterval(() => {
        if (foundHTTP2Connection.status === 'connected') {
          console.log('Existing HTTP2 Conn:', reqResObj.host);
          this.attachRequestToHTTP2Client(client, reqResObj, connectionArray);
          clearInterval(interval);
        }
        // if failed, could because of protocol error. try HTTP1
        else if (foundHTTP2Connection.status === 'failed' || client.destroyed) {
          httpController.establishHTTP1connection(reqResObj, connectionArray);
          clearInterval(interval);
        }
      }, 50);
      // if hasnt changed in 10 seconds, mark as error
      setTimeout(() => {
        clearInterval(interval);
        if (foundHTTP2Connection.status === 'initialized') {
          reqResObj.connection = 'error';
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        }
      }, 10000);
    }

    // no existing HTTP2 connection, make it before attaching request.
    else {
      console.log('New HTTP2 Conn:', reqResObj.host);

      const id = Math.random() * 100000;
      const client = http2.connect(reqResObj.host);

      // push HTTP2 connection to array
      const http2Connection = {
        client,
        id,
        host: reqResObj.host,
        status: 'initialized',
      };
      httpController.openHTTP2Connections.push(http2Connection);

      client.on('error', (err) => {
        console.error('HTTP2 FAILED...trying HTTP1\n', err);
        http2Connection.status = 'failed';
        client.destroy();

        // if it exists in the openHTTP2Connections array, remove it
        httpController.openHTTP2Connections = httpController.openHTTP2Connections.filter(
          conn => conn.id !== id,
        );

        // need to filter connectionArray for existing connObj as a nonfunctioning
        // one may have been pushed in establishHTTP2connection...
        // can't actually use filter though due to object renaming
        connectionArray.forEach((obj, i) => {
          if (obj.id === reqResObj.id) {
            connectionArray.splice(i, 1);
          }
        });

        // try again with fetch (HTTP1);
        httpController.establishHTTP1connection(reqResObj, connectionArray);
      });

      client.on('connect', () => {
        http2Connection.status = 'connected';

        // attach request
        this.attachRequestToHTTP2Client(client, reqResObj, connectionArray);
      });
    }
  },

  attachRequestToHTTP2Client(client, reqResObj, connectionArray) {
    // start off by clearing existing response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    const formattedHeaders = {};
    reqResObj.request.headers.forEach((head) => {
      formattedHeaders[head.key] = head.value;
    });
    formattedHeaders[':path'] = reqResObj.path;

    // initiate request
    const reqStream = client.request(formattedHeaders, { endStream: false });
    // endStream false means we can continue to send more data, which we would for a body;

    // Send body depending on method;
    if (reqResObj.request.method !== 'GET' && reqResObj.request.method !== 'HEAD') {
      reqStream.end(reqResObj.request.body);
    } else {
      reqStream.end();
    }

    const openConnectionObj = {
      stream: reqStream,
      protocol: 'HTTP2',
      id: reqResObj.id,
    };

    connectionArray.push(openConnectionObj);

    let isSSE;

    reqStream.on('response', (headers, flags) => {
      isSSE = headers['content-type'].includes('stream');

      if (isSSE) {
        reqResObj.connection = 'open';
        reqResObj.connectionType = 'SSE';
      } else {
        reqResObj.connection = 'closed';
        reqResObj.connectionType = 'plain';
      }

      reqResObj.isHTTP2 = true;
      reqResObj.timeReceived = Date.now();
      reqResObj.response.headers = headers;
      reqResObj.response.events = [];

      // let sesh = session.defaultSession;
      let domain = reqResObj.host.split('//');
      domain.shift();
      domain = domain.join('').split('.').splice(-2).join('.')
        .split(':')[0];
      store.default.dispatch(actions.reqResUpdate(reqResObj));
    });

    reqStream.setEncoding('utf8');
    let data = '';
    reqStream.on('data', (chunk) => {
      data += chunk;
      if (isSSE) {
        let couldBeEvents = true;
        const wouldBeTimeReceived = Date.now();

        while (couldBeEvents) {
          const possibleEventArr = data.match(/[\s\S]*\n\n/g);

          // if the array has a match, send it to be parsed, and send back to store
          if (possibleEventArr && possibleEventArr[0]) {
            const receivedEventFields = httpController.parseSSEFields(possibleEventArr[0]);
            receivedEventFields.timeReceived = wouldBeTimeReceived;

            reqResObj.response.events.push(receivedEventFields);
            store.default.dispatch(actions.reqResUpdate(reqResObj));

            // splice possibleEventArr, recombine with \n\n to reconstruct original,
            // minus what was already parsed.
            possibleEventArr.splice(0, 1);
            data = possibleEventArr.join('\n\n');
          }
          // if does not contain, end while loop
          else {
            couldBeEvents = false;
          }
        }
      }
    });
    reqStream.on('end', () => {
      if (isSSE) {
        const receivedEventFields = this.parseSSEFields(data);
        receivedEventFields.timeReceived = Date.now();
        reqResObj.connection = 'closed';
        reqResObj.response.events.push(receivedEventFields);
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      } else {
        reqResObj.connection = 'closed';
        reqResObj.response.events.push(data);
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      }
    });
  },

  establishHTTP1connection(reqResObj, connectionArray) {
    // start off by clearing existing response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));
    connectionArray.forEach((obj, i) => {
      if (obj.id === reqResObj.id) {
        connectionArray.splice(i, 1);
      }
    });
    const openConnectionObj = {
      abort: new AbortController(),
      protocol: 'HTTP1',
      id: reqResObj.id,
    };
    connectionArray.push(openConnectionObj);

    const options = this.parseFetchOptionsFromReqRes(reqResObj);
    options.signal = openConnectionObj.abort.signal;

    //! BETTER APPROACH?
    // fetch2(reqResObj.url, options)
    //   .then(response => response.json())
    //   .then(result => console.log('THIS IS THE RESULT DIRECTLY FROM NODE-FETCH', result))

    // fetch(reqResObj.url, options)
    //   .then(response => response.json())
    //   .then(result => console.log('THIS IS THE RESULT DIRECTLY FROM normal FETCH', result))
    //--------------------------------------------------------------------------------------------------------------
    // Check if the URL provided is a stream
    //--------------------------------------------------------------------------------------------------------------

    function sendToMainForFetch(args) {
      console.log('before fetch')
      return new Promise (resolve => {
        ipcRenderer.send('asynchronous-message', args)
        ipcRenderer.on('asynchronous-reply', (event, result) => {
          resolve(result);
        })
      })
    }
    console.log('OPTIONS', options)
    sendToMainForFetch({reqResObj, options})
      // .then((result) => {
      // console.log('result 2nd fetch:', result);
      // })
    
    // fetch(reqResObj.url, options)// fetch straight to provided url
      .then((response) => {
        console.log('response from 1st Fetch', response);
        console.log('response from 1st Fetch - RES.HEADERS', response.headers);
      
        // Parse response headers now to decide if SSE or not.
        const heads = response.headers;

        console.log('headers entries:', response.headers['content-type']);

        // for (const entry of response.headers) {
        //   console.log('entry', entry);
        //   console.log('entry[0]',entry[0].toLowerCase());
        //   console.log('entry[1]', entry[1]);
        //   heads[entry[0].toLowerCase()] = entry[1];
        // }

        reqResObj.response.headers = heads;
        // console.log('HEADS', heads);
        console.log('HEADS!!!', heads);
        // store extracted headers in heads object
        // check if the content-type header contains the word stream
        let isStream = false;

        if (heads['content-type'] && heads['content-type'].includes('stream')) isStream = true;

        if (isStream) { // if url is sse...
          const http1Sesh = session.defaultSession;
          let domain = reqResObj.host.split('//');
          domain.shift();
          [domain] = domain.join('').split('.').splice(-2).join('.')
            .split(':');

          http1Sesh.cookies.get({ domain }, (err, cookies) => {
            if (cookies) {
              reqResObj.response.cookies = cookies;
              store.default.dispatch(actions.reqResUpdate(reqResObj));
              cookies.forEach((cook) => {
                let url = '';
                url += cook.secure ? 'https://' : 'http://';
                url += cook.domain.charAt(0) === '.' ? 'www' : '';
                url += cook.domain;
                url += cook.path;

                http1Sesh.cookies.remove(url, cook.name, x => console.log(x));
              });
            }
            this.handleSSE(response, reqResObj, heads);
          });
          console.log('SERVED')
        } 
        
        else { // if url is not not sse ...
          
          reqResObj.timeSent = Date.now();
          store.default.dispatch(actions.reqResUpdate(reqResObj));

          
          // fetch2(reqResObj.url, options)// fetch to OUR local proxy server before fetching to url provided
          
          // function sendToMainForFetch(args) {
          //   console.log('before 2nd fetch')
          //   return new Promise (resolve => {
          //     ipcRenderer.send('asynchronous-message', args)
          //     ipcRenderer.on('asynchronous-reply', (event, result) => {
          //       resolve(result);
          //     })
          //   })
          // }

        // console.log(sendToMainForFetch({reqResObj, options}))
        //  sendToMainForFetch({reqResObj, options})
            // .then(response => {
            //   console.log('2nd fetch request', response);
            //   response.json()}
            //   )
            // .then((result) => {
              // console.log('result 2nd fetch:', result);
              // // the readable version of our response is an object that looks like this:
              // // {headers:{**response headers go here**}, body:{**api content here**}, rawResponse:{**object with data about response**} }
              // // theResponseHeaders refers to our literal object of response headers
              // // the ResponseBody is the literal readable object containing our api content
              // // the raw unparsed response from localhost:7000
              // console.log('RESULT', result);
              // console.log('RESULT.HEADERS', result.headers);
              const theResponseHeaders = response.headers;
              console.log('theResponseHeaders',theResponseHeaders);
              const { body } = response;
              // Now that we have got to the full response headers for http from localhost:7000 we have bypassed cors and can use this data
              reqResObj.response.headers = theResponseHeaders;

              const http1Sesh = session.defaultSession;
              let domain = reqResObj.host.split('//');
              domain.shift();
              [domain] = domain.join('').split('.').splice(-2).join('.')
                .split(':');

              http1Sesh.cookies.get({ domain }, (err, cookies) => {
                if (cookies) {
                  reqResObj.response.cookies = cookies;
                  store.default.dispatch(actions.reqResUpdate(reqResObj));
                  cookies.forEach((cookie) => {
                    let url = '';
                    url += cookie.secure ? 'https://' : 'http://';
                    url += cookie.domain.charAt(0) === '.' ? 'www' : '';
                    url += cookie.domain;
                    url += cookie.path;
                    http1Sesh.cookies.remove(url, cookie.name, x => console.log(x));
                  });
                }
                // Below the headers and response api content are handled by swell and will be displayed.
                this.handleSingleEvent(body, reqResObj, theResponseHeaders);
              });
            // })
            // .catch((err) => {
            //   reqResObj.connection = 'error';
            //   store.default.dispatch(actions.reqResUpdate(reqResObj));
            // });
        }
      })
      .catch((err) => {
        reqResObj.connection = 'error';
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      });
  },

  parseFetchOptionsFromReqRes(reqResObject) {
    let {
      method, headers, body, cookies
    } = reqResObject.request;

    method = method.toUpperCase();

    const formattedHeaders = { url: reqResObject.url };
    headers.forEach((head) => {
      if (head.active) {
        formattedHeaders[head.key] = head.value;
      }
    });

    cookies.forEach((cookie) => {
      const cookieString = `${cookie.key}=${cookie.value}`;
      document.cookie = cookieString;
    });

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

  handleSingleEvent(response, originalObj, headers) {
    const newObj = JSON.parse(JSON.stringify(originalObj));
    newObj.connection = 'closed';
    newObj.connectionType = 'plain';
    newObj.timeReceived = Date.now();
    newObj.response.events.push(response);
    store.default.dispatch(actions.reqResUpdate(newObj));
  },

  /* handle SSE Streams for HTTP1.1 */
  handleSSE(response, originalObj, headers) {
    const reader = response.body.getReader();

    let data = '';
    read();

    const newObj = JSON.parse(JSON.stringify(originalObj));

    // okay to set these after the read since read is async
    newObj.timeReceived = Date.now();
    newObj.response.headers = headers;
    newObj.response.events = [];
    newObj.connection = 'open';
    newObj.connectionType = 'SSE';

    const decoder = new TextDecoder('utf-8');
    function read() {
      reader.read().then((obj) => {
        // check if there is new info to add to data
        if (decoder.decode(obj.value) !== '') {
          data += decoder.decode(obj.value);
        }

        // check if there are double new lines to parse...
        let couldBeEvents = true;
        const wouldBeTimeReceived = Date.now();
        while (couldBeEvents) {
          const possibleEventArr = data.split(/\n\n/g);

          // if the array has a match, send it to be parsed, and send back to store
          if (possibleEventArr && possibleEventArr[0]) {
            const receivedEventFields = httpController.parseSSEFields(possibleEventArr[0]);
            receivedEventFields.timeReceived = wouldBeTimeReceived;

            newObj.response.events.push(receivedEventFields);
            store.default.dispatch(actions.reqResUpdate(newObj));

            // splice possibleEventArr, recombine with \n\n to reconstruct original,
            // minus what was already parsed.
            possibleEventArr.splice(0, 1);
            data = possibleEventArr.join('\n\n');
          }
          // if does not contain, end while loop
          else {
            couldBeEvents = false;
          }
        }

        // base case
        if (obj.done) {
        } else {
          read();
        }
      });
    }
  },

  parseSSEFields(rawString) {
    return (
      rawString
        // since the string is multi line, each for a different field, split by line
        .split('\n')
        // remove empty lines
        .filter(field => field !== '')
        // massage fields so they can be parsed into JSON
        .map((field) => {
          const fieldColonSplit = field
            .replace(/:/, '&&&&')
            .split('&&&&')
            .map(kv => kv.trim());

          const fieldObj = {
            [fieldColonSplit[0]]: fieldColonSplit[1],
          };
          return fieldObj;
        })
        .reduce((acc, cur) => {
          // handles if there are multiple fields of the same type, for example two data fields.
          const key = Object.keys(cur)[0];
          if (acc[key]) {
            acc[key] = `${acc[key]}\n${cur[key]}`;
          } else {
            acc[key] = cur[key];
          }
          return acc;
        }, {})
    );
  },
};

export default httpController;
