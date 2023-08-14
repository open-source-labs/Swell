

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
      const codeMirror = await page.locator('#grpcProtoEntryTextArea');
      await codeMirror.click();
      const gRPC_BodyCode = await codeMirror.locator('.cm-content');
      await gRPC_BodyCode.fill(`${proto}`);
      await page.locator('#save-proto').click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.services[0].packageName).to.equal('helloworld')
      // Testing setting Greeter'
      await page.locator('#Select-Service-button').click();
      await page.locator('.dropdown-menu >> a >> text=Greeter').click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.selectedService).to.equal('Greeter')
      await page.locator('#Select-Request-button').click();
      await page.getByText('SayHello', { exact: true }).click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.selectedRequest).to.equal('SayHello')


    });

    it('test 123', () => {
      console.log('first test')
    });
  }).timeout(20000);
};