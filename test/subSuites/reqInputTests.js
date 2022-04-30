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

    it('can switch tabs in the composer pane', async () => { // May refactor since history tab will be a dropdown1
      
      // Click history, confirm history column is active
      await page.locator('a >> text=History').click();
      const historySelected = await page.locator('div#composer >> .is-active').innerText();
      expect(historySelected).to.equal('History');

      // Click composer, confirm composer column is active
      await page.locator('a >> text=Composer').click();
      const composerSelected = await page.locator('div#composer >> .is-active').innerText();
      expect(composerSelected).to.equal('Composer');
    });


    it('can select a request type', async () => {
      // possibly remove the first clicks based on button vs dropdown menu
      await page.locator('#selected-network').click();
      await page.locator('a >> text=GRAPHQL').click();
      expect(await page.locator('#selected-network').innerText()).to.equal('GRAPHQL')

      await page.locator('#selected-network').click();
      await page.locator('a >> text=REST').click();
      expect(await page.locator('#selected-network').innerText()).to.equal('REST')

      await page.locator('#selected-network').click();
      await page.locator('a >> text=gRPC').click();
      expect(await page.locator('#selected-network').innerText()).to.equal('gRPC')

      await page.locator('#selected-network').click();
      await page.locator('a >> text=WEB SOCKETS').click();
      expect(await page.locator('#selected-network').innerText()).to.equal('WEB SOCKETS')

      await page.locator('#selected-network').click();
      await page.locator('a >> text=WebRTC').click();
      expect(await page.locator('#selected-network').innerText()).to.equal('WebRTC')

      await page.locator('#selected-network').click();
      await page.locator('a >> text=OpenAPI').click();
      expect(await page.locator('#selected-network').innerText()).to.equal('OpenAPI')

      await page.locator('#selected-network').click();
      await page.locator('a >> text=WebHook').click();
      expect(await page.locator('#selected-network').innerText()).to.equal('WebHook')
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

      // Make sure REST method is selected
      await page.locator('#selected-network').click();
      await page.locator('a >> text=REST').click();

      // // click and select POST
      await page.locator('span >> text=GET').click();
      await page.locator('a >> text=POST').click();
      expect(await page.locator('button.is-rest >> span >> text=POST').count()).to.equal(1);


      // // click and select PUT
      await page.locator('span >> text=POST').click();
      await page.locator('a >> text=PUT').click();
      expect(await page.locator('button.is-rest >> span >> text=PUT').count()).to.equal(1);

      // // click and select GET
      await page.locator('span >> text=PUT').click();
      await page.locator('a >> text=GET').click();
      expect(await page.locator('button.is-rest >> span >> text=GET').count()).to.equal(1);

      // // click and select PATCH
      await page.locator('span >> text=GET').click();
      await page.locator('a >> text=PATCH').click();
      expect(await page.locator('button.is-rest >> span >> text=PATCH').count()).to.equal(1);

      // // click and select DELETE
      await page.locator('span >> text=PATCH').click();
      await page.locator('a >> text=DELETE').click();
      expect(await page.locator('button.is-rest >> span >> text=DELETE').count()).to.equal(1);
    });


    it('can type url into url input', async () => {
      await page.locator('.input-is-medium').fill('http://jsonplaceholder.typicode.com/posts/1');

      const input = await page.locator('.input-is-medium').inputValue();

      expect(input).to.equal('http://jsonplaceholder.typicode.com/posts/1')
    });
  });

  
  describe('REST parameter inputs', async () => { // Add tests for deleting header and checking/unchecking boxes
    setupFxn();
    describe('Header inputs', async () => {
      it('should open headers input, rendering single input at first', async () => {
        // count header rows
        const count = await page.locator('.header-row').count();
        expect(count).to.equal(1);
      });

      it('can add new headers in request', async () => {
        // click add header (specifically the button immediately to the right of the "header" title)
        const addHeaderButton = await page.locator('button:near(:text("Headers"), 5)');
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
        const addCookieButton = await page.locator('button:near(:text("Cookies"), 5)');
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
        let bodyInputcount = await page.locator('#body-entry-select').count();
        expect(bodyInputcount).to.equal(0);

        // // click and select POST
        await page.locator('span >> text=GET').click();
        await page.locator('a >> text=POST').click();

        bodyInputcount = await page.locator('#body-entry-select').count();
        expect(bodyInputcount).to.equal(1);
      });
  
      it('can type plain text into body', async () => {
        const input = 'Team Swell is the best!';
        const bodyInput = await page.locator('#body-entry-select >> textarea');
        await bodyInput.fill(input);
        expect(await page.locator('div.CodeMirror-code >> span').innerText()).to.equal(input)
      });
    });
  });


};
