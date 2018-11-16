var fs = require('fs');
var http = require('http');

var connectionCounter = 1;

http.createServer(function(request, response) {

    if (request.url === '/') {
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