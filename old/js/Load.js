var loadBooks = function() {
	$.ajax({
		type: 'GET',
		url: '/fetchLatestBooks',
		dataType: 'json',
		success: function(result) {
			console.log("Success!");	
			// Pre-compile our html
			var template = _.template(
				$("script.template").html()
			);
			$('#bookCont').empty();		
			for (var bookNum in result) {
				var book = result[bookNum];
				console.log("Book is ", book);
				$('#bookCont').hide().append(template(book)).show('slow');
				//$('#bookCont').hide().append(template(book)).slideDown();
			}	
			if (result.length === 0) {
				window.makeNotification("Welcome", "You can upload a book from Upload page");
			}
		},
		error: function() {
			console.log(":(");
			window.makeNotification("Error", "There was an error when loading your library");
		},
	});
};

function imgError(image){
	image.onerror = ""; // Make sure this only happens once brah
	image.src = "/static/img/cover.jpeg";
	return true;
}
