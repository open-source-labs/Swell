const http2 = require('http2');
const fs = require('fs');
const CERT_PATH = 'test/HTTP2_cert.pem';
const PRIV_PATH = 'test/HTTP2_private.pem';

let count = 0;

const server = http2.createSecureServer({
  cert: fs.readFileSync(CERT_PATH),
  key: fs.readFileSync(PRIV_PATH),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {

  // respond with stream if request accepts stream in headers
  if (headers.accept && headers.accept.includes('stream')) {
    stream.respond({
      'content-type': 'text/event-stream; charset=utf-8',
      ':status': 200
    });
    return go(stream);
  }
  
  // else send a single event
  stream.respond({
    'content-type': 'application/json; charset=utf-8',
    ':status': 200
  });
  stream.end(JSON.stringify({data: 'hello and goodbye'}));
});

const go = (stream) => {
  if (++count > 10) {
    stream.end(`id: ${count}\nevent: testMessage\ndata: goodbye\n\n`);
    count = 0;
    return;
  }
  
  stream.write(`id: ${count}\nevent: testMessage\ndata: hello\n\n`);
  setTimeout(() => go(stream), 500);
}

server.listen(8443, () => console.log('server up on 8443'));