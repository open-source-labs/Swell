const { NodeVM } = require('vm2');

const testHttpController = {};

testHttpController.runTest = (testCode, reqResObj) => {
  const results = [];

  const sandbox = {
    addOne: (e) => result.push(e),
  }

  const vm = new NodeVM({
    sandbox,
    require: {
      external: true,
    },
  })

  const prompts = args.split(/assert|expect/g).slice(1);

  const promptsArray = prompts.map(ele=> (
    `try {
      if(${JSON.stringify(ele[0])} === '.') {
        const res = assert${ele};
        res.message = '';
        res.result = 'Pass';
        addOne(res);
      } else if (${JSON.stringify(ele[0])} === '(') {
        const res = expect${ele};
        addOne(res);
      }
    } catch(e) {
      addOne(e)
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
    return results;
  } 
  catch (err) {
    console.log('caught error!: in the catch block of main_testHttpController.js', err)
  }
};

module.exports = testHttpController;
