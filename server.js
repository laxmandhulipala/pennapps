// server.js
var http = require("http");
var path = require("path");
var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var crypto = require("crypto");
var fs = require("fs");
var _redis = require("redis"),
        redis = _redis.createClient();

var reds = require("reds");

var app = express();

function getUid()
{
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}


app.configure(function() {
    app.use(express.cookieParser('your secret here'));                                     
    app.use(express.bodyParser());
    app.use(express.methodOverride());                                                     
    app.use(express.session());
    app.use(app.router);
//    app.use(express.static("/www/cache", __dirname + "/www/cache"));                       
}); 


/*var Db = require('mongodb').Db;
var Server = require('mongodb').Server;   */

var staticDir = __dirname+'/static/';
var cacheDir = __dirname+'/cache/';

app.get("/", function(req, res) {
	console.log("Sending '/'");
	res.sendfile(staticDir + 'index.html');
});

app.post("/test", function(req, res) {
	console.log("gotamsg");
});

var getUrl = function(theUrl, theTags) {
	request(theUrl, function(err, resp, body) {
		if (err) {
			console.log("There was an error");
		}
		$ = cheerio.load(body);
		console.log("printing out body");
		console.log($(document.body).textContent);
	});
};

var searchFor(queryStr) {
	var nSearch = reds.createSearch(queryStr);
	
};


app.post("/addUrl", function(req, res) {
	console.log("In add url");
	console.log("req.body is ", req.body);
	console.log("req.params are ", req.params);
	if (req.body.docURL) {
		// have a valid file to work with, load it up with cheerio

	var searchA = reds.createSearch('addUrl');

	var strs = [];
	var toPush = req.body.theInnerTxt;
	strs.push(toPush);

	strs.forEach(function(str, i){ search.index(str, i); });

	searchA
	  .query(query = 'LaTeX Javascript')
	  .end(function(err, ids){
	    if (err) throw err;
	    console.log('Search results for "%s":', query);
	    ids.forEach(function(id){
//	      console.log('  - %s', strs[id]);
		  console.log('The String ID was ', id);
	    });
	  }, 'or');
	
	}
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

console.log("Server started");
app.listen(8080);
