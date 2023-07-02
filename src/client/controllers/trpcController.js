const { api } = window;
import { appDispatch } from '../toolkit-refactor/store';
import Store from '../toolkit-refactor/store';
import {
  responseDataSaved,
  reqResUpdated,
} from '../toolkit-refactor/slices/reqResSlice';
import { graphUpdated } from '../toolkit-refactor/slices/graphPointsSlice';
const trpcController = {
  makeFetch: async function (reqRes, get, post) {
    reqRes.timeSent = Date.now();
    //[{name:"cookie"}]
    const cookies = [
      { name: 'POSTCOOKIE', value: 'POSTCOOKIEVAL' },
      { name: 'GETCOOKIE', value: 'GETCOOKIEVAL' },
    ];
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
        if (index === 0) {
          //combine cookie

          //comebine header
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
    resData.forEach((res) => events.push(res));
    reqRes.response.cookies = cookies;
    reqRes.response.events = events;
    reqRes.response.headers = [getHeaders, postHeaders];
    reqRes.connection = 'closed';
    reqRes.connectionType = 'plain';
    this.testReq(reqRes);
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

  sendRequest: async function (reqResOriginal) {
    const reqRes = Object.assign({}, reqResOriginal);
    reqRes.response = Object.assign({}, reqRes.response);
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

    const updatedReqRes = await this.makeFetch(reqRes, getOption, postOption);
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
  testReq: (reqResObj) => {
    if (
      (reqResObj.connection === 'closed' || reqResObj.connection === 'error') &&
      reqResObj.timeSent &&
      reqResObj.timeReceived &&
      reqResObj.response.events &&
      reqResObj.response.events.length > 0 &&
      !reqResObj.trpc
    ) {
      appDispatch(graphUpdated(reqResObj));
    }
    appDispatch(reqResUpdated(reqResObj));
    // If current selected response equals reqResObj received, update current response

    /** @todo Find where id should be */
    const currentID = Store.getState().reqRes.currentResponse.id;
    if (currentID === reqResObj.id) {
      console.log('AFTER UPDATED: ', reqResObj);
      appDispatch(responseDataSaved(reqResObj));
    }
  },
};

export default trpcController;
