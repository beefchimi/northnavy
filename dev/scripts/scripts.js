document.addEventListener('DOMContentLoaded', function() {


	// Global Variables: Variables required for more than 1 function
	// ----------------------------------------------------------------------------
	var elBody           = document.body,
		elNav            = document.getElementsByTagName('nav')[0],
		elHeaderLogo     = document.getElementById('resize_logo'),
		elHeaderRule     = document.getElementById('resize_rule'),
		elHeaderWordmark = document.getElementById('resize_wordmark'),
		elWrapMenu       = document.getElementById('wrap_menu'),
		elMenuLunch      = document.getElementById('menu_lunch'),
		elMenuDinner     = document.getElementById('menu_dinner');

	var arrSections = [
		{ title: 'home',     height: 0, section: document.getElementsByTagName('header')[0] },
		{ title: 'reserve',  height: 0, section: document.getElementById('reserve') },
		{ title: 'foodwine', height: 0, section: document.getElementById('foodwine') },
		{ title: 'bacaro',   height: 0, section: document.getElementById('bacaro') },
		{ title: 'private',  height: 0, section: document.getElementById('private') },
		{ title: 'gift',     height: 0, section: document.getElementById('gift') },
		{ title: 'photos',   height: 0, section: document.getElementById('photos') }
	];

	var numScrollWindow = window.pageYOffset,
		numWindowWidth  = window.innerWidth,
		numWindowHeight = window.innerHeight,
		numRatio,
		numThreshold,
		numLogoMargin,
		numRuleMargin,
		numWordmarkMargin,
		numLogoWidth,
		numFullWidth,
		numSectionMargin,
		numBeginReserve,
		numBeginFoodWine,
		numBeginBacaro,
		numBeginPrivate,
		numBeginPhotos,
		numBeginReserveAdjusted;

	// var boolSecondRun = false;


	// Helper: Fire Window Resize Event Upon Finish
	// ----------------------------------------------------------------------------
	var waitForFinalEvent = (function() {

		var timers = {};

		return function(callback, ms, uniqueId) {

			if (!uniqueId) {
				uniqueId = 'beefchimi'; // Don't call this twice without a uniqueId
			}

			if (timers[uniqueId]) {
				clearTimeout(timers[uniqueId]);
			}

			timers[uniqueId] = setTimeout(callback, ms);

		};

	})();


	// Helper: Check when a CSS transition or animation has ended
	// ----------------------------------------------------------------------------
	function whichTransitionEvent() {

		var trans,
			element     = document.createElement('fakeelement'),
			transitions = {
				'transition'       : 'transitionend',
				'OTransition'      : 'oTransitionEnd',
				'MozTransition'    : 'transitionend',
				'WebkitTransition' : 'webkitTransitionEnd'
			}

		for (trans in transitions) {
			if (element.style[trans] !== undefined) {
				return transitions[trans];
			}
		}

	}

/*
	function whichAnimationEvent() {

		var anim,
			element    = document.createElement('fakeelement'),
			animations = {
				'animation'       : 'animationend',
				'OAnimation'      : 'oAnimationEnd',
				'MozAnimation'    : 'animationend',
				'WebkitAnimation' : 'webkitAnimationEnd'
			}

		for (anim in animations) {
			if (element.style[anim] !== undefined) {
				return animations[anim];
			}
		}

	}
*/

	var transitionEvent = whichTransitionEvent(); // listen for a transition
	// var animationEvent  = whichAnimationEvent(); // listen for a animation


	// menuToggle: Lunch & Dinner menu toggle
	// ----------------------------------------------------------------------------
	function menuToggle() {

		var elLunchToggle  = document.getElementById('toggle_lunch'),
			elDinnerToggle = document.getElementById('toggle_dinner'),
			targetToggle,
			targetEvent;

		// toggle the Lunch menu
		elLunchToggle.addEventListener('click', function(e) {

			if ( !classie.has(this, 'toggled') ) {

				targetToggle = elMenuLunch;
				targetEvent  = elMenuDinner;

				elWrapMenu.setAttribute('data-menu', 'lunch');

				classie.add(this, 'toggled');
				classie.remove(elMenuDinner, 'toggled');
				classie.remove(elDinnerToggle, 'toggled');

				targetEvent.addEventListener(transitionEvent, menuTrackTransition);

			}

			e.preventDefault();

		});

		// toggle the Dinner menu
		elDinnerToggle.addEventListener('click', function(e) {

			if ( !classie.has(this, 'toggled') ) {

				targetToggle = elMenuDinner;
				targetEvent  = elMenuLunch;

				elWrapMenu.setAttribute('data-menu', 'dinner');

				classie.add(this, 'toggled');
				classie.remove(elMenuLunch, 'toggled');
				classie.remove(elLunchToggle, 'toggled');

				targetEvent.addEventListener(transitionEvent, menuTrackTransition);

			}

			e.preventDefault();

		});

		// wait for CSS opacity transition to end
		function menuTrackTransition() {

			menuHeight();
			classie.add(targetToggle, 'toggled');

			// must remove event listener!
			targetEvent.removeEventListener(transitionEvent, menuTrackTransition);

		}

	}


	// menuHeight: Apply Lunch & Dinner menu height
	// ----------------------------------------------------------------------------
	function menuHeight() {

		var strDefaultMenu = elWrapMenu.getAttribute('data-menu'),
			numMenuLunch   = elMenuLunch.clientHeight,
			numMenuDinner  = elMenuDinner.clientHeight,
			numNewHeight   = strDefaultMenu === 'lunch' ? numMenuLunch : numMenuDinner;

		// set height of div.wrap_wrap to toggled div.menu_list
		elWrapMenu.style.height = numNewHeight + 'px';

		setTimeout(measureSectionHeight, 1200); // required to make safari calculate menuHeight before measureSectionHeight

	}


	// viewportHeader: Resize header elements to fit within the viewport
	// ----------------------------------------------------------------------------
	function viewportHeader() {

		if (numWindowWidth >= 912) {

			// calculate our sizing values
			// margin & width values are hard coded to prevent additional math
			numRatio          = numWindowHeight / 1100;
			numThreshold      = numRatio >= 1 ? 1 : numRatio;
			numLogoMargin     = 70  * numThreshold;
			numRuleMargin     = 90  * numThreshold;
			numWordmarkMargin = 120 * numThreshold;
			numLogoWidth      = 120 * numThreshold;
			numFullWidth      = 912 * numThreshold;

			// apply updated inline styles
			elHeaderLogo.style.marginBottom = numLogoMargin + 'px';
			elHeaderRule.style.cssText     += '; width:' + numFullWidth + 'px; margin-bottom:' + numRuleMargin + 'px';
			elHeaderWordmark.style.cssText += '; width:' + numFullWidth + 'px; margin-bottom:' + numWordmarkMargin + 'px';

		} else {

			// in case we are resizing down, remove any inline styles we may have set
			elHeaderLogo.removeAttribute('style');
			elHeaderRule.removeAttribute('style');
			elHeaderWordmark.removeAttribute('style');

		}

	}


	// measureSectionHeight: Get the height of each section in arrSections
	// ----------------------------------------------------------------------------
	function measureSectionHeight() {

		// we are currently not tracking the new foodwine height after toggling lunch / dinner...
		// should probably do this

		if (numWindowWidth < 1200) {
			numSectionMargin = 80;
		} else {
			numSectionMargin = 160;
		}

		// for each object in arrSections,
		// measure the height of that section and update 'height' property
		for (var i = 0; i < arrSections.length; i++) {
			arrSections[i].height = arrSections[i].section.offsetHeight;
		}

		// update section 'begin' scroll points
		numBeginReserve  = arrSections[0].height; // after 'home'
		numBeginFoodWine = numBeginReserve  + arrSections[1].height + numSectionMargin; // after 'reserve'
		numBeginBacaro   = numBeginFoodWine + arrSections[2].height + numSectionMargin; // after 'foodwine'
		numBeginPrivate  = numBeginBacaro   + arrSections[3].height + numSectionMargin; // after 'bacaro'
		numBeginPhotos   = numBeginPrivate  + arrSections[4].height + numSectionMargin + arrSections[5].height; // after 'private'... includes gift section (since not in nav)

		// set 'reserve' earlier than the rest
		numBeginReserveAdjusted = Math.floor( numBeginReserve / 1.25 );

	}


	// navTrackSection: Track 'current' section (scroll distance < distance from top of doc)
	// ----------------------------------------------------------------------------
	function navTrackSection() {

		if (numWindowWidth >= 768) {

			switch (true) {
				case (numScrollWindow < numBeginReserveAdjusted):
					elNav.setAttribute('data-current', arrSections[0].title); // home
					break;
				case (numScrollWindow < numBeginFoodWine):
					elNav.setAttribute('data-current', arrSections[1].title); // reserve
					break;
				case (numScrollWindow < numBeginBacaro):
					elNav.setAttribute('data-current', arrSections[2].title); // foodwine
					break;
				case (numScrollWindow < numBeginPrivate):
					elNav.setAttribute('data-current', arrSections[3].title); // bacaro
					break;
				case (numScrollWindow < numBeginPhotos):
					elNav.setAttribute('data-current', arrSections[4].title); // private
					break;
				case (numScrollWindow > numBeginPhotos):
					elNav.setAttribute('data-current', arrSections[6].title); // photos
					break;
				default:
					elNav.setAttribute('data-current', 'footer');
					break;
			}

		}

	}


	// toggleNavLogo: Hide / Show N&N Logo in Navigation on Scroll
	// ----------------------------------------------------------------------------
	function toggleNavLogo() {

		// was checking for numWindowWidth >= 1024 as well... but not really necessary
		if (numScrollWindow >= 200) {
			classie.add(elNav, 'scrolled'); // is a 'has' conditional worthwhile?
		} else {
			classie.remove(elNav, 'scrolled');
		}

	}


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
				itemSelector: '.gallery_link',
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


	// Window Events: On - Scroll, Resize
	// ----------------------------------------------------------------------------
	window.addEventListener('scroll', function(e) {

		// re-measure the window scroll distance
		numScrollWindow = window.pageYOffset;

		navTrackSection();
		toggleNavLogo();

	}, false);

	window.addEventListener('resize', function(e) {

		// re-measure window width and height on resize
		numWindowWidth  = window.innerWidth;
		numWindowHeight = window.innerHeight;

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			menuHeight();

		}, 500, 'unique string');

		viewportHeader();

	}, false);


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	menuToggle();
	menuHeight();
	viewportHeader();
	measureSectionHeight();
	toggleNavLogo();
	secretEmail();
	layoutPackery();

	smoothScroll.init({
		speed: 1000,
		easing: 'easeInOutQuint',
		updateURL: false
	});


}, false);