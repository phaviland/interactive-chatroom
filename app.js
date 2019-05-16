var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var map = new Map();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/src', express.static(__dirname + '/src'));

http.listen(3000);

io.on('connection', function (socket) {
    var name;
    var timeout;

    socket.on('signin', function (square, fn) {
        if (map.has(square.name) || name !== undefined)
            fn("Name already in use");
        else {
            name = square.name;
            map.set(name, square);
            fn(true);
        }
    });

    socket.on('move', function (x, y) {
        var square = map.get(name);
        square.x = x;
        square.y = y;
    });

    socket.on('sendmessage', function (message) {
        message = message.trim();
        if (message.length != 0) {
            var square = map.get(name);
            square.message = message;
            clearTimeout(timeout);
            timeout = setTimeout(function () { square.message = ''; }, 5000);
        }
    });

    socket.on('disconnect', function () {
        map.delete(name);
    });
});

setInterval(function () {
    io.emit('update', Array.from(map.values()));
}, 10);