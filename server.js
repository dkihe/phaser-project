var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io').listen(server)

let players = {}

app.use(express.static(__dirname + '/src'))

app.get('/', function (req, res) {
    res.sendFile('/index.html');
});

// Listen for incoming sockets
io.on('connection', function (socket) {
    console.log('a user connected');

    players[socket.id] = {
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    }

    // Send players object to new connection
    socket.emit('currentPlayers', players)
    // Update all other players of new connection
    socket.broadcast.emit('newPlayer', players[socket.id])

    socket.on('disconnect', function () {
        // Remove this player from players object
        delete players[docket.id]
        // Emit message to all players to remove this player
        io.emit('disconnect', socket.id)

        console.log('user disconnected');
    });
});


server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});