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
      const response = await fetch('http://localhost:3004/book')
      const data = await response.json()
      console.log(data)

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
        const result = {
          "title": "HarryPotter",
          "author": "JK Rowling",
          "pages": 500
        }
        // Check if current response updated to have output response
        expect(reduxState.reqRes.currentResponse.response.events[0]).to.deep.equal(result)

        // Check if Status updated in reqRes
        const reqResArray = reduxState.reqRes.reqResArray;
        expect(reqResArray[reqResArray.length - 1].response.status).to.equal(200)
      });
    });

    describe('Check if changing between HTTP methods will properly change state', async () => {
      it('Default state method is GET', async () => {
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.newRequestFields.method).to.equal('GET')
      });

      it('Changes method state as the HTTP methods are changed', async () => {
        const methodList = ['POST', 'PUT', 'PATCH', 'DELETE'];
        for (let i = 0; i < methodList.length; i++) {
          method = methodList[i]
          await page.locator('button#rest-method').click();
          await page.locator(`div[id^="composer"] >> a >> text=${method}`).click();
          const reduxState = await page.evaluate(() => window.getReduxState());
          expect(reduxState.newRequestFields.method).to.equal(method)
        }
      });
    });

    describe('Check if sending a request directly will correctly alter state', async () => {
      //& Note to self: 1) use different variables names (not glboals) 2) make sure awaits are in a 'before' or 'it'
      const url2 = 'http://localhost:3004/book';
      const method2 = 'POST';
      const body2 = '{"title": "Geronimo", "author": "Elisabetta Dami", "pages": 100}';
      const result = {
        "title": "Geronimo",
        "author": "Elisabetta Dami",
        "pages": 100
      }

      before(async function () {
        // Clear DB
        // ... (your DB clearing code)

        // Set up the request in the UI
        await page.locator('#url-input').fill(url2);
        await page.locator('button#rest-method').click();
        await page.locator(`div[id^="composer"] >> a >> text=${method2}`).click();
        const codeMirror = await page.locator('#body-entry-select');
        await codeMirror.click();
        const restBody = await codeMirror.locator('.cm-content');
        await restBody.fill(body2);
        await page.locator('#raw-body-type').click();
        await page.locator('.dropdown-item >> text=application/json').click();
      });

      it('Changes currentResponse state directly when selecting Send Request button', async () => {
        // await page.locator('button >> text=Send Request').click();
        await page.locator('button#send-request').click();
        await page.waitForLoadState();
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.reqRes.currentResponse.response.events[0]).to.deep.equal(result)
      });
    });

    describe('Check if stress tests probably changes state', async () => {
      before( async function(){
        // Clear workspace
        await page.locator('button >> text=Clear Workspace').click();
        // Add GET request
        const method2 = 'GET';
        const url2 = 'https://pokeapi.co/api/v2/pokemon/ditto';
        await page.locator('#url-input').fill(url2);
        await page.locator('button >> text=Add to Workspace').click();
        //hide-stress-test
        // Set Freq to 10
        await page.locator('span#view-stress-test').click();
        await page.locator('#frequency-input').fill('10');
        await page.locator('#duration-input').fill('1');
      });
      
      it('Changes currentResponse state to the response back from the stress tests', async () => {
        await page.locator('button#stress-test-run-button').click();
        await new Promise(resolve => setTimeout(resolve, 1500));
        const reduxState = await page.evaluate(() => window.getReduxState());
        expect(reduxState.reqRes.currentResponse.response.events[0].totalSent).to.equal(10);
      });
    });
    // // Template
    // it('template', async () => {

    // });
  }).timeout(20000);
};
