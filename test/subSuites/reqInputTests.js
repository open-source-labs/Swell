const assert = require('assert'); 
const sideBar = require('../pageObjects/Sidebar.js'); 
const app = require('../testApp.js');


module.exports = () => {
  describe('URL/request method inputs', () => {

    it('can switch tabs in the composer pane', async () => {
      // click and check history
      await sideBar.tabsHistory.click();
      const historySelected = await app.client.$(".is-active").getText();
      assert.strictEqual(historySelected, "History");
      
      // click and check composer
      await sideBar.tabsComposer.click();
      const composerSelected = await app.client.$(".is-active").getText();
      return assert.strictEqual(composerSelected, "Composer");
    });

    it('can select a request type', async () => {
      // click and check graphQL
      await sideBar.selectedNetwork.click();
      await app.client.$('a=GRAPHQL').click();
      assert.strictEqual(await sideBar.selectedNetwork.getText(), "GRAPHQL");

      // click and check WS
      await sideBar.selectedNetwork.click();
      await app.client.$('a=WEB SOCKETS').click();
      assert.strictEqual(await sideBar.selectedNetwork.getText(), "WEB SOCKETS");

      // click and check gRPC
      await sideBar.selectedNetwork.click();
      await app.client.$('a=gRPC').click();
      assert.strictEqual(await sideBar.selectedNetwork.getText(), "gRPC");

      // click and check REST
      await sideBar.selectedNetwork.click();
      await app.client.$('a=REST').click();
      return assert.strictEqual(await sideBar.selectedNetwork.getText(), "REST");
    });

    it('can select a REST method', async () => {
      // click and select POST
      await app.client.$('span=GET').click();
      await app.client.$('a=POST').click();
      assert.notEqual(await app.client.$('span=POST'), null);

      // click and select PUT
      await app.client.$('span=POST').click();
      await app.client.$('a=PUT').click();
      return assert.notEqual(await app.client.$('span=PUT'), null);
    });

    it('can type url into url input', async () => {
      await sideBar.url.setValue('http://jsonplaceholder.typicode.com/posts/1');
      const input = await sideBar.url.getValue();
  
      return assert.strictEqual(input, 'http://jsonplaceholder.typicode.com/posts/1');
    });
  })

  xdescribe('headers inputs', async () => {
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
    });
  });

  xdescribe('cookies inputs', async () => {
    let cookies;
    let cookieChecked; 

    it('should open cookies input, rendering single input at first', async () => {
      await sideBar.activateCookies.click();
      cookies = await sideBar.cookies;
      assert.strictEqual(cookies.length, 1); 
    }); 

    it('new cookies initialize as un-checked', async () => {
      cookieChecked = await sideBar.firstCookieCheckbox.isSelected();
      assert.strictEqual(cookieChecked, false)
    })

    it('can type new cookies in request', async () => {
      await sideBar.cookieKey.addValue('testing');
      const cookieKey = await sideBar.cookieKey.getValue();
      assert.strictEqual(cookieKey, 'testing'); 

      await sideBar.cookieValue.addValue('true'); 
      const cookieValue = await sideBar.cookieValue.getValue();
      assert.strictEqual(cookieValue, 'true'); 

    });

    it('cookie is checked after input', async () => {
      isSelected = await sideBar.firstCookieCheckbox.isSelected();
      assert.strictEqual(isSelected, true);
    });

    it('creates new input fields for new cookie when cookie is added', async () => {
      cookies = await sideBar.cookies; 
      assert.strictEqual(cookies.length, 2);
    });

    it('can uncheck a cookie after creating it', async () => {
      await sideBar.firstCookieCheckbox.click(); 
      isSelected = await sideBar.firstCookieCheckbox.isSelected();
      assert.strictEqual(isSelected, false);
    });
  });

  xdescribe('request body inputs', () => {
    let bodyInputVisible; 
    let btnClass; 
    let body; 
    let prettyPrintVisible; 

    it('body input appears for POST requests', async () => {
      await sideBar.requestMethod.click();
      await sideBar.choosePost.click();
      bodyInputVisible = await sideBar.bodyInput.isExisting();
      assert.strictEqual(bodyInputVisible, true);
    });

    it('data format defaults to "Raw", other buttons remain unselected ', async () => {
      const selectedClass = 'composer_bodytype_button composer_bodytype_button-selected';
      const unselectedClass = 'composer_bodytype_button';

      btnClass = await sideBar.rawBtn.getAttribute('class');
      assert.strictEqual(btnClass, selectedClass);

      btnClass = await sideBar.urlencodedBtn.getAttribute('class');
      assert.strictEqual(btnClass, unselectedClass);

      btnClass = await sideBar.noneBtn.getAttribute('class');
      assert.strictEqual(btnClass, unselectedClass);
    });

    it('can type plain text into body', async () => {
      const input = 'Team Swoll is the best!'; 
      await sideBar.bodyInput.addValue(input);
      body = await sideBar.bodyInput.getValue();
      assert.strictEqual(body, input);
    });

    it('can change content-type to JSON', async () => {
      await sideBar.contentTypeBtn.click();
      await sideBar.chooseJSON.click();
      const isSelected = await sideBar.chooseJSON.isSelected(); 
      assert.strictEqual(isSelected, true);
    });

    it('rejects invalid JSON', async () => {
      const invalidClass = "composer_textarea composer_textarea-error"; 
      const jsonStatus = await sideBar.bodyInput.getAttribute('class'); 
      assert.strictEqual(jsonStatus, invalidClass); 
    });

    it('user cannot prettify invalid JSON', async () => {
      prettyPrintVisible = await app.client.isVisible('.composer_pretty_print');
      assert.strictEqual(prettyPrintVisible, false);
    })

    it('content-type JSON defaults to empty brackets', async () => {
      await sideBar.bodyInput.click();
      // execute a backspace 23 times (to clear the input as a user would)
      const deletes = [];
      let i = 0; 
      while (i < 23) {
         deletes.push(app.client.keys('Back space'));
         i++;
      }
      // working like Promise.all, so that all the individual backspaces can finish
      await deletes; 
      body = await sideBar.bodyInput.getValue();
      assert.strictEqual(body, '{}');
    }); 

    it('gives user option to prettify valid json', async () => {
      const validJSON = `"Team Swoll":"The Absolute BEST!!","$w0llh@acker420 is the GOAT":"true"`;
      // move in between brackets
      await app.client.keys('Left arrow'); 
      await sideBar.bodyInput.addValue(validJSON);
      // .isVisible is what .isDisplayed is in webdriver v.6
      prettyPrintVisible = await app.client.isVisible('.composer_pretty_print');
      assert.strictEqual(prettyPrintVisible, true);
    });

    it('clicking prettify text prettifies the JSON', async () => {
      const validJSON = '{"Team Swoll":"The Absolute BEST!!","$w0llh@acker420 is the GOAT":"true"}';
      // this is how json is prettified on front end -- null means entire input is included, 4 says how to space JSON string
      const prettyJSON = JSON.stringify(JSON.parse(validJSON), null, 4); 
      await sideBar.prettyJSON.click();
      body = await sideBar.bodyInput.getValue();
      assert.strictEqual(body, prettyJSON)
    })
  });
  
};