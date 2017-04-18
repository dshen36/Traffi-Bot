var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PythonShell = require('python-shell');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(4261, function() {
    console.log('Listening on *:4261');
});

io.on('connection', function(socket) {
    socket.on('start click', function() {
        var py = new PythonShell('inputter.py', { args: ['on'] });

        py.on('message', function(msg) {
            console.log(msg);
        });

        py.end(function(err) {
            if (err) throw err;
        });
    });

    socket.on('off click', function() {
        var py = new PythonShell('inputter.py', { args: ['off'] });

        py.on('message', function(msg) {
            console.log(msg);
        });

        py.end(function(err) {
            if (err) throw err;
        });
    });

    socket.on('change times', function(p, v) {
        if (!p) p = 5;
        if (!v) v = 4;

        var py = new PythonShell('inputter.py', { args: ['change', p, v] });

        py.on('message', function(msg) {
            console.log(msg);
        });

        py.end(function(err) {
            if (err) throw err;
        });
    })

    socket.on('terminate server', function() {
        var py = new PythonShell('inputter.py', { args: ['terminate'] });

        py.on('message', function(msg) {
            console.log(msg);
        });

        py.end(function(err) {
            if (err) throw err;
        });
    })
});