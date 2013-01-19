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

app.post("/test", function(req, res) {
	console.log("gotamsg");
});

app.post("/addUrl", function(req, res) {
    if (req.user.words === undefined) {
        req.user.words = [req.params.word];
    } else {
        req.user.words.push(req.params.word);
    }
    res.send('success');
});

function serveStaticFile(request, response) {
    response.sendfile(staticDir + request.params.staticFilename);
}

function serveCssFile(request, response) {
	console.log("Sending css file");
    response.sendfile(staticDir + 'css/' + request.params.cssFilename);
}

function serveJsFile(request, response) {
    response.sendfile(staticDir + 'js/' + request.params.jsFilename);
}

app.get("/static/:staticFilename", serveStaticFile);
app.get("/css/:cssFilename", serveCssFile);
app.get("/js/:jsFilename", serveJsFile);

app.listen(8080);
