const YAML = require('yamljs');

// TODO The security keys need to be implmented into the OpenApi request

const openapiParserFunc = (input) => {

  if (input === undefined || input === null) {
    throw new ReferenceError('OpenAPI Document not found.');
  }
  // Parse the input into JSON or YAML
  let doc;
  try {
    doc = JSON.parse(input);
  } catch (SyntaxError) {
    doc = YAML.parse(input);
  }
 
  const { info, servers, tags, paths, components } = doc;
  
  info.openapi = doc.openapi;

  let serverUrls
  if (servers) {
    serverUrls = [...servers.map((server) => server.url)];
  } else {
    serverUrls = []
  }
  let id = 0;

  const openapiReqArray = [];
  Object.entries(paths).forEach(([endpoint, pathObj]) => {
    Object.entries(pathObj).forEach(([method, operationObj]) => {
      id += 1;
      const {
        summary,
        description,
        operationId,
        tags,
        parameters, // security
      } = operationObj;

      const request = {
        id,
        // enabled: true,
        reqTags: tags,
        summary,
        description,
        operationId,
        method: method.toUpperCase(),
        reqServers: [],
        endpoint,
        parameters,
        body: new Map(),
        headers: {},
        cookies: {},
        // params: {},
        // queries: {},
        urls: [],
      };
      openapiReqArray.push(request);
    });
  });

  const openapiMetadata = { info, tags, serverUrls };

  return { openapiMetadata, openapiReqArray } || 'Enter a valid Open API Format';
};

module.exports = openapiParserFunc;
