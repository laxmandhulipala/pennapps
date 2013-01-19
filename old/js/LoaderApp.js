var LoaderApp = function(){
    window.util = _UTIL;
    window.util.patchFnBind();
    $(document.body).height('100%');

    this.dictionaryView = new DictionaryView();

    var reader = new Hammer(document.getElementById("reader"));
    reader.onswipe = function(ev) {
        if (ev.direction === "left") {
            this.goToDictionary();
        }
    }.bind(this);

    var dictionary = new Hammer(document.getElementById("dictionary"));
    dictionary.onswipe = function(ev) {
        if (ev.direction === "right") {
            this.goToReader();
        }
    }.bind(this);

    $(document).dblclick(function(e) {
            if (window.app.inDictionary) return;
            var t = app.getSelection();
            if (t !== "" && window.app.inDictionary === false) {      
		// Get definition for word and then                   
		// simulate the user sliding to the                   
		// dictionary.                                        
		window.app.dictionaryView.lookupWord(t);              
		window.app.goToDictionary();                          
            }   
	});

    this.inDictionary = false;
    this.bindSelection();
}

LoaderApp.prototype = {
    getSelection: function() {
	var txt = '';
        if (window.getSelection) {
	    txt = String(window.getSelection());
	    window.getSelection().empty();
        } else if (document.getSelection) {
	    txt = String(document.getSelection());
	    document.getSelection.empty();
        } else if (document.selection) {
	    txt = String(document.selection.createRange().text);
	    document.selection.empty();
        }
	console.log("text ",txt);
        return txt;
    },
    selection: function(e) {
        var st = window.app.getSelection();
        if (st !== "") {
	    window.app.dictionaryView.lookupWord(st);
	    window.app.goToDictionary();
        }
    },
    goToDictionary: function() {
	if (window.app.inDictionary) {
	    return;
	}
	$(document).unbind("touchend");
        $.mobile.changePage($("#dictionary"),
            {
                transition : "slide",
                reverse : false,
            });
        window.app.inDictionary = true;
        $("#lookup").unbind('click').click(function() {
            var text = $("#input").val().toLowerCase();
            $("#input").val(text);
            window.app.dictionaryView.lookupWord(text);
	    });
    },
    bindSelection: function() {
	    $(document).bind("touchend", 
			     function(e) { 
				 window.app.selection(e);
			     });
    },
    goToReader: function() {
	if (!window.app.inDictionary) {
	    return;
	}
	window.app.bindSelection();
        $.mobile.changePage($("#reader"),
            {
                transition : "slide",
                reverse : true,
            });
        window.app.inDictionary = false;
    }
}

