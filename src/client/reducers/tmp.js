switch(types) {
  case types.SET_NEW_REQUESTS_OPENAPI: {
    return {
    ...state,
    NewRequestOpenAPI: { openapiMetadata, openapiReqArray } = action.payload,
    }
  }

  case types.SET_OPENAPI_SERVERS_GLOBAL: {
    const openapiMetadata = { ...state.openapiMetadata };
    openapiMetadata.serverUrls = [ ...state.openapiMetadata.serverUrls ].filter((_, i) => action.payload.includes(i));
    return {
      ...state,
      NewRequestOpenAPI: openapiMetadata,
    };
  }

  case types.SET_OPENAPI_SERVERS: {
    const { id, serverIds } = action.payload;
    const request = [ ...state.openapiReqArray ].filter(({ request }) => request.id === id).pop();
    request.reqServers = [ ...state.openapiMetadata.serverUrls ].filter((_, i) => serverIds.includes(i));
    const openapiReqArray = [ ...state.openapiReqArray ].push({ request });
    return {
      ...state,
      NewRequestOpenAPI: openapiReqArray,
    };
  }

  case types.ENABLE_REQUEST_OPENAPI: {
    const id = action.payload;
    const request = [ ...state.openapiReqArray ].filter(({ request }) => request.id === id).pop();
    request.enabled = true;
    const openapiReqArray = [ ...state.openapiReqArray ].push({ request });
    return {
      ...state,
      NewRequestOpenAPI: openapiReqArray,
    };
  }

  case types.DISABLE_REQUEST_OPENAPI: {
    const id = action.payload;
    const request = [ ...state.openapiReqArray ].filter(({ request }) => request.id === id).pop();
    request.enabled = false;
    const openapiReqArray = [ ...state.openapiReqArray ].push({ request });
    return {
      ...state,
      NewRequestOpenAPI: openapiReqArray,
    };
  }

  case types.SET_NEW_OPENAPI_PARAMETER: {
    const { id, location, name, value } = action.payload;
    const request = [ ...state.openapiReqArray ].filter(({ request }) => request.id === id).pop();
    const urls = [ ...request.reqServers ].map((url) => url += request.endpoint);
    switch (location) {
      case 'path': {
        if ()
        else urls.map((url) => url.replace(`{${name}}`, value));
        request.urls = urls;
        const openapiReqArray = [ ...state.openapiReqArray ].push({ request });
        return {
          ...state,
          NewRequestOpenAPI: openapiReqArray,
        }
      }
      case 'query': {
        urls.map((url) => {
          if (url.slice(-1) !== '?') url += '?';
          url += `${name}=${value}&`
        });
        request.urls = urls;
        const openapiReqArray = [ ...state.openapiReqArray ].push({ request });
        return {
          ...state,
          NewRequestOpenAPI: openapiReqArray,
        }
      }
      case 'header': {
        if (['Content-Type', 'Authorization', 'Accepts'].includes(key)) break;
        request.headers = userInput.parameters[id].filter(({ type }) => type === 'header');
        const openapiReqArray = [ ...state.openapiReqArray ].push({ request });
        return {
          ...state,
          NewRequestOpenAPI: openapiReqArray,
        }
      }
      case 'cookie': {
        request.cookies = userInput.parameters[id].filter(({ type }) => type === 'cookie');
        const openapiReqArray = [ ...state.openapiReqArray ].push({ request });
        return {
          ...state,
          NewRequestOpenAPI: openapiReqArray,
      }
      default: {
        return { ...state };
      }
    }
  }

  case types.SET_NEW_OPENAPI_REQUEST_BODY: {
    const { id, mediaType, requestBody } = action.payload;
    const request = [ ...state.openapiReqArray ].filter(({ request }) => request.id === id).pop();
    const { method } = request;
    if (!['get', 'delete', 'head'].includes(method) && requestBody !== undefined) {
      request.body = requestBody;
      request.rawType = mediaType
    }
    const openapiReqArray = [ ...state.openapiReqArray ].push({ request });
    return {
      ...state,
      NewRequestOpenAPI: openapiReqArray,
    }
  }

  case types.QUEUE_OPENAPI_REQUESTS: {
    const openapiReqQueue = [ ...state.openapiReqArray ].filter(({ request }) => request.enabled);
    const requests = openapiReqQueue.map(({ request }, i) => request.map{
      ...request
      method,
        headers: [{
          id: ,
          active: ,
          key: '',
          value: '',
        }],
      cookies: '',
      body,
      bodyType: raw ,
      rawType,
      network: 'rest',
      testContent: false,
    });
    const reqResObj = {
      protocol: 'http://' || 'https://',
      url,
      isSSE: false,
      isHTTP2: false,
      testContent: false,
    }
    return {
      ...state,
      
      
    }
  }
}