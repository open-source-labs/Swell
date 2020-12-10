const { NodeVM } = require('vm2');

const testHttpController = {};

testHttpController.runTest = (testCode, reqResObj) => {

  const testResults = [];

  const sandbox = {
    addResult: (result) => testResults.push(result),
  }

  const vm = new NodeVM({
    sandbox,
    require: {
      external: true,
    },
  })

  const prompts = testCode.split(/assert|expect/g).slice(1);

  const promptsArray = prompts.map(ele=> (
    `try {
      if(${JSON.stringify(ele[0])} === '.') {
        const res = assert${ele};
        addResult(res);
      } else if (${JSON.stringify(ele[0])} === '(') {
        const res = expect${ele};
        console.log(res);
        addResult(res);
      }
    } catch(e) {
      addResult(e)
    }
    `
  ))

  const testScript = 
    `
    const { assert, expect } = require('chai');
    ${promptsArray.join('')}
    `

  try{
    vm.run(testScript, 'main.js');
    console.log(reqResObj.response)
    const testResultArray = testResults.map(result => {
      if(result.__flags.object) return {result: 'Pass', message: result.__flags.message || 'Test passed'}
      else return {result: 'Fail', message: result.__flags.message || 'Test failed'}
    })
    console.log(`Results: ${JSON.stringify(testResultArray)}`)
    return testResultArray;
  } 
  catch (err) {
    console.log('caught error!: in the catch block of main_testHttpController.js', err)
    return null;
  }
};

module.exports = testHttpController;