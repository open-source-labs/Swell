const {_electron: electron} = require('playwright');
const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');
const fs = require('fs');

let electronApp, page, num=0;

module.exports = () => {

  const setupFxn = function() {
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
      page = electronApp.windows()[0]; // In case there is more than one window
      await page.waitForLoadState(`domcontentloaded`);
    });
    
    // close Electron app when complete
    after(async () => {
      await electronApp.close();
    });

    afterEach(async function() {
      if (this.currentTest.state === 'failed') {
        console.log(`Screenshotting failed test window`)
        const imageBuffer = await page.screenshot();
        fs.writeFileSync(path.resolve(__dirname + '/../failedTests', `FAILED_${this.currentTest.title}.png`), imageBuffer)
      }
    });
  }


  describe('HTTP/S requests', () => {
    setupFxn();

    const fillRestRequest = async (
      url,
      method,
      body = '',
      headers = [],
      cookies = []
    ) => {
      try {
        // click and check REST
        await page.locator('#selected-network').click();
        await page.locator('a >> text=REST').click();

        // click and select METHOD if it isn't GET
        if (method !== 'GET') {
          await page.locator('#composer >> button.is-rest').click();
          await page.locator(`a >> text=${method}`).click();
        }

        // type in url
        await page.locator('.input-is-medium').fill(url);

        // set headers
        headers.forEach(async ({ key, value }, index) => {
          await page.locator(`#header-row${index} >> [placeholder="Key"]`).fill(key);
          await page.locator(`#header-row${index} >> [placeholder="Value"]`).fill(value);
          await page.locator('button:near(:text("Headers"), 5)').click();
        });

        // set cookies
        cookies.forEach(async ({ key, value }, index) => {
          await page.locator(`#cookie-row${index} >> [placeholder="Key"]`).fill(key);
          await page.locator(`#cookie-row${index} >> [placeholder="Value"]`).fill(value);
          await page.locator('button:near(:text("Cookies"), 5)').click();
        });

        // Add BODY as JSON if it isn't GET
        if (method !== 'GET') {
          // select body type JSON
          await page.locator('span >> text=text/plain').click();
          await page.locator('a >> text=application/json').click();
          // insert JSON content into body
          const codeMirror = await page.locator('#body-entry-select');
          await codeMirror.click();
          const restBody = await codeMirror.locator('textarea');

          try {
            for (let i = 0; i < 100; i += 1) {
              await restBody.press('Backspace');
            }
            await restBody.fill(body);
          } catch (err) {
            console.error(err);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    const addAndSend = async (num) => {
      try {
        await page.locator('button >> text=Add to Workspace').click();
        await page.locator(`#send-button-${num}`).click();
      } catch (err) {
        console.error(err);
      }
    };

    describe('public API', () => {
      it('it should GET information from a public API', async () => {
        try {
          // TEST GET Request from JSON Placeholder
          const url = 'http://jsonplaceholder.typicode.com/posts';
          const method = 'GET';
          await fillRestRequest(url, method);
          await addAndSend(num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page.locator('#events-display >> .CodeMirror-code').innerText();
              expect(statusCode).to.equal('200');
              expect(events.slice(1, 100)).to.include('userId');
              resolve();
            }, 1000)
          );
        } catch (err) {
          console.error(err);
        }
      });
    });

    /** *************** !! FOR BELOW TO WORK, YOU MUST ADD YOUR OWN MONGO URI TO A .ENV FILE WITH (MONGO_URI = "YOUR_URI") !! **************** */
    describe('httpTest Server', () => {
      before('CLEAR DB', (done) => {
        chai
          .request('http://localhost:3000')
          .get('/clear')
          .end((err, res) => {
            done(); // <= Call done to signal callback end
          });
      });

      after('CLEAR DB', (done) => {
        chai
          .request('http://localhost:3000')
          .get('/clear')
          .send()
          .end((err, res) => {
            done(); // <= Call done to signal callback end
          });
      });

      it('it should GET information from an http test server', async () => {
        try {
          const url = 'http://localhost:3000/book';
          const method = 'GET';
          await fillRestRequest(url, method);
          await addAndSend(num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page.locator('#events-display >> .CodeMirror-code').innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('[]');
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
      });

      it('it should POST to local http test server', async () => {
        try {
          const url = 'http://localhost:3000/book';
          const method = 'POST';
          const body =
            '"title": "HarryPotter", "author": "JK Rowling", "pages": 500}';
          await fillRestRequest(url, method, body);
          await addAndSend(num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page.locator('#events-display >> .CodeMirror-code').innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('JK Rowling');
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
      });

      it('it should PUT to local http test server', async () => {
        try {
          const url = 'http://localhost:3000/book/HarryPotter';
          const method = 'PUT';
          const body = '"author": "Ron Weasley", "pages": 400}';
          await fillRestRequest(url, method, body);
          await addAndSend(num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page.locator('#events-display >> .CodeMirror-code').innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('Ron Weasley');
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
      });

      it('it should PATCH to local http test server', async () => {
        try {
          const url = 'http://localhost:3000/book/HarryPotter';
          const method = 'PATCH';
          const body = '"author": "Hermoine Granger"}';
          await fillRestRequest(url, method, body);
          await addAndSend(num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page.locator('#events-display >> .CodeMirror-code').innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('Hermoine Granger'); // someone didnt know how to spell :/
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
      });

      it('it should DELETE to local http test server', async () => {
        // DELETE HARRYPOTTER
        try {
          const url = 'http://localhost:3000/book/HarryPotter';
          const method = 'DELETE';
          await fillRestRequest(url, method);
          await addAndSend(num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page.locator('#events-display >> .CodeMirror-code').innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('Hermoine Granger');
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
        // CHECK TO SEE IF IT IS DELETED
        try {
          const url = 'http://localhost:3000/book';
          const method = 'GET';
          await fillRestRequest(url, method);
          await addAndSend(num++);
          await new Promise((resolve) =>
            setTimeout(async () => {
              const statusCode = await page.locator('.status-tag').innerText();
              const events = await page.locator('#events-display >> .CodeMirror-code').innerText();
              expect(statusCode).to.equal('200');
              expect(events).to.include('[]');
              resolve();
            }, 500)
          );
        } catch (err) {
          console.error(err);
        }
      });
    });
  });
};
