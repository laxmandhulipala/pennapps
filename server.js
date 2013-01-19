// server.js
var http = require("http");
var path = require("path");
var express = require("express");
var request = require("request");

var app = express();


var Db = require('mongodb').Db;
var Server = require('mongodb').Server;  

var staticDir = __dirname+'/static/';
var cacheDir = __dirname+'/cache/';

//app.use("/", express.static(__dirname + wwwDir));
//app.get("/", function(req, res) { res.render(wwwDir + "/index.html");});

app.get("/", function(req, res) {
	console.log("Sending '/'");
	res.sendfile(staticDir + 'index.html');
});


app.post("/wordLookup", function(req, res) {
    if (!loggedIn(req, res)) {
        return;
    }
    var user = req.user;
    if (req.user.words === undefined) {
        req.user.words = [req.params.word];
    } else {
        req.user.words.push(req.params.word);
    }
    res.send('success');
});



console.log("Server started");
app.listen(8888);
