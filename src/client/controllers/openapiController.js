const fs = require('fs');
const path = require('path');

const doc = JSON.parse(fs.readFileSync(path.resolve(__dirname, './assets/twitter-example.json')));
if (doc === undefined || doc === null) new ReferenceError('OpenAPI Document not found.');
// console.log(doc);
// TODO: pass through validator

const { info, servers, tags, paths, components } = doc;
info.openapi = doc.openapi;
const serverUrls = [ ...servers.map(server => server.url) ];
const reqsByTag = {};
tags.forEach(tag => reqsByTag.tag = []);

const userInput = {
  requestIds: [],
  serversGlobal: [],
  serversOverride: {
    // id: [],
  },
  parameters: {
    // id: [{
    //   type,
    //   key,
    //   value,
    // }]
  },
  body: {
    // id: [mediaType, requestBody],
  }
};

const reqResObjOAI = {
  info,
  reqResArray: [
  //  {
  //    id, tags, enabled, summary, description, operationId
  //    method, headers, urls, body, (params, queries),
  //  }, 
  ]
}




let id = 0;
paths.forEach((endpoint) => {
  Object.keys(endpoint).forEach((method) => {
    const request = paths.endpoint.method;
    id += 1;
    request.id = id;
    request.method = method;
    // request destination servers
    const servers = userInput.serversOverride.id.length 
      ? [ ...userInput.serversOverride.id ]
      : [ ...serversGlobal ];
    // generate urls based on combination of servers and endpoints
    request.urls = servers.map((server) => {
      const url = '';
      if (server.slice(-1) !== '/') url += server
      else url += curr.server(0, -1); 
      url += endpoint;
      return url;
    });
    // parameters
    request.parameters.forEach((param) => {
      switch (param.in) {
        case 'path': {
          const params = userInput.parameters[id].filter(({ type }) => type === 'path');
          request.params = [];
          request.urls.map((url) => {
            params.forEach(({ key, value }) => {
              url.replace(`{${key}}`, value);
              request.params.push([key, value]);
            })
          });
        }
        case 'query': {
          const queries = userInput.parameters[id].filter(({ type }) => type === 'query');
          request.queries = [];
          request.urls.map((url) => {
            url += '?';
            queries.forEach(({ key, value }) => {
              url += `${key}=${value}&`
              request.queries.push([key, value]);
            });
          });
        }
        case 'header': {
          if (['Content-Type', 'Authorization', 'Accepts'].includes(param.name)) break;
          const headers = userInput.parameters[id].filter(({ type }) => type === 'header');
          request.headers = {};
          headers.forEach((header) => )
        }
        case 'cookie': {
          
        }
      }
    });

    if (!['get', 'delete', 'head'].includes(method) && userInput.body[id] !== undefined) {
      const [mediaType, requestBody] = userInput.body[id];
      request.body = new Map(mediaType, requestBody);
    }
    const { tags, summary, description, operationId } = request;
  });
});