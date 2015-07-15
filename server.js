var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var port = 3000;

var CLIENT_DIR = '/src/client';
app.use('/', express.static(path.join(__dirname, 'src/client')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + CLIENT_DIR + '/index.html'));
});
app.get('bundle.js', function(req, res) {
  res.sendFile(path.join(__dirname + CLIENT_DIR + '/bundle.js'));
});
app.listen(port);
console.log('The magic happens on port ' + port);
