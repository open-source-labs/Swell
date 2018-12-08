process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const http2 = require('http2');

const client = http2.connect('https://localhost:8443');
client.on('error', err => console.error(err));
client.on('connect', () => {
  // REQUEST 1
  const req1 = client.request(
    {
      ':path': '/events',
      reqName: 'req1',
    },
    // endstream false means more data can come later with req.write or req.end
    { endStream: false },
  );
  req1.write('req1');
  // delay sending req1 body...
  setTimeout(() => {
    req1.end('req1TestBody');
  }, 1000);

  req1.on('response', (headers, flags) => {
    for (const name in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, name)) {
        // console.log(`${name}: ${headers[name]}`);
      }
    }
  });

  req1.setEncoding('utf8');
  req1.on('data', (chunk) => {
    // console.log(chunk);
  });
  // req1.on('end', () => {
  //   client.close();
  // });

  // REQUEST 2
  const req2 = client.request(
    {
      ':path': '/events',
      reqName: 'req2',
    },
    // endstream false means more data can come later with req.write or req.end
    { endStream: false },
  );
  req2.write('req2');
  req2.end('req2TestBody');

  req2.on('response', (headers, flags) => {
    for (const name in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, name)) {
        // console.log(`${name}: ${headers[name]}`);
      }
    }
  });

  req2.setEncoding('utf8');
  req2.on('data', (chunk) => {
    // console.log(chunk);
  });
  // req2.on('end', () => {
  //   client.close();
  // });
});
