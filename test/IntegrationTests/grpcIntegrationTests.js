

const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');

const grpcServer = require('../grpcServer.js');


let electronApp,
  page,
  url = '0.0.0.0:30051',
  num = 0;

const proto = fs.readFileSync(
  path.resolve(__dirname, '../grpc_mockData/mock_protos/hw2.proto')
);

const projectPath = path.resolve(__dirname, '..', '..', 'main.js');

module.exports = () => {
  describe('gRPC Integration Testing', () => {
    before(async () => {
      electronApp = await electron.launch({ args: [projectPath] });
      await new Promise(resolve => setTimeout(resolve, 1000));
      page = await electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);
      grpcServer('open');

    });

    //& Make a before each that resets the workspace and all
    // beforeEach(async () => {
    //   await page.locator('button>> text=GRPC').click();
    //   await page.locator('#url-input').fill('0.0.0.0:30051');
    //   // Auto fill proto

    // });

    after(async () => {
      if (page) await page.locator('button >> text=Clear Workspace').click();
      await electronApp.close();
    });

    it('State is being properly handled in an Unary RPC', async () => {
      let reduxState;
      await page.locator('button>> text=GRPC').click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequestFields.gRPC).to.equal(true)
      await page.locator('#url-input').fill(url);
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequestFields.grpcUrl).to.equal(url)
      // Add Proto
      let codeMirror = await page.locator('#grpcProtoEntryTextArea');
      await codeMirror.click();
      let gRPC_BodyCode = await codeMirror.locator('.cm-content');
      await gRPC_BodyCode.fill(`${proto}`);
      await page.locator('#save-proto').click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.services[0].packageName).to.equal('helloworld')
      // Testing setting 'Greeter'
      await page.locator('#Select-Service-button').click();
      await page.locator('.dropdown-menu >> a >> text=Greeter').click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.selectedService).to.equal('Greeter')
      // Testing setting the 'SayHello' Option
      await page.locator('#Select-Request-button').click();
      await page.getByText('SayHello', { exact: true }).click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.selectedRequest).to.equal('SayHello')
      // Testing setting the body
      const grpcBody = '{"name":"Nate"}'
      codeMirror = await page.locator('#grpcBodyEntryTextArea');
      await codeMirror.click();
      gRPC_BodyCode = await codeMirror.locator('.cm-content');
      await gRPC_BodyCode.fill(`${grpcBody}`);
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.streamContent[0]).to.equal(grpcBody);
      // Add to workspace
      await page.locator('button >> text=Add to Workspace').click();
      reduxState = await page.evaluate(() => window.getReduxState());
      const reqResArray = reduxState.reqRes.reqResArray;
      expect(reqResArray[reqResArray.length - 1].url).to.equal(url);
      expect(reqResArray[reqResArray.length - 1].gRPC).to.equal(true);
      // Check if fields reset
      expect(reduxState.newRequest.newRequestStreams.streamsArr[0].query).to.equal('');
      // Send response
      num = 0
      const response = { "message": "Hello Nate"};
      await page.locator(`#send-button-${num}`).click();
      await page.waitForLoadState();
      await new Promise(resolve => setTimeout(resolve, 1000));
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.reqRes.currentResponse.gRPC).to.equal(true);
      expect(reduxState.reqRes.reqResArray[0].response.events[0]).to.deep.equal(response);
      expect(reduxState.reqRes.currentResponse.response.events[0]).to.deep.equal(response);
    });

    it('State is being handled ', () => {
      console.log('first test')
    });

    it('test 123', () => {
      console.log('first test')
    });
  }).timeout(20000);
};