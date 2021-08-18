/* eslint-disable no-useless-escape */
const { NodeVM } = require('vm2');
const chai = require('chai');

const testHttpController = {};

testHttpController.runTest = (
  inputScript,
  reqResObj,
  protocolData,
  isGraphQL = false
) => {
  const { request } = reqResObj;
  let { response } = reqResObj;
  // final test result objects will be stored in this array
  const testResults = [];

  if (isGraphQL) {
    const { data } = protocolData;
    const events = data;
    response = { ...response, events };
  }
  // this is the global object that will be passed into the VM
  const sandbox = {
    // function to push an Assertion object into the array
    addOneResult: (result) => testResults.push(result),
    request,
    response,
    chai,
  };
  // create a new instance of a secure Node VM
  const vm = new NodeVM({
    sandbox,
    // specify external libraries to be required in (dev mode only)
    require: {
      external: [],
    },
  });
  // the regex matches all 'assert' or 'expect' on separate lines
  // it will also match all variables
  // eslint-disable-next-line no-useless-escape
  const testRegex =
    /(((const|let|var)\s+\w*\s*=\s*(\'[^\']*\'|\"[^\"]*\"|\w*[^\s\;]*))|(expect|assert)[^;\n]*\([^;\n]*\)[\w\.]*)/gm;
  const separatedScriptsArray = inputScript.match(testRegex) ?? [];

  // create an array of test scripts that will be executed in Node VM instance
  const arrOfTestScripts = separatedScriptsArray.map((script) => {
    // construct and return the individual test script
    // if the assertion test does not fail, then push an object with the message and status
    // to the results array
    // if the assertion test fails and throws an error, also include the expected and actual
    // create a variable to conditionally declare in the right scope of the test script
    let variables = '';
    if (/^let|^const|^var/.test(script)) {
      variables = script;
    }

    return `
    ${variables}
    try {
        ${script}
        if(!/^let|^const|^var/.test(${JSON.stringify(script)})){
          addOneResult({
            message: ${JSON.stringify(script)},
            status: 'PASS',
          });
        }
    } catch (err) {
      const errObj = err;

      addOneResult({
        message: errObj.message,
        status: 'FAIL',
        expected: errObj.expected,
        actual: errObj.actual,
      });
    }
    `;
  });
  // require in the chai assertion library
  // then concatenate all the scripts to the testScript string
  const testScript = `
    const { assert, expect } = chai;
    ${arrOfTestScripts.join(' ')}
    `;
  try {
    // run the script in the VM
    // the second argument denotes where the vm should look for the node_modules folder
    // that is, relative to the main.js file where the electron process is running
    vm.run(testScript, 'main.js');
    // deep clone the testResults array since sending functions, DOM elements, and non-cloneable
    // JS objects is not supported IPC channels past Electron 9
    return JSON.parse(JSON.stringify(testResults));
  } catch (err) {
    console.log(
      'caught error!: in the catch block of main_testController.js',
      err
    );
    // return a null object in the event of an error
    return null;
  }
};

module.exports = testHttpController;
