// server.js
var http = require("http");
var path = require("path");
var express = require("express");
var request = require("request");
var app = express();


var wwwDir = "/";
app.use("/", express.static(__dirname + wwwDir));
app.get("/", function(req, res) { res.render(wwwDir + "/index.html");});
app.listen(8080);
