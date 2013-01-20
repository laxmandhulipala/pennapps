// server.js
var http = require("http");
var path = require("path");
var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var crypto = require("crypto");
var fs = require("fs");
var _ = require('lodash');
var redis = require("redis"),
        client = redis.createClient();

var url2png = require('url2png')('P50FB82641571C', 'SC5361FA74C0EA');

client.select(1);
client.set("hello", "world");

var reds = require("reds");

var app = express();

function bind(fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  }
}


function makewqStore() {
  client.exists('wqStore', function(error, exists) {
    if(error) {
        console.log('ERROR: '+error);
    } else if(!exists) {
        client.set('wqStore', []); //create the wqStore key
    };
  });
}

//makewqStore();

function getUid()
{
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

function generateHash(url) 
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

app.get("/index.html", function(req, res) {
	console.log("Sending '/'");
	res.sendfile(staticDir + 'index.html');
});

app.get("/download.html", function(req, res) {
	console.log("Sending '/'");
	res.sendfile(staticDir + 'download.html');
});

app.get("/about.html", function(req, res) {
	console.log("Sending '/'");
	res.sendfile(staticDir + 'about.html');
});

app.get("/test.html", function(req, res) {
	console.log("Sending '/'");
	res.sendfile(staticDir + 'test.html');
});

/*
var getUrl = function(theUrl, theTags) {
	request(theUrl, function(err, resp, body) {
		if (err) {
			console.log("There was an error");
		}
		$ = cheerio.load(body);
		console.log("printing out body");
		console.log($(document.body).textContent);
	});
}; */


app.get("/flushDB", function(req, res) {
	client.flushall( function (didSucceed) {
        console.log(didSucceed); // true
    });
	makewqStore();
});

/* console.log(client.smembers("wqUrlSet").keys("*", function(err, replies) {

	})); */

var searchList = [];
var searchIds = [];

var refreshUrls = function(cb) {
		var i;
		searchList = [];
		searchIds = [];
		var searchMap = {};
		client.smembers("wqUrlSet", function(err, res) {
			var numToProcess = res.length;
			for (i=0; i < numToProcess; i++) {
					console.log("I is ", i);
					var keyVal = res[i];
					var redisWrap = function(ind, keyVal) {
						client.hgetall(keyVal, function(err, nRes) {
							var content = nRes['content'];
							var keyVal = nRes['url'];
							var hashVal = nRes['urlHash'];
							var newI = ind; 
							searchMap[newI] = {hashVal : hashVal, keyVal : keyVal, content : content};
		
							if (Object.keys(searchMap).length === numToProcess) {
								// We're done - call the callback, and finish up. 
		
								for (var i=0; i < Object.keys(searchMap).length; i++) {
									searchIds.push({hashVal : searchMap[i].hashVal, url : searchMap[i].keyVal 
													});

									console.log("Searchmap[i].keyval is ", searchMap[i].keyVal);
									searchList.push(searchMap[i].content);
								}

								console.log("Done!");
								if (cb) {
									cb();
								}
							}
						});
					}

					redisWrap(i, keyVal);
			}	
//					searchList.push(toPush);
//					searchIds.push({index : i, keyVal : keyVal});
		});
}

// this is how you pull stuff given a hash - these hashes are presented by smembers!
/*
client.hgetall("url:http://news.ycombinator.com/", function(err, res) {
	if (err) console.log(err);
	console.log("res is ", res);
});   */

var searchByTag = function (tagName, cb) {

	var nSearch = reds.createSearch(tagName);
	var afterRefresh = function() {
		console.log("There are ", searchList.length, "many elements in the list");
		searchList.forEach(function(str, i) { nSearch.index(str, i); });

		nSearch	
		  .query(query = tagName)
		  .end(function(err, ids){
		    if (err) throw err;
		    console.log('Search results for "%s":', query);
		    ids.forEach(function(id){
//		      console.log('  - %s', strs[id]);
			  console.log('The String ID was ', id);
		    });
			cb(ids);
		  }, 'union');
	};
	refreshUrls(afterRefresh);
}

var searchByTags = function (tags, cb) {
	var results = {};
	var numAdded = 0;
	var numTags = tags.length;
	if (tags.length === 0) return;
	var firstTag = tags[0];

	var nSearch = reds.createSearch(firstTag);
	var afterRefresh = function() {
		console.log("There are ", searchList.length, "many elements in the list");
		searchList.forEach(function(str, i) { nSearch.index(str, i); });
		for (var i=0; i<tags.length; i++) {
			nSearch
				.query(query = tags[i])
				.end(function(err, ids) {
					ids.forEach(function(id) {
						if (typeof(results[id]) !== "undefined") {
							results[id] += 1;
						}
						else results[id] = 1;
					});
					numAdded += 1;
					if (numAdded === numTags) {
						cb(results);		
					}
				}, 'union');
		}
	};
	refreshUrls(afterRefresh);
}

app.get("/testit", function(req,res) {
	url2png.readURL('news.ycombinator.com', 300, 300).pipe(fs.createWriteStream('cache/ycombinator.com'));
});

var saveUrl = function(url, to) {
	url2png.readURL(url, 600, 600).pipe(fs.createWriteStream(to));
};

app.get("/testTag/:tagName", function(req, res) {
		var tag = req.params.tagName;
		searchByTag(tag, function(ids) {
			var urls = [];
			console.log("Ids were", ids);
			for(var i = 0; i < ids.length; i++) {
				var toAdd = ids[i];
				var toPush = searchIds[toAdd];
				console.log("searchIds[toAdd] is ", toPush);
				urls.push(toPush);
			}
			console.log("SearchIds is ", searchIds); 
			res.send(urls);
		});
});

app.post("/searchForTag", function(req, res) {
	if (req.body.tag) {
		var tag = req.body.tag;
		searchByTag(tag, function(ids) {
			var urls = [];
			console.log("Ids were", ids);
			for(var i = 0; i < ids.length; i++) {
				var toAdd = ids[i];
				var toPush = searchIds[toAdd];
				console.log("searchIds[toAdd] is ", toPush);
				urls.push(toPush);
			}
			console.log("SearchIds is ", searchIds); 
			res.send(urls);
		});
	}
});


app.post("/searchForTags", function(req, res) {
	if (req.body.tags) {
		searchByTags(tags, function(results) {
			var urls = [];
			var resultsArr = [];
			for (var id in results) {
				resultsArr.push({elId : id, val : results[id]});	
			}
			var sortArr = _.sortBy(resultsArr, function(elem){ return elem.val;});
			console.log("sorted array is ", sortArr);
			sortArr.forEach(function(elem) {
				var toAdd = elem.elId;
				var toPush = searchIds[toAdd];
				console.log("searchIds[toAdd] is ", toPush);
				urls.push(toPush);
			});
			console.log("SearchIds is ", searchIds); 
			res.send(urls);
		});
	}
});


app.post("/addUrl", function(req, res) {
	console.log("In add url");
	console.log("req.body is ", req.body);
	if (req.body.docURL) {
		// great - client.rpush exists. 
		var url = req.body.docURL;
		var tags = req.body.httpTags;
		var content = req.body.theInnerTxt + tags;

		// need to download a picture of the website and save it into cache/picname.png
		var urlHash = generateHash(url);
		var toUrl = 'cache/'+ urlHash + '.png';	
		saveUrl(url, toUrl);
		var formUrl = 'url:'+url;
		client.sadd("wqUrlSet",formUrl);
		client.hmset(formUrl, "url", url, "tags", tags, "content", content, "urlHash", urlHash);
//		client.hmget(formUrl, "url", url, 
		/*client.hgetall(formUrl, function(err, res){
         var items = [];
       		  for (i in res) {
       		     items.push(JSON.parse(res[i]));
       		  }
		 console.log("Items is ", items);
     	});   */
		
		res.send({stat : 'success', msg : 'All good bro'});
		refreshUrls();
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

function serveCacheFile(request, response) {
    response.sendfile(cacheDir + request.params.cacheFilename);
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
app.get("/cache/:cacheFilename", serveCacheFile);
app.get("/css/:cssFilename", serveCssFile);
app.get("/js/:jsFilename", serveJsFile);
app.get("/img/:imgFilename", serveImgFile);

console.log("Server started");
app.listen(8080);
