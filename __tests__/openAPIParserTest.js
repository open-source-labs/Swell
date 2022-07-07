const fs = require('fs');
const path = require('path');

import openapiParserFunc from '../main_process/openapiParser';

/** @todo Test the actual contents of the parser */
describe('openAPI Parser tests', () => {
  const file = fs.readFileSync(
    path.resolve(__dirname + '/../test/openAPITestDefinition.yaml')
  );

  it('should be able to parse a yaml file', () => {
    const { openapiMetadata, openapiReqArray } = openapiParserFunc(
      String(file)
    );
    expect(openapiMetadata).toBeDefined();
    expect(openapiReqArray).toBeDefined();
  });

  it('should error on undefined input', () => {
    expect(openapiParserFunc(null)).toThrow(ReferenceError);
  });
});
