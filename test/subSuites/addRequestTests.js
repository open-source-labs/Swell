const assert = require('assert'); 
const fs = require('fs');
const path = require('path');
const sideBar = require('../pageObjects/Sidebar.js'); 
const app = require('../testApp');


module.exports = () => {
  describe('Add New Request Button', () => {
    let value; 
    let headers;
    let isChecked;
    let cookies;
    
    
    describe('inputs reset when new request button is clicked', () => {
      
      before(async function() {
        await sideBar.addRequestBtn.click();
      })
      
      it('url input resets', async () => {
        value = await sideBar.url.getValue(); 
        assert.strictEqual(value, 'http://');
      });

      it('custom headers disappear', async () => {
        await sideBar.activateHeaders.click();
        headers = await sideBar.headers;
        assert.strictEqual(headers.length, 1);
      });
      
      it('header inputs reset', async () => {
        value = await sideBar.headerKey.getValue();
        assert.strictEqual(value, ''); 
        value = await sideBar.headerValue.getValue();
        assert.strictEqual(value, '');
        isChecked = await sideBar.firstHeaderCheckbox.isSelected();
        assert.strictEqual(isChecked, false); 
      });

      it('custom cookies disappear', async () => {
        await sideBar.activateCookies.click();
        cookies = await sideBar.cookies;
        assert.strictEqual(cookies.length, 1);
      });

      it('cookie fields reset', async () => {
        value = await sideBar.cookieKey.getValue();
        assert.strictEqual(value, ''); 
        value = await sideBar.cookieValue.getValue();
        assert.strictEqual(value, '');
        isChecked = await sideBar.firstCookieCheckbox.isSelected();
        assert.strictEqual(isChecked, false); 
      });

      it("take a snapshot of app", async () => {
        const imageBuffer = await app.browserWindow.capturePage();
        fs.writeFileSync(path.resolve(__dirname, "addedReq.png"), imageBuffer);
      });
      
    })
  })
}