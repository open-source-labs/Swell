const chai = require("chai");
const sideBar = require("../pageObjects/Sidebar.js");
const reqRes = require("../pageObjects/ReqRes.js");

// schema introspection works
// queries work
/* example query:
url: https://countries.trevorblades.com
query {
  Country(code: "AE") {
    capital{name}
  }
}
*/
// can use schema-hinter for queries
// mutations work
// subscriptions work
// entering wrong query will give you the appropriate error message
// can use variables