const trpcController = {
  makeFetch: async (reqRes, get, post) => {
    const { cache, headers, method, redirect, referrer, url } = get;
    console.log(get, post);
    const getRes = await fetch(url, {
      cache,
      headers,
      method,
      redirect,
      referrer,
    });
    const getData = await getRes.json();
    console.log(getData);
    const resHeader = {};
    getRes.headers.forEach((value, key) => {
      resHeader[key] = value;
    });
    console.log(resHeader);
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

  sendRequest: async function (reqRes) {
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
    // const data = await fetch(reqRes.url + '/' + getOption.endPoint);
    // const res = await data.json();
    // const resHeader = {};
    // data.headers.forEach((value, key) => {
    //   resHeader[key] = value;
    // });
    // console.log(header);

    // const postData = await fetch(reqRes.url + '/' + postOption.endPoint, {
    //   method: 'POST',
    //   body: JSON.stringify(postOption.body),
    // });
    // const postRes = await postData.json();
    // console.log(res, postRes);
  },
};

export default trpcController;
