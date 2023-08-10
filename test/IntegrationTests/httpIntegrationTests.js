const { _electron: electron } = require('playwright');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');

let electronApp,
  page,
  method,
  url,
  num = 0;

const projectPath = path.resolve(__dirname, '..', '..', 'main.js');

module.exports = () => {
  describe('HTTP Integration Tests', function () {
    // this.timeout(0); //! use this to pause electron app when needed delete after
    // place below method where ever you want to pause the app
    // // setting it to not close
    // this.timeout(0)
    // await new Promise(resolve => {});

    //~ Launch app, reset workspace, reset db
    before(async () => {
      electronApp = await electron.launch({ args: [projectPath] });
      await new Promise(resolve => setTimeout(resolve, 1000));
      page = await electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);
      // clear workspace
      if (page) await page.locator('button >> text=Clear Workspace').click();
      // clear DB
      await new Promise((resolve, reject) => {
        chai
          .request('http://localhost:3004')
          .get('/clear')
          .end((err, res) => {
            if (err) reject(err);
            else resolve(res);
          });
      });

    });

    //~ If failed, add screenshot to folder
    afterEach(async function () {
      if (this.currentTest.state === 'failed') {
        console.log(`Screenshotting failed test window`);
        const imageBuffer = await page.screenshot();
        fs.writeFileSync(
          path.resolve(
            __dirname + '/../failedTests',
            `FAILED_${this.currentTest.title}.png`
          ),
          imageBuffer
        );
      }
    });

    //~ close electron app when complete
    after(async () => {
      if (page) await page.locator('button >> text=Clear Workspace').click();
      await electronApp.close();
    });

    describe('Check if the process for an HTTP method is properly handling state in the backend', async () => {
      url = 'http://localhost:3004/book';
      method = 'POST';
      body = '{"title": "HarryPotter", "author": "JK Rowling", "pages": 500}';

      it('Changes newRequestFields state to have correct url', async () => {
        await page.locator('#url-input').fill(url);
        const reduxState = await page.evaluate(() => window.getReduxState());
        //! Which field is actually being used
        expect(reduxState.newRequestFields.restUrl).to.equal(url);
        expect(reduxState.newRequestFields.url).to.equal(url);
      });

      it('Changes newRequestFields state to have POST method ', async () => {
        await page.locator('button#rest-method').click();
        await page.locator(`div[id^="composer"] >> a >> text=${method}`).click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequestFields.method).to.equal('POST')
      });

      it('Changes state to have POST body information ', async () => {
        const codeMirror = await page.locator('#body-entry-select');
        await codeMirror.click();
        const restBody = await codeMirror.locator('.cm-content');
        restBody.fill('');
        await restBody.fill(body);
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequest.newRequestBody.bodyContent).to.equal("{\"title\": \"HarryPotter\", \"author\": \"JK Rowling\", \"pages\": 500}");
      });

      it('Changes header to correct body type in newRequestBody', async () => {
        await page.locator('#raw-body-type').click();
        await page.locator('.dropdown-item >> text=application/json').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequest.newRequestBody.rawType).to.equal('application/json');
        expect(reduxState.newRequest.newRequestHeaders.headersArr[0].key).to.equal('Content-type');
        expect(reduxState.newRequest.newRequestHeaders.headersArr[0].value).to.equal('application/json');
      });

      it('Adds request to workplace and updates reqRes state object', async () => {
        await page.locator('button >> text=Add to Workspace').click();
        const reduxState = await page.evaluate(() => window.getReduxState());
        const reqResArray = reduxState.reqRes.reqResArray;
        expect(reqResArray[reqResArray.length - 1].url).to.equal(url);
        expect(reqResArray[reqResArray.length - 1].request.method).to.equal(method);

        
      });


      it('Resets fields in request form and resets their respective states', async () => {
        const reduxState = await page.evaluate(() => window.getReduxState());
        
        // Resets bodyContent in newRequestBody
        expect(reduxState.newRequest.newRequestBody.bodyContent).to.equal('');
        // Resets headersArr in newRequesetHeaders
        expect(reduxState.newRequest.newRequestHeaders.headersArr[0].key).to.equal('');
        expect(reduxState.newRequest.newRequestHeaders.headersArr[0].value).to.equal('');
        // Resets method and urls in newRequestFields
        expect(reduxState.newRequestFields.method).to.equal('GET');
        expect(reduxState.newRequestFields.url).to.equal('http://');
        expect(reduxState.newRequestFields.restUrl).to.equal('http://');

        
      });

      // Run request, make sure proper states are updated
      it('Running request in workspace properly changes state for currentResponse and reqRes status', async () => {
        num = 0
        await page.locator(`#send-button-${num}`).click();
        await page.waitForLoadState();
        // await new Promise(resolve => setTimeout(resolve, 1000));
        const reduxState = await page.evaluate(() => window.getReduxState());
        console.log(reduxState)
        const result = {
          "title": "HarryPotter",
          "author": "JK Rowling",
          "pages": 500
        }
        // Check if current response updated to have output response
        expect(reduxState.reqRes.currentResponse.response.events[0]).to.deep.equal(result)

        // Check if Status updated in reqRes
        const reqResArray = reduxState.reqRes.reqResArray;
        console.log(reqResArray[0].response) //! delete after
        expect(reqResArray[reqResArray.length - 1].response.status).to.equal(200)

      });

      // Template
      it('template', async () => {

      });
    });


    //~ HTTP GET REQUEST

  }).timeout(20000);
};
