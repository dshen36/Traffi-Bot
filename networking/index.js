var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PythonShell = require('python-shell');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(5000, function() {
    console.log('Listening on *:5000');
});

io.on('connection', function(socket) {
    console.log('Connection from: ' + socket.id);

    socket.on('start click', function() {
        console.log('start');
        var py = new PythonShell('inputter.py', { args: ['on'] });

        py.on('message', function(msg) {
            console.log(msg);
        });

        py.end(function(err) {
            if (err) throw err;
        });
    });

    socket.on('off click', function() {
        console.log('end');
        var py = new PythonShell('inputter.py', { args: ['off'] });

        py.on('message', function(msg) {
            console.log(msg);
        });

        py.end(function(err) {
            if (err) throw err;
        });
    });

    socket.on('change times', function(p, v) {
        console.log('change');
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
        console.log('terminate');
        var py = new PythonShell('inputter.py', { args: ['terminate'] });

        py.on('message', function(msg) {
            console.log(msg);
        });

        py.end(function(err) {
            if (err) throw err;
        });
    })
});