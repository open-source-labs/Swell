const fetch2 = require('node-fetch');
const path = require('path');
const url = require('url');
const cookie = require('cookie');

fetch2('http://192.168.10.112:80/events')
  .then(response => response.body)
  .then(res => res.on('readable', () => {
  let chunk;
  while (null !== (chunk = res.read())) {
      console.log(chunk.toString());
  }
  }))
  .catch(err => console.log(err));