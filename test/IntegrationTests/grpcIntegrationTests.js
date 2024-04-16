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
      try {
        electronApp = await electron.launch({ args: [projectPath] });
        await new Promise((resolve) => setTimeout(resolve, 5000));
        page = await electronApp.windows()[0]; // In case there is more than one window
        await page.waitForLoadState(`domcontentloaded`);
        grpcServer('open');
      } catch (error) {
        console.error('Error in before hook:', error);
      }
    });

    //& Make a before each that resets the workspace and all
    beforeEach(async () => {
      await page.locator('button >> text=Clear Workspace').click();
    });

    after(async () => {
      if (page) await page.locator('button >> text=Clear Workspace').click();
      await electronApp.close();
      grpcServer('close');
    });

    it('State is being properly handled in an Unary RPC', async () => {
      let reduxState;
      await page.locator('button>> text=GRPC').click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequestFields.gRPC).to.equal(true);
      await page.locator('#url-input').fill(url);
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequestFields.grpcUrl).to.equal(url);
      // Add Proto
      let codeMirror = await page.locator('#grpcProtoEntryTextArea');
      await codeMirror.click();
      let gRPC_BodyCode = await codeMirror.locator('.cm-content');
      await gRPC_BodyCode.fill(`${proto}`);
      await page.locator('#save-proto').click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(
        reduxState.newRequest.newRequestStreams.services[0].packageName
      ).to.equal('helloworld');
      // Testing setting 'Greeter'
      await page.locator('#Select-Service-button').click();
      await page.locator('.dropdown-menu >> a >> text=Greeter').click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.selectedService).to.equal(
        'Greeter'
      );
      // Testing setting the 'SayHello' Option
      await page.locator('#Select-Request-button').click();
      await page.getByText('SayHello', { exact: true }).click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.selectedRequest).to.equal(
        'SayHello'
      );
      // Testing setting the body
      const grpcBody = '{"name":"Nate"}';
      codeMirror = await page.locator('#grpcBodyEntryTextArea');
      await codeMirror.click();
      gRPC_BodyCode = await codeMirror.locator('.cm-content');
      await gRPC_BodyCode.fill(`${grpcBody}`);
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.streamContent[0]).to.equal(
        grpcBody
      );
      // Add to workspace
      await page.locator('button >> text=Add to Workspace').click();
      reduxState = await page.evaluate(() => window.getReduxState());
      const reqResArray = reduxState.reqRes.reqResArray;
      expect(reqResArray[reqResArray.length - 1].url).to.equal(url);
      expect(reqResArray[reqResArray.length - 1].gRPC).to.equal(true);
      // Check if fields reset
      expect(
        reduxState.newRequest.newRequestStreams.streamsArr[0].query
      ).to.equal('');
      // Send response
      num = 0;
      const response = { message: 'Hello Nate' };
      await page.locator(`#send-button-${num}`).click();
      await page.waitForLoadState();
      await new Promise((resolve) => setTimeout(resolve, 100));
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.reqRes.currentResponse.gRPC).to.equal(true);
      expect(reduxState.reqRes.reqResArray[0].response.events[0]).to.deep.equal(
        response
      );
      expect(
        reduxState.reqRes.currentResponse.response.events[0]
      ).to.deep.equal(response);
    });

    it('State is being properly handled in a Server Stream RPC', async () => {
      let reduxState;
      // Add Proto
      let codeMirror = await page.locator('#grpcProtoEntryTextArea');
      await codeMirror.click();
      let gRPC_BodyCode = await codeMirror.locator('.cm-content');
      await gRPC_BodyCode.fill(`${proto}`);
      await page.locator('#save-proto').click();
      // Setting 'Greeter'
      await page.locator('#Select-Service-button').click();
      await page.locator('.dropdown-menu >> a >> text=Greeter').click();
      // Setting the 'SayHellosSs' Option
      await page.locator('#Select-Request-button').click();
      await page.getByText('SayHellosSs', { exact: true }).click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.selectedRequest).to.equal(
        'SayHellosSs'
      );
      // Set the body
      const grpcBody = '{"name":"Nate"}';
      codeMirror = await page.locator('#grpcBodyEntryTextArea');
      await codeMirror.click();
      gRPC_BodyCode = await codeMirror.locator('.cm-content');
      await gRPC_BodyCode.fill(`${grpcBody}`);
      // Add to workspace
      await page.locator('button >> text=Add to Workspace').click();
      // Send response
      await page.locator(`#send-button-${num}`).click();
      await page.waitForLoadState();
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Check state of resposne
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.reqRes.reqResArray[0].response.events.length).to.equal(
        5
      );
      expect(reduxState.reqRes.reqResArray[0].response.events[2]).to.deep.equal(
        { message: 'doing IT' }
      );
      expect(reduxState.reqRes.reqResArray[0].response.events[4]).to.deep.equal(
        { message: 'hello!!! Nate' }
      );
    });

    it('State is being properly handled in a Client Stream RPC', async () => {
      let reduxState;
      // Add Proto
      let codeMirror = await page.locator('#grpcProtoEntryTextArea');
      await codeMirror.click();
      let gRPC_BodyCode = await codeMirror.locator('.cm-content');
      await gRPC_BodyCode.fill(`${proto}`);
      await page.locator('#save-proto').click();
      // Setting 'Greeter'
      await page.locator('#Select-Service-button').click();
      await page.locator('.dropdown-menu >> a >> text=Greeter').click();
      // Setting the 'SayHelloCS' Option
      await page.locator('#Select-Request-button').click();
      await page.getByText('SayHelloCS', { exact: true }).click();
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.selectedRequest).to.equal(
        'SayHelloCS'
      );
      await page.getByText('Add Stream').click();
      await page.getByText('Add Stream').click();

      // Set text for each of streams
      const inputBoxes = await page.locator('#grpcBodyEntryTextArea').all();
      for (let i = 0; i < inputBoxes.length; i++) {
        const currBox = inputBoxes[i];
        await currBox.click();
        let inputText = await currBox.locator('.cm-content');
        await inputText.fill(`{"name":"Stream${i}"}`);
        // await new Promise(resolve => {});
      }
      // Check if state is properly updated with all these streams
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.newRequest.newRequestStreams.count).to.equal(3);
      for (let i = 0; i < inputBoxes.length; i++) {
        const inputedStream = JSON.parse(
          reduxState.newRequest.newRequestStreams.streamContent[i]
        );
        expect(inputedStream.name).to.equal(`Stream${i}`);
      }
      // Add to workspace
      await page.locator('button >> text=Add to Workspace').click();
      // Send response
      await page.locator(`#send-button-${num}`).click();
      await page.waitForLoadState();
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Check state of response
      reduxState = await page.evaluate(() => window.getReduxState());
      expect(reduxState.reqRes.reqResArray[0].streamContent.length).to.equal(3);
      const response = JSON.parse(
        reduxState.reqRes.reqResArray[0].streamContent[1]
      );
      expect(response.name).to.deep.equal('Stream1');

      // this.timeout(0);
      // console.log('made it to the end')
      // await new Promise(resolve => {});
    });
  }).timeout(20000);
};

