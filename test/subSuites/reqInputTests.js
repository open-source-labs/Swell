const {_electron: electron} = require('playwright');
const chai = require('chai')
const expect = chai.expect
const path = require('path');
const fs = require('fs-extra');

let electronApp, page;

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



  describe('URL/request method inputs', () => {
    setupFxn();

    it('can view history in the composer pane', async () => { // May refactor since history tab will be a dropdown1
      
      // Click history, confirm history column is active
      await page.locator('a >> text=History').click();
      const historySelected = await page.locator('div[id^="composer"] >> .is-active').innerText();
      expect(historySelected).to.equal('History');

      // Click composer, confirm composer column is active
      await page.locator('a >> text=Composer').click();
      const composerSelected = await page.locator('div#composer >> .is-active').innerText();
      expect(composerSelected).to.equal('Composer');
    });

    it('can switch tabs in the workspace pane', async () => {
      
      // Click saved workspace, confirm column is active
      await page.locator('a >> text=Saved Workspace').click();
      const savedSelected = await page.locator('div#workspace >> .is-active').innerText();
      expect(savedSelected).to.equal('Saved Workspace');

      // Click schedule, confirm column is active
      await page.locator('a >> text=Schedule').click();
      const scheduleSelected = await page.locator('div#workspace >> .is-active').innerText();
      expect(scheduleSelected).to.equal('Schedule');

      // Click requests, confirm column is active
      await page.locator('a >> text=Requests').click();
      const requestsSelected = await page.locator('div#workspace >> .is-active').innerText();
      expect(requestsSelected).to.equal('Requests');
      
    });

    it('can switch tabs in the responses pane', async () => {
      
      // Click headers, confirm column is active
      await page.locator('a >> text=Headers').click();
      const headersSelected = await page.locator('div#responses >> .is-active').innerText();
      expect(headersSelected).to.equal('Headers');

      // Click cookies, confirm column is active
      await page.locator('a >> text=Cookies').click();
      const cookiesSelected = await page.locator('div#responses >> .is-active').innerText();
      expect(cookiesSelected).to.equal('Cookies');

      // Click tests, confirm column is active
      await page.locator('a >> text=Tests').click();
      const testsSelected = await page.locator('div#responses >> .is-active').innerText();
      expect(testsSelected).to.equal('Tests');

      // Click events, confirm column is active
      await page.locator('a >> text=Events').click();
      const eventsSelected = await page.locator('div#responses >> .is-active').innerText();
      expect(eventsSelected).to.equal('Events');
      
    });


    it('can select a request type', async () => {

      await page.locator('button>> text=GRAPHQL').click();
      expect(await page.locator('div#composer-graphql').count()).to.equal(1)

      await page.locator('button>> text=HTTP2').click();
      expect(await page.locator('div#composer-http2').count()).to.equal(1)

      await page.locator('button>> text=GRPC').click();
      expect(await page.locator('div#composer-grpc').count()).to.equal(1)

      await page.locator('button>> text=WEB SOCKET').click();
      expect(await page.locator('div#composer-websocket').count()).to.equal(1)

      await page.locator('button>> text=WEBRTC').click();
      expect(await page.locator('div#composer-webrtc').count()).to.equal(1)

      await page.locator('button>> text=OPENAPI').click();
      expect(await page.locator('div#composer-openapi').count()).to.equal(1)

      await page.locator('button>> text=WEBHOOK').click();
      expect(await page.locator('div#composer-webhook').count()).to.equal(1)
    });

    // WIP code below to check dropdown menu items
      // const getButton = await page.locator('span >> text=GET')
      // expect(getButton).to.exist;

      // await getButton.click()
      // const methodMenuArray = await page.locator('div.dropdown.is-active >> .dropdown-item').allInnerTexts();
      // expect(methodMenuArray).to.include('POST').and.to.include('PUT').and.to.include('PATCH').and.to.include('DELETE')
          // const requestDropdown = await page.locator('.dropdown .is-active');
      // console.log(await requestDropdown.locator('.dropdown-content'))

    it('can select a REST method', async () => { // ************************ REDO THIS TEST, it chains clicks in a bad way ********************

      // Make sure HTTP2 method is selected
      await page.locator('button>> text=HTTP2').click();


      // // click and select POST
      await page.locator('button#rest-method').click();
      await page.locator('div[id^="composer"] >> a >> text=POST').click();
      expect(await page.locator('button.is-rest >> span >> text=POST').count()).to.equal(1);


      // // click and select PUT
      await page.locator('button#rest-method').click();
      await page.locator('div[id^="composer"] >> a >> text=PUT').click();
      expect(await page.locator('button.is-rest >> span >> text=PUT').count()).to.equal(1);

      // // click and select GET
      await page.locator('button#rest-method').click();
      await page.locator('div[id^="composer"] >> a >> text=GET').click();
      expect(await page.locator('button.is-rest >> span >> text=GET').count()).to.equal(1);

      // // click and select PATCH
      await page.locator('button#rest-method').click();
      await page.locator('div[id^="composer"] >> a >> text=PATCH').click();
      expect(await page.locator('button.is-rest >> span >> text=PATCH').count()).to.equal(1);

      // // click and select DELETE
      await page.locator('button#rest-method').click();
      await page.locator('div[id^="composer"] >> a >> text=DELETE').click();
      expect(await page.locator('button.is-rest >> span >> text=DELETE').count()).to.equal(1);
    });


    it('can type url into url input', async () => {
      await page.locator('#url-input').fill('http://jsonplaceholder.typicode.com/posts/1');

      const input = await page.locator('#url-input').inputValue();

      expect(input).to.equal('http://jsonplaceholder.typicode.com/posts/1')
    });
  }).timeout(20000);

  
  describe('REST parameter inputs', async () => { // Add tests for deleting header and checking/unchecking boxes
    setupFxn();
    describe('Header inputs', async () => {
      it('should open headers input, rendering single input at first', async () => {
        // count header rows
        const count = await page.locator('.header-row').count();
        expect(count).to.equal(1);
      });

      it('can add new headers in request', async () => {
        const addHeaderButton = await page.locator('button#add-header');
        expect(await addHeaderButton.count()).to.equal(1);

        await addHeaderButton.click();
        expect(await page.locator('.header-row').count()).to.equal(2);
      });
      
      it('can type in keys & values to headers', async () => {
        await page.locator('#header-row0 >> [placeholder="Key"]').fill('Checking header Key input!');
        await page.locator('#header-row0 >> [placeholder="Value"]').fill('Checking header Value input!');

        const headerKey = await page.locator('#header-row0 >> [placeholder="Key"]').inputValue();
        const headerValue = await page.locator('#header-row0 >> [placeholder="Value"]').inputValue();

        expect(headerKey).to.equal('Checking header Key input!');
        expect(headerValue).to.equal('Checking header Value input!');
      });
    });

    describe('Cookie inputs', async () => {
      it('should open cookies input, rendering single input at first', async () => {
        // count cookie rows
        const count = await page.locator('.cookie-row').count();
        expect(count).to.equal(1);
      });
  
      it('can add new cookies in request', async () => {
        // click add cookie
        const addCookieButton = await page.locator('button#add-cookie');
        expect(await addCookieButton.count()).to.equal(1);

        await addCookieButton.click();
        expect(await page.locator('.cookie-row').count()).to.equal(2);
      });

      it('can type in keys & values to cookies', async () => {
        await page.locator('#cookie-row0 >> [placeholder="Key"]').fill('Checking cookie Key input!');
        await page.locator('#cookie-row0 >> [placeholder="Value"]').fill('Checking cookie Value input!');

        const cookieKey = await page.locator('#cookie-row0 >> [placeholder="Key"]').inputValue();
        const cookieValue = await page.locator('#cookie-row0 >> [placeholder="Value"]').inputValue();

        expect(cookieKey).to.equal('Checking cookie Key input!');
        expect(cookieValue).to.equal('Checking cookie Value input!');
      });
    });

    describe('Request body inputs', () => {
      it('body input appears for non GET requests', async () => {
              // // click and select GET
        await page.locator('button#rest-method').click();
        await page.locator('text=GET').click();
        let bodyInputcount = await page.locator('#body-entry-select').count();
        expect(bodyInputcount).to.equal(0);

        // // click and select POST
        await page.locator('button#rest-method').click();
        await page.locator('div[id^="composer"] >> a >> text=POST').click();

        bodyInputcount = await page.locator('#body-entry-select').count();
        expect(bodyInputcount).to.equal(1);
      });
  
      it('can type plain text into body', async () => {
        const input = 'Team Swell is the best!';
        const bodyInput = await page.locator('div.cm-line');
        await bodyInput.fill(input);
        expect(await page.locator('div.cm-content').innerText()).to.equal(input)
      });
    });
  }).timeout(20000);


};
