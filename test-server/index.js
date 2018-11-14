const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => res.send('Test server running...'))
    
app.get('/sse', (req, res, next) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })

    setTimeout(() => {
        res.write(
            'data: hello \n'
          );
        res.write('\n\n');
    }, 3000);

    setTimeout(() => {
        let respObj = {
            event : 'testEvent',
            data : 'hi2',
        }
        res.write(JSON.stringify(respObj));
        res.write('\n\n');
    }, 6000);

    setTimeout(() => {
        res.end('bye');
    }, 9000);
})

app.listen(port, () => console.log(`Listening on port ${port}!`))