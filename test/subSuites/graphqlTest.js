const chai = require("chai");
const sideBar = require("../pageObjects/Sidebar.js");
const reqRes = require("../pageObjects/ReqRes.js");
const graphqlServer = require('../graphqlServer')

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

    const addAndSend = async () => {
      try {
        await sideBar.addRequestBtn.click();
        await reqRes.sendBtn.click();
      } catch(err) {
        console.error(err)
      }
    }

    const clearAndAddKeys = async (backspace, keys) => {
      try {
        await sideBar.graphqlText.keys(backspace);
        await sideBar.graphqlText.keys(keys);
      } catch(err) {
        console.error(err)
      }
    }

    after(() => {
      try {
        graphqlServer.close();
         console.log('graphqlServer closed')
      } catch(err) {
        console.error(err)
      }
    })

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
          }, 3000)
        });
      } catch(err) {
        console.error(err)
      }
    });

    it("it should create queries using the schema-hinter", async () => {
      try {
        await reqRes.removeBtn.click();
        await sideBar.graphqlText.keys(['ArrowUp', 'Tab', 'Enter', ' {', 'n', 'Enter']);
        await addAndSend();
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
        await clearAndAddKeys(backspace, '($code: ID!) {country(code: $code) {capital}}');
        await sideBar.variableOpen.click();
        await sideBar.graphqlVariable.keys('{"code": "AE"}');
        await addAndSend();
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

    it("it should give you the appropriate error message with incorrect queries", async () => {
      try {
        await reqRes.removeBtn.click();
        await sideBar.url.setValue("http://localhost:4000/graphql");
        await sideBar.graphqlVariable.keys(backspace);
        await clearAndAddKeys(backspace2, 'query {feed {descriptions}}');
        await addAndSend();
        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const statusCode = await reqRes.statusCode.getText();
              const jsonPretty = await reqRes.jsonPretty.getText();
              expect(statusCode).to.equal("Status: 400");
              expect(jsonPretty).to.include(`GRAPHQL_VALIDATION_FAILED`);
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

    it("it should work with mutations", async () => {
      try {
        await reqRes.removeBtn.click();
        await sideBar.chooseMutation.click();
        await clearAndAddKeys(backspace2, 'mutation {post(url: "www.piedpiper.com" description: "Middle-out compression") {url}}');
        await addAndSend();
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
      try {
        await reqRes.removeBtn.click();
        await sideBar.chooseSubscription.click();
        await clearAndAddKeys(backspace2, 'subscription {newLink {id description}}');
        await addAndSend();
        await sideBar.chooseMutation.click();
        await clearAndAddKeys(backspace2, 'mutation {post(url: "www.gavinbelson.com" description: "Tethics") {url}}');
        await addAndSend();
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
      } catch (err) {
        console.error(err);
      };
    })
  })
}

// entering wrong query/mutation will give you the appropriate error message