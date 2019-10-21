var express = require('express')
var app = express()
var server = require('http').Server(app)

app.use(express.static(__dirname + '/src'))

app.get('/', function (req, res) {
    res.sendFile('/index.html');
});
   
server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});