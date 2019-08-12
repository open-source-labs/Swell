const express = require('express');
const app = express();
const port = 7000;
require('es6-promise').polyfill()
require('isomorphic-fetch');


// //--------------------------------------------------------------------

// // THE TWO FETCH METHOD. Possibly will slow roundtrip This method will:

// // 1 get the headers from the request first by fetching to /getHead from swell
// // 2 Swell hits the /getHead endpoint and recieves the headers
// // 3 Inside of a .then promise within swell, swell then makes another fetch and hits the "/" endpoint
// // 4 Swell gets the api response data from the Fetch at "/"  
// // 5 Swell now has access to unfiltered headers and the response content



// //--------------------------------------------------------------------

// //--------------------------------------------------------------------
// //Fetching regular response data from passed url via Http 1
// //--------------------------------------------------------------------

// app.get('/',(req,res,next)=>{
//   console.log(req)
//   fetch(req.headers.url)
//   .then((response)=>{
//     return response.json() //turn response object into readable json
//   })
//   .then((jsonResponse)=>{
//     res.send(jsonResponse)//give swell the api data user wants
//   })
// })
// //--------------------------------------------------------------------
// //Fetching headers from passed url via Http 1
// //--------------------------------------------------------------------

// app.get('/getHead',(req,res,next)=>{
//   console.log(req.headers.url)
//   fetch(req.headers.url) //Here, url is a custom header that we passed to this fetch when we make a request to this endpoint in our swell controller. Now that this server.js's fetch has access to the swell query url we can fetch data here,in a node/express environment, without having to deal with chromium cors behavior.(useful for getting all headers when using http1)  
//   .then((response)=>{
//     console.log(response.headers)
//     res.send(response.headers)
//   })
// })

// //--------------------------------------------------------------------

// // THE ONE FETCH METHOD. Is breaking http SSE-(sse1 and sse3 from the test server) This method will:

// // 1 get both the headers AND api content from the request by fetching to "/" aka (localhost:7000) from swell
// // 2 Swell hits the "/"" endpoint and recievesan array containing headers(response.headers) and readable api content(response.json())  
// // 3 Swell now has access to unfiltered headers and the response content

// //--------------------------------------------------------------------


app.get('/',(req,res,next)=>{
  fetch(req.headers.url)//fetch to url that was passed here from swell as a request header
  .then((response)=>{
    return [response.headers, response.json()]//return the headers and api content as a single array
  })
  .then((gotJsonResponses)=>{
    gotJsonResponses[1].then((pro)=>{//this .then is used to parse response.json()
      res.send({headers:gotJsonResponses[0], body:pro})//send the headers and readable api content as an object to swell
    })
  })
  
})

app.listen(port,()=>{
  console.log(`app is listening on ${port}`)
})