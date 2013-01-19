var booksHandler = function() {
	var exports = {};
	exports.init = function() {
		$("#uploadBtn").click(startUpload);
	}

	// Not sure which parameters are needed
	var addToBookList = function(FPFile) {
	    console.log("adding");
	    var book = $("<li/>");
	    book.html(FPFile.filename);
	    console.log("book is ", book);
	    $("#books").append(book);
	    console.log("books", $("#books"));
	}

	filepicker.setKey('A893bplSjQii6Ve27EX0tz');

	var startUpload = function() {
		filepicker.pick({
			extension: '.epub',
     		container: 'modal',
	    	services:['COMPUTER'],
			maxSize : 1024000, // One megabyte
			},
			function(FPFile){
			  console.log(FPFile);
			  console.log(JSON.stringify(FPFile));
			  console.log("successful upload");
			  uploadBook(FPFile.url,FPFile);
			  console.log('here');

			},
			function(FPError){
			  console.log(FPError.toString());
			}
    	);
	}

	var uploadBook = function(uploadstr, theFile) {
	    var dat = {toUpload : uploadstr};
	    var stringDat = JSON.stringify(dat);
	    var fileDat = JSON.stringify({toUpload : theFile});
	    // The should be in the success function, but it appears the
	    // ajax isn't working right now.
            addToBookList(theFile);
	    $.ajax({
                url: '/uploadBook',
                type: 'POST',
                data: fileDat, 
                dataType: 'json',
				contentType: "application/json",
				cache: false,
				success : function(result) {
					console.log("yaaaay", result);
					//      addToBookList(theFile);  
				},
				error : function() {
					console.log("saaaaad");	
				},
			});
	}

	return exports;
}