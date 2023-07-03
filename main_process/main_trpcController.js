const fetch = require('cross-fetch');
const setCookie = require('set-cookie-parser');
const { ipcMain } = require('electron');

const trpcController = {
  makeFetch: async function (event, reqRes, get, post) {
    try {
      reqRes.timeSent = Date.now();
      const cookies = [];
      const getHeaders = {};
      const postHeaders = {};
      const events = [];

      const reqArr = [get, post];
      const resArr = await Promise.all(
        reqArr.map((req) => {
          if (req) {
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
            return Promise.resolve(false);
          }
        })
      );
      reqRes.timeReceived = Date.now();
      resArr.forEach((res, index) => {
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
        resArr.map((res) => {
          return res ? res.json() : res;
        })
      );
      console.dir(resData, { depth: null });
      resData.forEach((res) => events.push(res));
      reqRes.response.cookies = cookies;
      reqRes.response.events = events;
      reqRes.response.headers = [getHeaders, postHeaders];
      reqRes.connection = 'closed';
      reqRes.connectionType = 'plain';
      event.sender.send('reqResUpdate', reqRes);
    } catch (error) {
      reqRes.connection = 'error';
      reqRes.error = error;
      reqRes.response.events.push(error);
      event.sender.send('reqResUpdate', reqRes);
    }
  },
  parseOptionForFetch(reqResObject, method, procedures) {
    function parseString(str) {
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
        return JSON.parse(str);
      }
    }
    const { headers, cookie } = reqResObject.request;

    const formattedHeaders = {};
    headers.forEach((head) => {
      if (head.active) {
        formattedHeaders[head.key] = head.value;
      }
    });
    if (cookie) {
      cookie.forEach((cookie) => {
        const cookieString = `${cookie.key}=${cookie.value}`;
        // attach to formattedHeaders so options object includes this

        formattedHeaders.cookie = formattedHeaders.cookie
          ? formattedHeaders.cookie + ';' + cookieString
          : cookieString;
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
    let url = '';
    const body = {};
    procedures.forEach((procedure, index) => {
      if (procedure.variable) {
        body[index] = parseString(procedure.variable);
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
  },

  openRequest: async function (event, reqRes) {
    // const reqRes = Object.assign({}, reqResOriginal);
    // reqRes.response = Object.assign({}, reqRes.response);
    const procedures = reqRes.request.procedures;
    const getReq = procedures.filter(
      (procedure) => procedure.method === 'QUERY'
    );
    const postReq = procedures.filter(
      (procedure) => procedure.method === 'MUTATE'
    );

    const getOption = getReq.length
      ? this.parseOptionForFetch(reqRes, 'GET', getReq)
      : false;
    const postOption = postReq.length
      ? this.parseOptionForFetch(reqRes, 'POST', postReq)
      : false;

    const updatedReqRes = await this.makeFetch(
      event,
      reqRes,
      getOption,
      postOption
    );
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
