const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const CERT_PATH = path.join(__dirname, '/HTTP2_cert.pem');
const PRIV_PATH = path.join(__dirname, 'HTTP2_private.pem');

const server = http2.createSecureServer({
  cert: fs.readFileSync(CERT_PATH),
  key: fs.readFileSync(PRIV_PATH),
});

server.on('error', (err) => console.error(err));

const dispatch = (stream, headers, body = '') => {
  // respond with SSE stream if request accepts stream in headers
  if (headers.accept && headers.accept.includes('stream')) {
    sendStreamToClient(stream, body);
    return;
  }

  // else send a single event
  stream.respond({
    'content-type': 'application/json; charset=utf-8',
    ':status': 200,
  });
  stream.end(JSON.stringify({ data: `hello and goodbye${body}` }));
};

server.on('stream', (stream, headers) => {
  // dispatch async if there's a body
  if (headers[':method'] !== 'GET') {
    stream.on('data', (chunk) => {
      dispatch(stream, headers, `- ${chunk}`);
    });
  } else {
    // otherwise dispatch sync
    dispatch(stream, headers);
  }
});

const sendStreamToClient = (stream, body) => {
  const STREAM_INTERVAL = 500;
  let count = 0;
  let streamIsOpen = true;

  stream.on('close', () => {
    streamIsOpen = false;
    console.log('stream closed');
  });

  stream.respond({
    'content-type': 'text/event-stream; charset=utf-8',
    ':status': 200,
  });

  const sendEvent = (stream) => {
    if (!streamIsOpen) {
      count = 0;
      return;
    }
    count += 1;
    if (count < 50) {
      stream.write(`id: ${count}\nevent: testMessage\ndata: hello${body}\n\n`);
      setTimeout(() => sendEvent(stream), STREAM_INTERVAL);
    } else {
      stream.end(`id: ${count}\nevent: testMessage\ndata: goodbye${body}\n\n`);
      streamIsOpen = false;
      count = 0;
    }
  };

  sendEvent(stream);
};

server.listen(8443, () => console.log('server up on 8443'));
