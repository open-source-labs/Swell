const YAML = require('yamljs');

/////////////
const Ajv = require('ajv');
const openapiSchema = require('openapi-schema-validation');

const ajv = new Ajv();
const validateOpenAPI = ajv.compile(openapiSchema);


const errors = validateOpenAPI.errors;
if (errors) {
  const errorMessages = errors.map((error) => `Validation Error: ${error.dataPath} ${error.message}`);
  throw new Error(`Invalid OpenAPI document.\n${errorMessages.join('\n')}`);
}
/////////////

// TODO The security keys need to be implmented into the OpenApi request

const openapiParserFunc = (input) => {

  // Input validation
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string.');
  }

  if (input === undefined || input === null) {
    throw new ReferenceError('OpenAPI Document not found.');
  }
  // Parse the input into JSON or YAML
  let doc;
  try {
    //try json parse
    doc = JSON.parse(input);
  } catch (jsonError) {
    // try to parse as yaml
    try{
      doc = YAML.parse(input)
    } catch (yamlError) {
      throw new Error('Invalid JSON, or YAML format: ' + yamlError.message)
    }
  }

  // Schema validation
  const isValidOpenAPI = validateOpenAPI(doc);
  if (!isValidOpenAPI) {
    throw new Error('Invalid OpenAPI document. Schema validation failed.');
  }
 
 
  const { info = {}, servers = [], tags = [], paths = {}, components = {} } = doc;
  
  info.openapi = doc.openapi;

  const serverUrls = servers.map((server) => server.url);

  const openapiReqArray = [];
  let id = 0;

  Object.entries(paths).forEach(([endpoint, pathObj]) => {
    Object.entries(pathObj).forEach(([method, operationObj]) => {
      id += 1;

      const {
        summary = '',
        description = '',
        operationId = '',
        tags = [],
        parameters = [],
        security = [],
        responses = {},
        externalDocs = {},
        version = '',
      } = operationObj;

      const securitySchemes = components.securitySchemes || {};
      const responseExamples = {}; // Extract response examples from responses object if available

      // const request = {
      //   id,
      //   // enabled: true,
      //   reqTags: tags,
      //   summary,
      //   description,
      //   operationId,
      //   method: method.toUpperCase(),
      //   reqServers: [],
      //   endpoint,
      //   parameters,
      //   body: new Map(),
      //   headers: {},
      //   cookies: {},
      //   // params: {},
      //   // queries: {},
      //   urls: [],
      // };
      const request = {
        id,
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
        securitySchemes,
        responseExamples,
        externalDocs,
        version,
        urls: [],
      };
      openapiReqArray.push(request);
    });
  });

  const openapiMetadata = { info, tags, serverUrls };

  return { openapiMetadata, openapiReqArray } || 'Enter a valid Open API Format';
};

module.exports = openapiParserFunc;
