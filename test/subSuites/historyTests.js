const assert = require('assert'); 
const sideBar = require('../pageObjects/Sidebar.js'); 
const app = require('../testApp.js')

module.exports = () => {
  describe('CRUD/History functionality', function(){
    
    describe('URL/request method inputs', () => {
      it('can type url into url input', async () => {
        await sideBar.url.addValue('pokeapi.co/api/v2/pokemon?limit=5');
        const input = await sideBar.url.getValue();
    
        return assert.strictEqual(input, 'http://pokeapi.co/api/v2/pokemon?limit=5');
      });
  
      it('can select a request method', async () => {
        await sideBar.requestMethod.click();
        await sideBar.choosePost.click();
        let isSelected = await sideBar.choosePost.isSelected();
        assert.strictEqual(isSelected, true); 
  
        await sideBar.requestMethod.click();
        await sideBar.chooseGet.click();
        isSelected = await sideBar.chooseGet.isSelected();
        assert.strictEqual(isSelected, true);
      });
    })

    describe('headers inputs', async () => {
      let headers;
      let headerChecked; 

      it('should open headers input, rendering single input at first', async () => {
        await sideBar.activateHeaders.click();
        headers = await sideBar.headers;
        assert.strictEqual(headers.length, 1); 
      }); 

      it('new headers initialize as un-checked', async () => {
        headerChecked = await sideBar.firstHeaderCheckbox.isSelected();
        assert.strictEqual(headerChecked, false)
      })

      it('can type new headers in request', async () => {
        await sideBar.headerKey.addValue('testing');
        const headerKey = await sideBar.headerKey.getValue();
        assert.strictEqual(headerKey, 'testing'); 
  
        await sideBar.headerValue.addValue('true'); 
        const headerValue = await sideBar.headerValue.getValue();
        assert.strictEqual(headerValue, 'true'); 
  
      });

      it('header is checked after input', async () => {
        isSelected = await sideBar.firstHeaderCheckbox.isSelected();
        assert.strictEqual(isSelected, true);
      });



      // NOTE : THIS WILL FAIL FOR NOW, THIS IS UI DETAIL THAT NEEDS TO BE IMPLEMENTED IN FUTURE
      // it('deleting text in input eliminates checkmark', async () => {
      //   await sideBar.headerKey.clearValue();
      //   await sideBar.headerValue.clearVAlue();
      //   headerChecked = await sideBar.headerCheckbox.isSelected();
      //   assert.strictEqual(headerChecked, false);
      // })

      it('creates new input fields for new header when header is added', async () => {
        await sideBar.addHeader.click();
        headers = await sideBar.headers; 
        assert.strictEqual(headers.length, 2);
      });

      it('can uncheck a header after creating it', async () => {
        await sideBar.firstHeaderCheckbox.click(); 
        isSelected = await sideBar.firstHeaderCheckbox.isSelected();
        assert.strictEqual(isSelected, false);
      })
    })

  });
}