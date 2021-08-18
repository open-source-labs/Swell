const YAML = require('yamljs');

// TODO: Validation, Callbacks
const openapiParserFunc = (input) => {
  if (input === undefined || input === null)
    ReferenceError('OpenAPI Document not found.');
  let doc;
  try {
    doc = JSON.parse(input);
  } catch (SyntaxError) {
    doc = YAML.parse(input);
    console.error(SyntaxError);
  }
  const { info, servers, tags, paths, components } = doc;
  info.openapi = doc.openapi;
  const serverUrls = [...servers.map((server) => server.url)];
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
  return { openapiMetadata, openapiReqArray };
};

module.exports = openapiParserFunc;
