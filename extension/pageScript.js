(function($) {
	$(document).ready(function(){
	
		var $searchHeader = $('.searchHeader');
		var $search = $('#search');
		
		// apply fittext to the needy :)
		$artHeaderTitle.fitText(1.5);
		$('.art-listings h1').fitText(2);
		$('#me h2').fitText(1.2);
		$('#contact_form h2').fitText(1);
		$('.fittext').fitText(1);
		
		// activate search when searchBtn is clicked
		$('.searchBtn').on('click', function(e){
			$('#search').removeClass('searchFadeOut').addClass('searchFadeIn').css('display', 'block');
			$('#search input[type=text]').attr('autofocus', 'true').focus();
			
			e.preventDefault();
		});
		
		$('.searchDismiss').on('click', function(e){
			hideSearch();
			e.preventDefault();
		});
		
		
		function hideSearch() {
			$search.removeClass('searchFadeIn').addClass('searchFadeOut');
			
			setTimeout(function() {
				$('#search').css('display', 'none');
			}, 500);
		}

	});		
})(jQuery);
