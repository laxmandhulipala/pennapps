//Seting up Filepicker.io with your api key
//filepicker.setKey('A893bplSjQii6Ve27EX0tz');

window.startUpload = function() {
	filepicker.setKey('A893bplSjQii6Ve27EX0tz');
	filepicker.pick({
	 	container: 'modal',
		extensions: ['.epub','*.cbz', '*.mobi'],
	    services:['COMPUTER'],
		maxSize : 30*1024000, // Three megabytes
	},
	function(FPFile){
		console.log("In here man not sure");
		console.log(FPFile);
		console.log(JSON.stringify(FPFile));
		console.log("successful upload");
		window.uploadBook(FPFile.url,FPFile);			  
	},
	function(FPError){
		console.log("In here man filepicker appears to be broken");
		console.log(FPError.toString());
	});
}

window.uploadBook = function(uploadstr, theFile) {
	var dat = {toUpload : uploadstr};
	var bName = $('#bookNameField').val();
	var stringDat = JSON.stringify(dat);
	var fileDat = JSON.stringify({toUpload : theFile, 
				      bName : bName}); 
	var url;
	console.log("uploadstr ", uploadstr);
	console.log("theFile ", theFile);
	if (theFile.filename.indexOf(".epub") !== -1) {
		url = "/uploadBook";
	} else if (theFile.filename.indexOf(".cbz") !== -1) {
		url = "/uploadCBZ";
	} else {
		url = "/uploadOther";
	}
	console.log("url is ", url);
	$.ajax({ url: url,
            type: 'POST',
            data: fileDat, 
            dataType: 'json',
		contentType: "application/json",
		cache: false,
		success : function(result) {
			console.log("Success : stat", result.stat);
			var stat = result.stat;
			if (stat === "success") {
				window.switchToIndex();
				window.makeNotification("Success!", result.msg);
			}
			else {
				window.switchToIndex();
				var r = window.makeNotification("Error", result.msg);
			}
		},
		error : function() {
			window.makeNotification("Error", "Something went wrong while processing your request");
		},
	});
	window.switchToIndex();
} 
/*
window.startUpload = function() {
	filepicker.setKey('A893bplSjQii6Ve27EX0tz');
    filepicker.pick({
        extension: '.epub',
        container: 'modal',
      services:['COMPUTER'],
        maxSize : 10*1024000, // One megabyte
    },  
    function(FPFile){
        console.log(FPFile);
        console.log(JSON.stringify(FPFile));
        console.log("successful upload");
        window.uploadBook(FPFile.url,FPFile);                
    },  
    function(FPError){
        console.log(FPError.toString());
    }); 
}

window.uploadBook = function(uploadstr, theFile) {
    var dat = {toUpload : uploadstr};
    var bName = $('#bookNameField').val();
    var stringDat = JSON.stringify(dat);
    var fileDat = JSON.stringify({toUpload : theFile, 
                                  bName : bName}); 
    $.ajax({ url: '/uploadBook',
            type: 'POST',
            data: fileDat, 
            dataType: 'json',
        contentType: "application/json",
        cache: false,
        success : function(result) {
            console.log("yaaaay");
        },  
        error : function() {
            console.log("saaaaad"); 
        },  
    }); 
} */



