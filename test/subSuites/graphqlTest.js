const chai = require("chai");
const sideBar = require("../pageObjects/Sidebar.js");
const reqRes = require("../pageObjects/ReqRes.js");

const expect = chai.expect;

module.exports = () => {
  describe("GraphQL requests", () => {

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
        await sideBar.graphqlText.keys()
      } catch(err) {
        console.error(err)
      }
    })
  })
}

// query ($code: ID!) {country(code: $code) {capital}}

/* can use variables */
// query:
  //  query ($code: ID!) {
  //   country(code: $code) {
  //     capital
  //     }
  //   }
// variable:
  // {
  //   "code": "AE"
  // }
// result includes "Abu Dhabi"

/* mutations work */
  /* example local API mutation:
  url: http://localhost:4000/graphql
  mutation {
    post(
      url: "www.piedpiper.com"
      description: "Middle-out compression"
    ) {
      url
    }
  }
  */

/* subscriptions work */
/*
subscription {
  newLink {
    id
    description
  }
}
*/

// entering wrong query/mutation will give you the appropriate error message