// testing controller for executing user-defined assertion tests
const { NodeVM } = require('vm2');

const testHttpController = {};

testHttpController.runTest = (inputScript, reqResObj) => {
  // final test result objects will be stored in this array
  const testResults = [];
  // this is the global object that will be passed into the VM
  const sandbox = {
    // function to push an Assertion object into the array
    addOneResult: (result) => testResults.push(result),
  }
  // create a new instance of a secure Node VM
  const vm = new NodeVM({
    sandbox,
    // allow external npm modules to be required in
    require: {
      external: true,
    },
  })
  // create array of individual assertion tests. 
  // we remove the first element of the array because it is an empty string
  const separatedScriptsArray = inputScript.split(/assert|expect/g).slice(1);
  // create an array of test scripts that will be executed in Node VM instance
  const arrOfTestScripts = separatedScriptsArray.map(script=> (
    `
    if(${JSON.stringify(script[0])} === '.') {
      const res = assert${script};
      addOneResult(res);
    } else if (${JSON.stringify(script[0])} === '(') {
      const res = expect${script};
      addOneResult(res);
    }
    `
  ));
  // require in the chai assertion library
  // then concatenate all the scripts to the testScript string
  const testScript = 
    `
    const { assert, expect } = require('chai');
    ${arrOfTestScripts.join('')}
    `

  try{
    // run the script in the VM
    // the second argument denotes where the vm should look for the node_modules folder
    // that is, relative to the main.js file where the electron process is running
    vm.run(testScript, 'main.js');
    // map over the test results array and for each test result, construct an object containing
    // the result of the test and a message 
    const finalResults = testResults.map(result => {
      // this property on the assertion object is the result of the assertion test i.e. pass or fail
      if (result.__flags.object) {
        return {result: 'Pass', message: result.__flags.message || 'Test passed'};
      }
      return {result: 'Fail', message: result.__flags.message || 'Test failed'};
    });
    return finalResults;
  } 
  catch (err) {
    console.log('caught error!: in the catch block of main_testHttpController.js', err)
    return null;
  }
};

module.exports = testHttpController;
