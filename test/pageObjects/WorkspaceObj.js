const app = require('../testApp.js');

class WorkspaceObj {
  get latestSendRequestBtn() {
    return app.client.$('button=Send');
  };
  
  get latestRemoveRequestBtn() {
    return app.client.$('button=Remove');
  };
}; 

module.exports = new WorkspaceObj(); 