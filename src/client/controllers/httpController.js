import * as store from '../store';
import * as actions from '../actions/actions';
const session = require('electron').remote.session;
const http2 = require('http2');

const httpController = {
  openHTTP2Connections: [],

  openHTTPconnection(reqResObj, connectionArray) {
    /*
     * TRY TO CONNECT AS HTTP2 FIRST IF HTTPS. If error, fallback to HTTP1.1 (WebAPI fetch)
     */
    if (reqResObj.protocol === 'https://' || reqResObj.protocol === 'http://') { //if ((/https:\/\//).test(reqResObj.url))
      // if ((/https:\/\//).test(reqResObj.url)) {
      console.log('HTTPS, TRYING HTTP2');
      httpController.establishHTTP2Connection(reqResObj, connectionArray);
    }
    else {
      // console.log('HTTP REQUEST, MOVING TO FETCH');
      httpController.establishHTTP1connection(reqResObj, connectionArray);
    }
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

    // console.log('path', reqResObj.path);
    // initiate request
    const reqStream = client.request(formattedHeaders, { endStream: false });
    // endStream false means we can continue to send more data, which we would for a body;

    // Send body depending on method;
    if (reqResObj.request.method !== 'GET' && reqResObj.request.method !== 'HEAD') {
      reqStream.end(reqResObj.request.body);
    }
    else {
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
      }
      else {
        reqResObj.connection = 'closed';
        reqResObj.connectionType = 'plain';
      }

      reqResObj.isHTTP2 = true;
      reqResObj.timeReceived = Date.now();
      reqResObj.response.headers = headers;
      reqResObj.response.events = [];

      // let sesh = session.defaultSession;
      let domain = reqResObj.host.split('//')
      domain.shift();
      domain = domain.join('').split('.').splice(-2).join('.').split(':')[0]
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
      }
      else {
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

    const parsedFetchOptions = this.parseFetchOptionsFromReqRes(reqResObj);
    parsedFetchOptions.signal = openConnectionObj.abort.signal;

    // fetch(reqResObj.url, parsedFetchOptions) <- Was the original fetch before we added proxy httpserver
   
   fetch('http://localhost:7000', parsedFetchOptions)//fetch to our local server
      .then((response) => {
        //Parse response headers now to decide if SSE or not.
        let theResponseBody;
        let theResponseHeaders;
        let deezNuts ;
        response.json() //we make our response more readable
        .then((result)=> {//the readale verson of our response is an object that looks like this: {headers:{*alloftheresponsheaders go here*}, body:{**api content here**}}
           deezNuts = result.headers._headers // deezNutz refers to our literal object of response headers
           theResponseBody = result.body // the ResponseBody is the literal readable object containing our api content
        })
        .then(()=>{  //Now that we have access to the full response headers for http we have bypassed cors and can use this data
          reqResObj.response.headers = deezNuts;
         
          console.log('deeeeezzznuuutsch',deezNuts['content-type'])
          let isStream;
          if (deezNuts['content-type'] && deezNuts['content-type'].includes('stream')) {
            isStream = true;
          } else {
            isStream = false;
          }
          let http1Sesh = session.defaultSession;
          let domain = reqResObj.host.split('//')
          domain.shift();
          domain = domain.join('').split('.').splice(-2).join('.').split(':')[0]
       

          http1Sesh.cookies.get({ domain: domain }, (err, cookies) => {
            if (cookies) {
              reqResObj.response.cookies = cookies;
              store.default.dispatch(actions.reqResUpdate(reqResObj))
              cookies.forEach((cookie) => {
                let url = '';
                url += cookie.secure ? 'https://' : 'http://';
                url += cookie.domain.charAt(0) === '.' ? 'www' : '';
                url += cookie.domain;
                url += cookie.path;
                console.log(cookies)
                http1Sesh.cookies.remove(url, cookie.name, (x) => console.log(x));
              })
            }
            //Below the headers and response api content are handled by swell and will be displayed. 
            //The handlesingeevent is functional
            //handleSSE is not fuctional. Likely because handleSSE is expecting an unreadable response as a param instead of passing it the readable content... which would require another fetch for raw unparsed response
            isStream ? this.handleSSE(response, reqResObj, deezNuts) : this.handleSingleEvent(theResponseBody, reqResObj, deezNuts);
          })
          

          
      })
      
    })
        .catch((err) => {
          reqResObj.connection = 'error';
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        }) 
  },

  parseFetchOptionsFromReqRes(reqResObject) {
    // let {
    //   request: { method },
    //   request: { headers },
    //   request: { body },
    //   request: { cookies },
    // } = reqResObject;
    let {method, headers, body, cookies} = reqResObject.request;
    
    method = method.toUpperCase();

    const formattedHeaders = {'url': reqResObject.url};
    headers.forEach((head) => {
      if (head.active) {
        formattedHeaders[head.key] = head.value;
      }
    });

    cookies.forEach(cookie => {
      let cookieString = `${cookie.key}=${cookie.value}`;
      document.cookie = cookieString;
    })

    const outputObj = {
      method,
      // mode: 'cors', // no-cors, cors, *same-origin
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
    console.log('Handling Single Event')
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
        }
        else {
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
          }
          else {
            acc[key] = cur[key];
          }
          return acc;
        }, {})
    );
  },
};

export default httpController;
