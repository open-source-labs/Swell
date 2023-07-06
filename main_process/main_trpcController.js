const fetch = require('cross-fetch');
const setCookie = require('set-cookie-parser');
const { ipcMain } = require('electron');

const trpcController = {
  makeFetch: async function (event, reqRes, get, post) {
    try {
      // wrap it in a try catch block so if anything goes wrong we can just send the error  to the front end instead of having no response
      reqRes.timeSent = Date.now();
      //these will contain data about the response that we will get back from our get/post request
      const cookies = [];
      const getHeaders = {};
      const postHeaders = {};
      const events = [];

      const reqArr = [get, post]; // our array of request, put into an array in order to use promise.all easier
      const resArr = await Promise.all(
        reqArr.map((req) => {
          if (req) {
            // only make a request if it exists
            return fetch(req.url, {
              // credentials: req.credentials,
              // mode: req.mode,
              cache: req.cache,
              headers: req.headers,
              method: req.method,
              redirect: req.redirect,
              referrer: req.referrer,
              ...(req.body && { body: JSON.stringify(req.body) }),
            });
          } else {
            return Promise.resolve(false); //if it doesnt exist we can simply return false
          }
        })
      );
      reqRes.timeReceived = Date.now();
      resArr.forEach((res, index) => {
        // here we will combine cookies recieved from both request into one array, however we will seperate out the header by post/get request
        // was sleep-deprived should have also seperate cookie into get/post cookie
        if (res) {
          const headersResponse = res.headers.raw();
          if (headersResponse['set-cookie']) {
            cookies.push(
              ...this.cookieFormatter(
                setCookie.parse(headersResponse['set-cookie'])
              )
            );
          }
          if (index === 0) {
            res.headers.forEach((value, key) => {
              getHeaders[key] = value;
            });
          } else {
            res.headers.forEach((value, key) => {
              postHeaders[key] = value;
            });
          }
        }
      });

      const resData = await Promise.all(
        //if there was a response we will parse it if not we will just return it (which is just the value of false)
        resArr.map((res) => {
          return res ? res.json() : res;
        })
      );
      //attach meta data about the response onto the reqRes object to send back to front end
      resData.forEach((res) => events.push(res));
      reqRes.response.cookies = cookies;
      reqRes.response.events = events;
      reqRes.response.headers = [getHeaders, postHeaders];
      reqRes.connection = 'closed';
      reqRes.connectionType = 'plain';
      event.sender.send('reqResUpdate', reqRes); //send object back to front end
    } catch (error) {
      //if error we will push the error into event to be display
      reqRes.connection = 'error';
      reqRes.error = error;
      reqRes.response.events.push(error);
      event.sender.send('reqResUpdate', reqRes); // send updated object back to front end
    }
  },
  parseOptionForFetch(reqResObject, method, procedures) {
    // this method using the data attach to the response property to construct an object that we could use to easily make the neccessary request
    function parseString(str) {
      //this function is use to parse user inputted argument from json into javascript
      if (str === 'true') {
        return true;
      }

      if (str === 'false') {
        return false;
      }

      if (!isNaN(str)) {
        return parseFloat(str);
      }

      try {
        const parsedJson = JSON.parse(str.replace(/\s/g, ''));

        if (typeof parsedJson === 'object' && parsedJson !== null) {
          return parsedJson;
        } else {
          throw 'is String';
        }
      } catch (error) {
        if (error === 'is String') {
          return JSON.parse(str);
        } else {
          return { error };
        }
      }
    }
    try {
      const { headers, cookie } = reqResObject.request; //grab the headers and cookie inputted by user

      const formattedHeaders = {}; //header object
      headers.forEach((head) => {
        if (head.active) {
          formattedHeaders[head.key] = head.value;
        }
      });
      if (cookie) {
        //parses cookie data to attach to option object
        cookie.forEach((cookie) => {
          const cookieString = `${cookie.key}=${cookie.value}`;
          // attach to formattedHeaders so options object includes this
          formattedHeaders.cookie = formattedHeaders.cookie
            ? formattedHeaders.cookie + ';' + cookieString
            : cookieString;
        });
      }

      const outputObj = {
        // the main object that will get returned
        method,
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: formattedHeaders,
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
      };
      // here we will construct the url and the body using data inside the reqRes obj
      // because a user could batch procedures together/ we need to account for the request object to contain data for both a get request and a post request
      let url = '';
      const body = {};
      procedures.forEach((procedure, index) => {
        if (procedure.variable) {
          body[index] = parseString(procedure.variable);
          if (body[index].error) {
            throw "Invalid variable input: Please check all procedure's input to be in json string format";
          }
        } else {
          body[index] = {};
        }
        url = url ? url + ',' + procedure.endpoint : procedure.endpoint;
      });
      if (method === 'POST') {
        url = reqResObject.url + '/' + url + '?batch=1';
        outputObj.body = body;
      } else {
        url =
          reqResObject.url +
          '/' +
          url +
          '?batch=1' +
          `&input=${encodeURIComponent(JSON.stringify(body))}`;
      }
      outputObj.url = url;

      return outputObj;
    } catch (error) {
      return { error };
    }
  },

  openRequest: async function (event, reqRes) {
    const procedures = reqRes.request.procedures; // grabbing all of the procedures out of the reqRes object

    //filter the procedures into either query or mutate in order to make the appropriate http request for each procedure
    // all query procedure will be made with a get request
    // all mutation procedure will be made with a post request
    try {
      const getReq = procedures.filter(
        (procedure) => procedure.method === 'QUERY'
      );
      const postReq = procedures.filter(
        (procedure) => procedure.method === 'MUTATE'
      );

      // parsing data from the reqRes object to construct either a get/post option object that contains everything we need to make our get/post http request
      const getOption = getReq.length
        ? this.parseOptionForFetch(reqRes, 'GET', getReq)
        : false;
      const postOption = postReq.length
        ? this.parseOptionForFetch(reqRes, 'POST', postReq)
        : false;
      if (getOption.error || postOption.error) {
        throw getOption.error ? getOption.error : postOption.error;
      } else {
        this.makeFetch(event, reqRes, getOption, postOption); // where we will finally make the request inside of makeFetch
      }
    } catch (error) {
      //if error we will push the error into event to be display
      reqRes.connection = 'error';
      reqRes.error = error;
      reqRes.response.events.push(error);
      event.sender.send('reqResUpdate', reqRes); // send updated object back to front end
    }
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
};

module.exports = () => {
  // create event listeners for IPC events
  ipcMain.on('open-trpc', (event, reqResObj) => {
    trpcController.openRequest(event, reqResObj);
  });
};

