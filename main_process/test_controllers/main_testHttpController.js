const { NodeVM } = require('vm2');

const testHttpController = {};

testHttpController.runTest = (testCode, reqResObj) => {
  const results = [];

  const sandbox = {
    addResult: (e) => results.push(e),
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
    console.log(testCode, reqResObj)
    vm.run(testScript, 'main.js');
    return results;
  } 
  catch (err) {
    console.log('caught error!: in the catch block of main_testHttpController.js', err)
  }
};

module.exports = testHttpController;
