const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
  });
  
  sendSSEs(response); 
  

}).listen(5001, () => console.log('server listening on port 5001'));

const sendSSEs = (response, id = 0, timeout) => {
  response.write(
    `id: ${id}\ndata: This is event ${id}\n\n`
  );
  id++; 

  if (id < 6) {
    timeout = setTimeout(() => {
      sendSSEs(response, id, timeout);
    }, 3000)
  };
} 