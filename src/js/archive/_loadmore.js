
// ==============================================

//        AJAX LOAD MORE POSTS

// ==============================================

document.addEventListener('DOMContentLoaded', function(e) {


  //        Load more posts
  // ==============================================

  const containerPosts = $('#js-container-articles');
  const btnLoadMore    = $('#js-btn-loadmore');
  const loaderPosts    = $('#loader-posts');
	console.log('loaderPosts', loaderPosts);
	
  const pagesMax       = containerPosts.attr('data-pages-max');
  let   paged          = containerPosts.attr('data-paged');
	
	// animate first posts
	if (containerPosts) {
		setTimeout(function(){
			revealPosts();
			}, 1000
		);
	}

	// load next page of articles
  function loadMorePosts() {
		paged = containerPosts.attr('data-paged');
 
		let data = {
			'action': 'load_more_posts',
			'paged' : paged
		};
 
		$.ajax({ 
			url : loadmore_params.ajaxurl,
			data: data,
			type: 'POST',
			beforeSend: function ( xhr ) {
        btnLoadMore.hide();
				loaderPosts.show();
			}	
		})
		.done(function (data) {
			if( data ) { 
				// update current page
				paged++;
				containerPosts.attr('data-paged', paged);
				btnLoadMore.show();
				loaderPosts.hide();

				// render posts
				containerPosts.append(data);

				// anim
				revealPosts();
				scrollToPageGroup(paged);

				if ( paged == pagesMax ) {
					btnLoadMore.remove(); 	// if last page, remove the button
					console.log('max page reached');
				}                 

			} else {
				btnLoadMore.remove(); 		// if no data, remove the button as well
				console.log('no datas');
			}
		})
	};
	$(btnLoadMore).click(loadMorePosts);



	//        Update page url when scroll
  // ==============================================

	let lastScroll = 0;
	// update url with page/1, page/2, when scroll
	function updatePageUrl(el) {
		let currentScroll = $(window).scrollTop();

		// calcul only each 100px scroll offset ( if window.height = 1000px -> 10% of window.height = 100px )
		if( Math.abs( currentScroll - lastScroll ) > 10 ) {
		// if( Math.abs( currentScroll - lastScroll ) > $(window).height() * 0.1 ) {
			// console.log('currentScroll', currentScroll, lastScroll, Math.abs( currentScroll - lastScroll ));
			lastScroll = currentScroll;

			$('.page-group-articles').each(function( index ) {
				if(isInViewport( $(this) )) {
					// console.log('\n---', lastScroll);
					// console.log('PAGE ?', $(this).attr('data-paged'));
					
					// page url is /actualites/, /actualites/page/2...
					let url = '/'+loadmore_params.slug_actualites+'/';
					if ( $(this).attr('data-paged') > 1 ) url += 'page/' + $(this).attr('data-paged');
					history.replaceState('', '', url );
					return false;
				}
			});
		}
	};
	$(window).on('scroll', updatePageUrl );


	// check if an element is in viewport
	function isInViewport(el) {
		let currentScroll = $(window).scrollTop();
		let windowHeight  = $(window).height();
		let elTop         = $(el).offset().top;
		let elHeight      = $(el).height();
		let elBottom      = elTop + elHeight;

		// let result = ( elBottom - elHeight*0.25 > currentScroll ) && ( elTop < ( currentScroll + 0.5 * windowHeight) ) ;
		let result = ( elBottom - elHeight > currentScroll ) && ( elTop < ( currentScroll + 0.5 * windowHeight) ) ;
		return result;
	}


	//        Animations
  // ==============================================

	// animate new articles loaded
	function revealPosts() {
		let items = $('.card-article.reveal-init:not(.reveal)');

		for (let i=0; i < items.length; i++) {
			// get function in closure, so i can iterate
			let addRevealClass = getAddRevealClass( items[i] );
			let delay = i * 100;
			setTimeout( addRevealClass, delay );
		}
	}

	// closure function to get article
	function getAddRevealClass(el) {
		return function() {
			$(el).addClass('reveal');
		}
	}

	// scroll new page group to top of the page
	function scrollToPageGroup(id) {
		let header  = document.getElementById('header');
		let offset  = -header.offsetHeight - 20;
		let target  = document.querySelector(`.page-group-articles[data-id="${id}"]`);
		let targetY = target.offsetTop + offset;

		$('body,html').animate({ scrollTop : targetY }, 800, 'easeInOutCubic');
	}

})
