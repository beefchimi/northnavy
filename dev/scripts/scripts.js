document.addEventListener('DOMContentLoaded', function() {


	// secretEmail: Add mailto link to footer
	// ----------------------------------------------------------------------------
	function secretEmail() {

		var elLinkHeader = document.getElementById('email_header'),
			elLinkFooter = document.getElementById('email_footer'),
			prefix        = 'mailto',
			local        = 'hello',
			domain       = 'northandnavy',
			suffix        = 'com';

		elLinkHeader.setAttribute('href', prefix + ':' + local + '@' + domain + '.' + suffix);
		elLinkFooter.setAttribute('href', prefix + ':' + local + '@' + domain + '.' + suffix);
		elLinkFooter.innerHTML = local + '@' + domain + '.' + suffix;

	}


	// layoutPackery: Wait until images are loaded then layout with packery.js
	// ----------------------------------------------------------------------------
	function layoutPackery() {

		var elPackeryContainer = document.getElementById('packery'),
			arrImages          = document.getElementsByClassName('gallery_link');

		// layout Packery after all images have loaded
		imagesLoaded(elPackeryContainer, function(instance) {

			// initalize packery
			var elPackery = new Packery(elPackeryContainer, {
				itemSelector: 'a.gallery_link',
				gutter: 'div.gutter-sizer',
				transitionDuration: '0.6s',
				visibleStyle: {
					opacity: 1,
					transform: 'scale(1)'
				},
				hiddenStyle: {
					opacity: 0,
					transform: 'scale(1)'
				}
			});

			// iterate through each article and add 'loaded' class once ready
			for (var i = 0; i < arrImages.length; i++) {
				(function(i){
					setTimeout(function() {
						classie.add(arrImages[i], 'loaded');
					}, 200 * i);
				})(i);
			}

		});

	}


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	secretEmail();
	layoutPackery();


}, false);