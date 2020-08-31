const chai = require("chai");
const { collapseTextChangeRangesAcrossMultipleVersions } = require("typescript");
const sideBar = require("../pageObjects/Sidebar.js");
const reqRes = require("../pageObjects/ReqRes.js");

const expect = chai.expect;

module.exports = () => {
  describe("GraphQL requests", () => {

    const backspace = [];
    for (let i = 0; i < 22; i += 1) {
      backspace.push('Backspace')
    }

    const backspace2 = [];
    for (let i = 0; i < 90; i += 1) {
      backspace2.push('Backspace')
    }

    it("it should be able to introspect the schema", async () => {
      try {
        await sideBar.graphQL.click();
        await sideBar.url.setValue("https://countries.trevorblades.com/");
        await sideBar.schemaOpen.click();
        await sideBar.introspect.click();
        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const introspectionResult = await sideBar.introspectionText.getText();
              expect(introspectionResult).to.include(`languages: [Language!]!`);
              resolve();
            } catch(err) {
              console.error(err)
            }
          }, 2000)
        });
      } catch(err) {
        console.error(err)
      }
    });

    it("it should create queries using the schema-hinter", async () => {
      try {
        await sideBar.graphqlText.keys(['ArrowUp', 'Tab', 'Enter', ' {', 'n', 'Enter']);
        await sideBar.addRequestBtn.click();
        await reqRes.sendBtn.click();
        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const statusCode = await reqRes.statusCode.getText();
              const jsonPretty = await reqRes.jsonPretty.getText();
              expect(statusCode).to.equal("Status: 200");
              expect(jsonPretty).to.include("Africa");
              resolve();
            } catch(err) {
              console.error(err)
            }
          }, 2000);
        })
      } catch(err) {
        console.error(err)
      }
    });

    it("it should create queries using variables", async () => {
      try {
        await reqRes.removeBtn.click();
        await sideBar.graphqlText.keys(backspace);
        await sideBar.graphqlText.keys('($code: ID!) {country(code: $code) {capital}}');
        await sideBar.variableOpen.click();
        await sideBar.graphqlVariable.keys('{"code": "AE"}');
        await sideBar.addRequestBtn.click();
        await reqRes.sendBtn.click();
        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const statusCode = await reqRes.statusCode.getText();
              const jsonPretty = await reqRes.jsonPretty.getText();
              expect(statusCode).to.equal("Status: 200");
              expect(jsonPretty).to.include("Abu Dhabi");
              resolve();
            } catch(err) {
              console.error(err)
            }
          }, 2000);
        })
      } catch(err) {
        console.error(err)
      }
    });

    it("it should work with mutations", async () => {
      try {
        await reqRes.removeBtn.click();
        await sideBar.chooseMutation.click();
        await sideBar.url.setValue("http://localhost:4000/graphql");
        await sideBar.graphqlVariable.keys(backspace);
        await sideBar.graphqlText.keys(backspace2);
        await sideBar.graphqlText.keys('mutation {post(url: "www.piedpiper.com" description: "Middle-out compression") {url}}');
        await sideBar.addRequestBtn.click();
        await reqRes.sendBtn.click();
        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const statusCode = await reqRes.statusCode.getText();
              const jsonPretty = await reqRes.jsonPretty.getText();
              expect(statusCode).to.equal("Status: 200");
              expect(jsonPretty).to.include("www.piedpiper.com");
              resolve();
            } catch(err) {
              console.error(err)
            }
          }, 2000);
        })
      } catch(err) {
        console.error(err)
      }
    })

    it("it should work with subscriptions", async () => {
      await reqRes.removeBtn.click();
      await sideBar.chooseSubscription.click();
      await sideBar.graphqlText.keys(backspace2);
      await sideBar.graphqlText.keys('subscription {newLink {id description}}');
      await sideBar.addRequestBtn.click();
      await reqRes.sendBtn.click();
      await sideBar.chooseMutation.click();
      await sideBar.graphqlText.keys(backspace2);
      await sideBar.graphqlText.keys('mutation {post(url: "www.gavinbelson.com" description: "Tethics") {url}}');
      await sideBar.addRequestBtn.click();
      await reqRes.sendBtn.click();
      await reqRes.mutationRemoveBtn.click();
      await new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const statusCode = await reqRes.statusCode.getText();
            const jsonPretty = await reqRes.jsonPretty.getText();
            expect(statusCode).to.equal("Status: 200");
            expect(jsonPretty).to.include("Tethics");
            resolve();
          } catch(err) {
            console.error(err)
          }
        }, 3000);
      })
    })
  })
}

// entering wrong query/mutation will give you the appropriate error message