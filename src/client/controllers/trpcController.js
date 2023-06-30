const trpcController = {
  makeFetch: async (args, event, reqResObj) => {
    try {
      const { method, headers, body } = args.options;
      const response = await fetch(headers.url, { method, headers, body });
      const headersResponse = response.headers.raw();
      event.sender.send('console', 'WHATS UP');
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
  parseOptionForFetch(reqResObject, method, postProcedure) {
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
        console.log(parsedJson);
        if (typeof parsedJson === 'object' && parsedJson !== null) {
          return parsedJson;
        } else {
          throw 'is String';
        }
      } catch (error) {
        return JSON.parse(str);
      }
    }
    const { headers, cookies } = reqResObject.request;

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
    let endPoint = '';
    if (method === 'POST') {
      const body = {};

      postProcedure.forEach((procedure, index) => {
        if (procedure.variable) {
          body[index] = parseString(procedure.variable);
        } else {
          body[index] = {};
        }
        endPoint = endPoint
          ? endPoint + ',' + procedure.endpoint
          : procedure.endpoint;
      });
      outputObj.body = body;
    } else {
      const input = '';
    }
    outputObj.endPoint = endPoint;
    return outputObj;
  },

  sendRequest: function (reqRes) {
    console.log(reqRes);
    const procedures = reqRes.request.procedures;
    const getReq = procedures.filter(
      (procedure) => procedure.method === 'QUERY'
    );
    const postReq = procedures.filter(
      (procedure) => procedure.method === 'MUTATE'
    );
    console.log(getReq);
    const getOption = this.parseOptionForFetch(reqRes, 'GET', getReq);
    const postOption = this.parseOptionForFetch(reqRes, 'POST', postReq);

    console.log(getOption, postOption);
  },
};

export default trpcController;
