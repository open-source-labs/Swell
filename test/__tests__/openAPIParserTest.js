const fs = require('fs');
const path = require('path');

import openapiParserFunc from '../../main_process/openapiParser';

/** @todo Test the actual contents of the parser */
describe('openAPI Parser tests', () => {
  const file = fs.readFileSync(
    path.resolve(__dirname + '/../__mockTestData/openAPITestDefinition.yaml')
  );

  it('should be able to parse a yaml file', () => {
    const { openapiMetadata, openapiReqArray } = openapiParserFunc(
      String(file)
    );
    expect(openapiMetadata).toBeDefined();
    expect(openapiReqArray).toBeDefined();
  });

  it('should error on undefined input', () => {
    expect(() => openapiParserFunc(null)).toThrow(ReferenceError);
    expect(() => openapiParserFunc(undefined)).toThrow(ReferenceError);
  });

  it('should parse the openAPI document correctly', () => {
    const { openapiMetadata, openapiReqArray } = openapiParserFunc(
      String(file)
    );

    // Check if the metadata is parsed correctly
    expect(openapiMetadata.info.title).toBe('Sample API');
    expect(openapiMetadata.info.version).toBe('0.1.9');

    // Check if the requests are parsed correctly
    expect(openapiReqArray.length).toBe(1);
    expect(openapiReqArray[0].method).toBe('GET');
    expect(openapiReqArray[0].endpoint).toBe('/users/1');
  });
});

