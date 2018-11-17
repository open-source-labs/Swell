const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const path = require('path');

app.use(bodyParser());
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });

app.listen(80, "0.0.0.0", () => {
    console.log('Express server on 80, 0.0.0.0');
});

app.get('/events', (req, res) => {
    res.header('Content-Type', 'text/event-stream');
    res.header('Cache-Control', 'no-cache');

    let id=0;

    setInterval(function() {
        res.write('event: my-custom-event\n');
        res.write('id: ' + id++ + '\n');
        res.write(`data: Your headers: ${JSON.stringify(req.headers)}\n`);
        res.write('\n\n')
    }, 2500);
});

app.post('/events', (req, res) => {
    console.log(req.body);
    res.header('Content-Type', 'text/event-stream');
    res.header('Cache-Control', 'no-cache');

    let id=0;

    setInterval(function() {
        res.write('event: my-custom-event\n');
        res.write('id: ' + id++ + '\n');
        res.write(`data: Your headers: ${JSON.stringify(req.headers)}\n`);
        res.write(`data: Your body: ${JSON.stringify(req.body)}\n`);
        res.write('\n\n')
    }, 2500);
});

module.exports = app;
