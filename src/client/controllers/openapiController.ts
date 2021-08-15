import * as YAML from 'yamljs';

// TODO: Validation, Callbacks
const parseOpenapiDocument = (input: string): Record<string, unknown> => {
  if (input === undefined || input === null) ReferenceError('OpenAPI Document not found.');
  let doc;
  try {
    doc = JSON.parse(input) as Record<string, unknown>;
  } catch (SyntaxError) {
    doc = YAML.parse(input) as Record<string, unknown>;
  }
  const {
    info, servers, tags, paths, // components
  } = doc as {
    info: Record<string, unknown>, 
    servers: Record<string, unknown>[],
    tags: Record<string, unknown>[],
    paths: Record<string, unknown>,
    // components: Record<string, unknown>,
  };
  info.openapi = doc.openapi;
  const serverUrls = [ ...servers.map((server) => server.url) ];
  let id = 0;

  const reqResArray = [];
  Object.entries(paths).forEach(([endpoint, pathObj]) => {
    Object.entries(pathObj).forEach(([method, operationObj]) => {
      id += 1;
      const {
        summary, description, operationId,
        tags, parameters, // security
      } = operationObj as {
        summary: string, description: string, operationId: string,
        tags: string[], parameters: Record<string, unknown>[], 
        // security: Record<string, unknown>[], 
      };
      const request = {
        id,
        enabled: true,
        reqTags: tags,
        summary, description, operationId,
        reqServers: [],
        method, 
        endpoint, 
        headers: [],
        parameters,
        body: new Map(),
        urls: [],
        params: [],
        queries: [],
      }
      reqResArray.push({ request });
    });
  });  
  return { info, tags, serverUrls, reqResArray };
};

export default parseOpenapiDocument;