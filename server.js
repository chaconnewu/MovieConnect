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
app.get('fl_geo.json', function(req, res) {
  res.sendFile(path.join(__dirname + CLIENT_DIR + '/fl_geo.json'));
});
app.get('movie_geo_data.json', function(req, res) {
  res.sendFile(path.join(__dirname + CLIENT_DIR + '/movie_geo_data.json'));
});
app.listen(port);
console.log('The server starts on port ' + port);
