const chai = require("chai");
const sideBar = require("../pageObjects/Sidebar.js");
const reqRes = require("../pageObjects/ReqRes.js");

// schema introspection works
// can use schema-hinter for queries
// queries work
  /* example public API query:
  url: https://countries.trevorblades.com
  query {
    Country(code: "AE") {
      capital{name}
    }
  }
  */
   /* example local API query:
  url: http://localhost:4000/graphql
  query {
    feed {
      id
      url
      description
    }
  }
  */
// mutations work
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
// subscriptions work
/*
subscription {
  newLink {
    id
    description
  }
}
*/
// entering wrong query/mutation will give you the appropriate error message
// can use variables