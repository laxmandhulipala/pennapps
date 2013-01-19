(function($) {
	$(document).ready(function(){
	
//		var $searchHeader = $('.searchHeader');

		var $search = $('#tagMain');
		
		// apply fittext to the needy :)
//		$artHeaderTitle.fitText(1.5);
//		$('.art-listings h1').fitText(2);
//		$('#me h2').fitText(1.2);
//		$('#contact_form h2').fitText(1);
//		$('.fittext').fitText(1);
		
		// activate search when searchBtn is clicked
/*		$('.searchBtn').on('click', function(e){
					
			e.preventDefault();
		}); */
		
/*		$('.searchDismiss').on('click', function(e){
			hideSearch();
			e.preventDefault();
		}); */

		function writeToServ(txtVal) {
			console.log(chrome);
			var docname = document.URL;
			var innrTxt = document.body.innerText;
			console.log("docname is ", docname);
			var toSend = JSON.stringify({docURL : docname, httpTags : txtVal, theInnerTxt : innrTxt});
			$.ajax({ url: 'http://127.0.0.1:8080/addUrl',
                type: 'POST',
                data: toSend,
                dataType: 'json',
                contentType: "application/json",
//                cache: false,
                success : function(result) {
                    console.log("yaaaay");
					console.log("result is ", result);
					$('#keywords').val("");
                },
                error : function() {
                    console.log("saaaaad"); 
					$('#appInstructions').append($('<h2 class="errh2">Something went wrong with your request</h2>'));
                },
            });
		}		

		function showSave () {
			// need to add to dom
			var tagMain = $('<section></section>').attr('id', 'tagMain').attr('class', 'manimate');
			var row = $('<row></row>');
			var tagformdiv = $('<div></div>').attr('class', 'tagform');
			var tagform = $('<form></form>');
			var tagInput = $('<input></input>').attr('type', 'text').attr('name', 'keywords').attr('id','keywords').attr('value','').attr('size','20').attr('maxlength','100');
//			var tagSubmit = $('<input></input>').attr('class', 'submit');
			tagform.append(tagInput);
			tagformdiv.append(tagform);
			var instr = $('<div></div>');
			var bigH = $('<h1 id="appInstructions"> input space delimited tags and press enter </h1>');
			instr.append(bigH);
			row.append(instr);
			row.append(tagformdiv);
			tagMain.append(row);
			$('body').append(tagMain);

			$('#tagMain').removeClass('tagFadeOut').addClass('tagFadeIn').css('display', 'block');
			$('#tagMain input[type=text]').attr('autofocus', 'true').focus().val("");

			$('#keywords').bind('keypress', function(e) {
				if(e.keyCode==13){
					// Enter pressed... do anything here...
					console.log("Enter was pressed - first check for non-empty input");
					var txtVal = $('#keywords').val();
					if (txtVal !== "") {
						writeToServ(txtVal);	
					}
					e.preventDefault();
				}
			});

			$('#keywords').val("");

		}
		
		function hideSearch() {
			$('#tagMain').removeClass('tagFadeIn').addClass('tagFadeOut');
			
			setTimeout(function() {
				$('#tagMain').css('display', 'none');
			}, 500);
		}

		keypress.combo("escape", function(e) {
			hideSearch();
			e.preventDefault();
		});
	
		keypress.combo("shift s", function() {
			console.log("pressed it bro");
		});
	
		keypress.combo("colon w q", function(e) {
			var quer = $('#tagMain');	
			if(quer) {
				quer.remove();
			}
			showSave();	
    		console.log("You pressed :wq");
			e.preventDefault();
		}); 

		keypress.combo("colon x", function(e) {
			var quer = $('#tagMain');	
			if(quer) {
				quer.remove();
			}
			showSave();
			console.log("You pressed :X");
			e.preventDefault();
		});

/*		function returnKey(evt) {
			var evt  = (evt) ? evt : ((event) ? event : null);
			var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
		 
			if ((evt.keyCode == 13) && (node.type == "text")) 
			{
				switch(node.id)
				{
					case 'search':
						getProduct();
						$('search').select();
						break;
				}
			}
		} 

*/
	});		
})($);
