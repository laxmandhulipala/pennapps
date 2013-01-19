// server.js
var http = require("http");
var path = require("path");
var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var crypto = require("crypto");
var fs = require("fs");
var redis = require("redis"),
        client = redis.createClient();

var reds = require("reds");

var app = express();


function makewqStore() {
  client.exists('wqStore', function(error, exists) {
    if(error) {
        console.log('ERROR: '+error);
    } else if(!exists) {
        client.set('wqStore', []); //create the wqStore key
    };
  });
}

makewqStore();

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

var searchFor = function(queryStr) {
	var nSearch = reds.createSearch(queryStr);
};

app.get("/flushDB", function(req, res) {
	client.flushall( function (didSucceed) {
        console.log(didSucceed); // true
    });
	makewqStore();
});


app.post("/addUrl", function(req, res) {
	console.log("In add url");
	console.log("req.body is ", req.body);
	if (req.body.docURL) {
		// great - client.rpush exists. 
		var url = req.body.docURL;
		var tags = req.body.httpTags;
		var content = req.body.theInnerTxt;
		client.rpush("wqStore", [url, tags, content]);
		console.log("pushed");
		client.get("wqStore", redis.print);
	}
/*
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
	
	} */
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

function serveImgFile(request, response) {
    response.sendfile(staticDir + 'img/' + request.params.imgFilename);
}

app.get("/static/:staticFilename", serveStaticFile);
app.get("/css/:cssFilename", serveCssFile);
app.get("/js/:jsFilename", serveJsFile);
app.get("/img/:imgFilename", serveImgFile);

console.log("Server started");
app.listen(8080);
