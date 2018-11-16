// const express = require('express');
// const app = express();
// const port = 8080;

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

// app.get('/', (req, res) => res.send('Test server running...'))
    
// app.get('/sse', (req, res, next) => {
//     res.writeHead(200, {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         'Connection': 'keep-alive'
//     })

//     setTimeout(() => {
//         res.write(
//             'data: hello \n'
//           );
//         res.write('\n\n');
//     }, 3000);

//     setTimeout(() => {
//         let respObj = {
//             id : 2,
//             eventType : 'testEvent',
//             data : 'hi2',
//         }
//         res.write(JSON.stringify(respObj));
//         res.write('\n\n');
//     }, 6000);

//     setTimeout(() => {
//         res.end('bye');
//     }, 9000);
// })

// app.listen(port, () => console.log(`Listening on port ${port}!`))

var fs = require('fs');
var http = require('http');

var connectionCounter = 1;

http.createServer(function(request, response) {

    if (request.url === '/') {

        // response.writeHead(200, { 'Content-Type': 'text/html' });
        // response.write(fs.readFileSync('index.html'));
        response.end();

    } else if (request.url === '/events') {

        var thisConnection = connectionCounter++;
        var thisEvent = 1;

        console.log('Client connected to event stream (connection #' + thisConnection + ', Last-Event-Id: ' + request.headers['last-event-id'] + ')');
        response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache' // let intermediaries know to NOT cache anything
        });

        var ticker = setInterval(function() {
            response.write('event: my-custom-event\n');
            response.write('id: ' + (thisConnection * 1000 + thisEvent) + '\n');
            response.write('data: Server says hi! (event #' + thisEvent++ +' of connection #' + thisConnection + ')\n\n');
        }, 2500);

        request.on('close', function() {
            console.log('Client disconnected from event stream (connection #' + thisConnection + ')');
            response.end();
            clearInterval(ticker);
        });

    } else {

        response.writeHead(404);
        response.end();

    }

}).listen(8888);