var DictionaryView = function() {
	this.wordCount = {};
	exports = {};
	this.inDictionary = false;

	exports.div = $('#dictionary');
	console.log($("#lookup"));


	var updateWordCount = function(word) {
		if (this.wordCount[word] === undefined) {
	    	this.wordCount[word] = 1;
		} else {
	    	this.wordCount[word]++;
		}
	}.bind(this);

	var takeFirstWord = function(input) {
		input = String(input);
		words = input.split(" ");
		// Find the first word
		for (var i= 0; i < words.length; i++) {
	    // Just in case we have leading spaces
		    if (words[i] !== "") {
				return words[i];
		    }
		}
		return ""
	};

  	exports.lookupWord = function(input) {
  		// The words should not have spaces in them
		// based on the way we select words, but
		// just in case the user selects more than
		// one word we'll only take the first word.
		word = takeFirstWord(input);
		updateWordCount(word);	
		$("#definitions").empty();
    
		var path = "/v4/word.json/" + word +
		"/definitions?api_key=5aa07224c79fba9a3a40701cd3d0e28a0c7f20d85b1ef5756"
		+ "&sourceDictionaries=wiktionary";
		var url = "http://api.wordnik.com" + path;
    	$.ajax({
            url: url,
	        success: function(response) {
		    			// Display definition to client.
		    			if (response.length === 0) {
		    				var error = $("<li />");
		    				error.html("ERROR: Could not find a definition " +
					    			"for " + word);
		    				$("#definitions").append(error);
		    			} else {
		    				console.log("process");
		    				console.log(processDefinitions);
		    				// Only store valid words
		    				processDefinitions(word, response);
		    				console.log("why");
		   	 			}
           			},
        });

    	var processDefinitions = function(word, response) {
    		var header = $("#word");
    		header.html(word);

	    	var defs = $("#definitions");
	    	var def = $("<li />");
	    	def.html(response[0]["text"]);
	    	defs.append(def);

	  		var data = new FormData();
				data.append("word", word);

		    /*$.ajax({
				url: "/wordLookup",
				data: data,
				cache: false,
				contentType: false,
				processData: false,
				type: 'POST',
				success: function success(data){
				        	if (data === "success") {
				        		console.log("yayyyy successful");
				        	} else {
				        		console.log("nayyyyyy");
				        	}
		        		}
			});*/
  		}.bind(this);
	}.bind(this);

	exports.getLookedUpWords = function() {
		words = [];
		for (var word in wordCount) {
		    words.push(word);
		}
		return words;
	};

	return exports;
}

