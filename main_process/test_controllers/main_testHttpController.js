// testing controller for executing user-defined assertion tests
const { NodeVM } = require("vm2");

const testHttpController = {};

testHttpController.runTest = (inputScript, reqResObj, gqlResponse) => {
  const { request } = reqResObj;
  let { response } = reqResObj;
  // final test result objects will be stored in this array
  const testResults = [];

  if (gqlResponse) {
    const data = gqlResponse.data;
    response = { ...response, data };
  }
  // this is the global object that will be passed into the VM
  const sandbox = {
    // function to push an Assertion object into the array
    addOneResult: (result) => testResults.push(result),
    request,
    response,
  };
  // create a new instance of a secure Node VM
  const vm = new NodeVM({
    sandbox,
    // allow only chai to be required in
    require: {
      external: ["chai"],
    },
  });
  // create array of individual assertion tests
  // the regex matches all 'assert' or 'expect' only at the start of a new line
  // we remove the first element of the array because it is an empty string
  const separatedScriptsArray = inputScript.split(/^assert|^expect/gm).slice(1);

  ////////////////////////////////////////////
  // Parse for let, const, or var keywords. //
  ////////////////////////////////////////////

  const paramRegex = /(const|let|var)\s+\w*\s*=\s*(\'[^\']*\'|\"[^\"]*\"|\s*\w*)/gm
  const paramArray = inputScript.match(paramRegex)

  // create an array of test scripts that will be executed in Node VM instance
  const arrOfTestScripts = separatedScriptsArray.map((script) => {
    /*
    // Work-in-progress to determine the message from the script
    // Regular expression from stack overflow post below
    // https://stackoverflow.com/a/171499
    // this regex matches all substrings wrapped in single or double quotes
    // and supports escaped quotes as well
    const substringsInQuotes = /(["'])(?:\\.|[^\\])*?\1/g;
    // use the regex and return all the substrings in quotes
    const assertionArgsInQuotes = script.match(substringsInQuotes);

    // there is still a problem where if there are quotes in the arguments
    // and there is no user-supplied message. we incorrectly choose the last arg as the userMessage
    let userMessage;
    if (!assertionArgsInQuotes) {
      userMessage = "''";
    } else {
      // since the user's message will always be the last argument, it will be last in the array
      userMessage = assertionArgsInQuotes[assertionArgsInQuotes.length - 1];
    }
    */

    // contstruct and return the individual test script
    // if the assertion test does not fail, then push an object with the message and status
    // to the results array
    // if the assertion test fails and throws an error, also include the expected and actual
    return `
    try {
      if (${JSON.stringify(script[0])} === '.') {
        assert${script};
        addOneResult({
          message: 'assert'+${JSON.stringify(script)},
          status: 'PASS',
        });
      } else if (${JSON.stringify(script[0])} === '(') {
        expect${script};
        addOneResult({
          message: 'expect'+${JSON.stringify(script)},
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
    const { assert, expect } = require('chai');
    ${paramArray.join(';')}
    ${arrOfTestScripts.join("")}
    `;

  try {
    // run the script in the VM
    // the second argument denotes where the vm should look for the node_modules folder
    // that is, relative to the main.js file where the electron process is running
    vm.run(testScript, "main.js");
    // deep clone the testResults array since sending functions, DOM elements, and non-cloneable
    // JS objects is not supported IPC channels past Electron 9
    return JSON.parse(JSON.stringify(testResults));
  } catch (err) {
    console.log(
      "caught error!: in the catch block of main_testController.js",
      err
    );
    // return a null object in the event of an error
    return null;
  }
};

module.exports = testHttpController;
