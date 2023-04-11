const { ipcMain } = require('electron');
const { fetch } = require('cross-fetch');

const mockController = {
  /**
   * Sends a POST request to the mock server to create new mock endpoints.
   * @param {*} event - The Electron event object that triggered the submission of the mock request.
   * @param {*} postData - the JSON stringified object from the renderer that contains a "method", "endpoint" and "response" keys that will be used to create the mock endpoint.
   */
  submitMockRequest: async (event, postData) => {
    try {
      const result = await fetch('http://localhost:9990/mock/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: postData,
      });
      console.log('Result: ', result);
    } catch (err) {
      console.log('Error submitting endpoint: ', err);
    }
  },
};

module.exports = () => {
  ipcMain.on('submit-mock-request', async (event, postData) => {
    mockController.submitMockRequest(event, postData);
  });
};
