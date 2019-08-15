const express = require('express');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const app = express();
const port = 7000;

// 1 get both the headers AND api content from the request by fetching to "/" aka (localhost:7000) from swell
// 2 Swell hits the "/"" endpoint and recieve san array containing headers(response.headers), readable api content(response.json() and raw response data(response))  
// 3 Swell now has access to unfiltered headers and both a parsed and unparsed version of the api response content

app.get('/', (req, res) => {
  fetch(req.headers.url, {
    headers: {
      cookie: req.headers.cookie
    }
  })
    .then((response) => {
      const [contentType] = response.headers._headers['content-type'];
      const { headers } = response;
      const contents = /json/.test(contentType) ? response.json() : response.text();
      contents.then((body) => {
        return res.send({
          headers,
          body,
        });
      });
    });
});

app.listen(port, () => console.log(`App is listening on ${port}`));
