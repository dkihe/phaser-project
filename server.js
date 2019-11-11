var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io').listen(server)

let portNum = 8081
let players = {}

// Middleware function that serves files at /src
app.use(express.static(__dirname + '/src'))

// Respond with index.html file when a GET request is made
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Listen for incoming sockets
io.on('connection', function (socket) {
    console.log('a user connected');

    // Set object keys for connected player
    players[socket.id] = {
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 25,
        y: Math.floor(Math.random() * 400) + 25,
        playerId: socket.id,
    }

    // Send players object to new connection
    socket.emit('currentPlayers', players)
    // Update all other players of new connection
    socket.broadcast.emit('newPlayer', players[socket.id])

    socket.on('disconnect', function () {
        // Remove this player from players object
        delete players[socket.id]
        // Emit message to all players to remove this player
        io.emit('disconnect', socket.id)

        console.log('a user disconnected');
    });

    // when a player moves, update the player data
    socket.on('playerMovement', function (movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].rotation = movementData.rotation;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });
});

// Listen on port 'portNum'
server.listen(portNum, function () {
    console.log(`Listening on ${server.address().port}`);
});