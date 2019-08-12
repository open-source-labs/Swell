const express = require('express');
const app = express();
const port = 7000;
require('es6-promise').polyfill()
require('isomorphic-fetch');

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


app.get('/',(req,res,next)=>{
  // console.log(req)
  fetch(req.headers.url)
  .then((response)=>{
    return [response.headers, response.json()]
  })
  .then((gotJsonResponses)=>{
    gotJsonResponses[1].then((pro)=>{
      // console.log(pro)
      res.send({headers:gotJsonResponses[0], body:pro})
    })
  })
  
})

app.listen(port,()=>{
  console.log(`app is listening on ${port}`)
})