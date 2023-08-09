const { _electron: electron } = require('playwright');
const pwTest = require('@playwright/test');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');
const {
  fillGQLRequest,
  addAndSend,
  clearAndFillTestScriptArea,
} = require('./testHelper');

let electronApp,
  page,
  num = 0;

module.exports = () => {
  describe('GraphQL Integration Tests', function() {
    // open Electron App
    before(async () => {
      electronApp = await electron.launch({ args: ['main.js'] });
    });

    // close Electron app
    after(async () => {
      await electronApp.close();
    })
    
  })
};