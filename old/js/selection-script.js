


// Following code looks up word for user
// depending on if they're using mobile or not.
$(document).dblclick(function(e) {
    e.preventDefault();
    var t = app.getSelection(e);
	console.log("App is ", app);
    console.log(window.app.inDictionary);
    if (t !== "" && window.app.inDictionary === false) {
        // Get definition for word and then
        // simulate the user sliding to the
        // dictionary.
        window.app.dictionaryView.lookupWord(t);
        window.app.goToDictionary();
    }

});

