const express = require('express');
const app = express();
const port = 8080;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => res.send('Test server running...'))
    
app.get('/sse', (req, res, next) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })

    setTimeout(() => {
        res.write(
            'data: hello\n'
          );
        res.write('\n\n');
    }, 1000);

    setTimeout(() => {
        res.write('id : 2\n');
        res.write('event : testEvent\n');
        res.write('data : {"name" : "jason"}\n');
        res.write('\n\n');
    }, 2000);

    setTimeout(() => {
        res.end('data : bye\n\n');
    }, 3000);
})

app.listen(port, () => console.log(`Listening on port ${port}!`))