document.addEventListener('DOMContentLoaded', function() {


	// Global Variables: Variables required for more than 1 function
	// ----------------------------------------------------------------------------
	var elHTML           = document.documentElement,
		elBody           = document.body,
		elMainNav        = document.getElementById('nav_main'),
		elHeaderLogo     = document.getElementById('resize_logo'),
		elHeaderRule     = document.getElementById('resize_rule'),
		elHeaderWordmark = document.getElementById('resize_wordmark'),
		elWrapMenu       = document.getElementById('wrap_menu'),
		elMenuLunch      = document.getElementById('menu_lunch'),
		elMenuDinner     = document.getElementById('menu_dinner');


/*
	var docFragment,
		elOverlay,
		elModal;
*/


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
					elMainNav.setAttribute('data-current', arrSections[0].title); // home
					break;
				case (numScrollWindow < numBeginFoodWine):
					elMainNav.setAttribute('data-current', arrSections[1].title); // reserve
					break;
				case (numScrollWindow < numBeginBacaro):
					elMainNav.setAttribute('data-current', arrSections[2].title); // foodwine
					break;
				case (numScrollWindow < numBeginPrivate):
					elMainNav.setAttribute('data-current', arrSections[3].title); // bacaro
					break;
				case (numScrollWindow < numBeginPhotos):
					elMainNav.setAttribute('data-current', arrSections[4].title); // private
					break;
				case (numScrollWindow > numBeginPhotos):
					elMainNav.setAttribute('data-current', arrSections[6].title); // photos
					break;
				default:
					elMainNav.setAttribute('data-current', 'footer');
					break;
			}

		}

	}


	// toggleNavLogo: Hide / Show N&N Logo in Navigation on Scroll
	// ----------------------------------------------------------------------------
	function toggleNavLogo() {

		// was checking for numWindowWidth >= 1024 as well... but not really necessary
		if (numScrollWindow >= 200) {
			classie.add(elMainNav, 'scrolled'); // is a 'has' conditional worthwhile?
		} else {
			classie.remove(elMainNav, 'scrolled');
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

		var elPackeryContainer = document.getElementById('packery');

		// layout Packery after all images have loaded
		imagesLoaded(elPackeryContainer, function(instance) {

			// initalize packery
			var elPackery = new Packery(elPackeryContainer, {
				itemSelector: '.gallery_link',
				gutter: 'div.gutter-sizer'
			});

		});

	}


	// Helper: Create and Destroy [data-overlay] element
	// ----------------------------------------------------------------------------
	function createOverlay() {

		// lock document scrolling
		classie.add(elHTML, 'overlay_active');

		// first, create the document fragment
		// var docFragment = document.createDocumentFragment();

		// create an empty <div>
		elOverlay = document.createElement('div');

		// apply the attributes: id="overlay" & data-overlay="modal"
		// elOverlay.id = 'overlay';
		elOverlay.setAttribute('data-overlay', 'modal'); // could maybe pass the attr value into the function?

		// append the #overlay to the document fragement
		// docFragment.appendChild(elOverlay);

		// append this <div> to the document <body>
		elBody.appendChild(elOverlay);

		// make the element fully transparent
		// (don't rely on a predefined CSS style... declare this with JS to getComputerStyle)
		elOverlay.style.opacity = 0;

		// make sure the initial state is applied
		window.getComputedStyle(elOverlay).opacity;

		// set opacity to 1 (CSS transition will handle the fade)
		elOverlay.style.opacity = 1;

	}

	function destroyOverlay() {

		// define empty elOverlay variable as the newly created div#overlay
		// elOverlay = document.getElementById('overlay');

		// unlock document scrolling
		classie.remove(elHTML, 'overlay_active');

		// set opacity to 0 (CSS transition will handle the fade)
		elOverlay.style.opacity = 0;

		// listen for CSS transitionEnd before removing the element
		elOverlay.addEventListener(transitionEvent, removeOverlay);

	}

	function removeOverlay() {

		console.log('removeModal');

		// remove elOverlay from <body>
		elBody.removeChild(elOverlay);

		// must remove event listener!
		elOverlay.removeEventListener(transitionEvent, removeOverlay);

	}




	function createModal() {

		// build modal elements
		var docFragment  = document.createDocumentFragment(),
			elModal      = document.createElement('aside');

		// define <aside> attributes
		elModal.id = 'gallery';
		elModal.setAttribute('data-modal', 'gallery');
		elModal.setAttribute('data-current', '');


/*
		elModal.innerHTML = '<nav id="nav_gallery" class="nav_gallery">'+
			'<a href="#" id="nav_prev" class="wrap_svg nav_prev" title="Previous Image">'+
				'<svg class="svg_ui-arrow">'+
					'<use xlink:href="#ui_arrow"></use>'+
				'</svg>'+
			'</a>'+
			'<a href="#" id="nav_next" class="wrap_svg nav_next" title="Next Image">'+
				'<svg class="svg_ui-arrow">'+
					'<use xlink:href="#ui_arrow"></use>'+
				'</svg>'+
			'</a>'+
			'<a href="#" id="nav_close" class="wrap_svg nav_close" title="Close Image">'+
				'<svg class="svg_ui-close">'+
					'<use xlink:href="#ui_close"></use>'+
				'</svg>'+
			'</a>'+
		'</nav>'+
		'<img id="gallery_image" src="" alt="">';
*/


		// build nav elements
		var elModalNav   = document.createElement('nav'),
			elModalImage = document.createElement('img'),
			arrNavLinks  = [
				{ id: 'prev',  title: 'Previous Image', svgClass: 'svg_ui-arrow', xlink: '#ui_arrow' },
				{ id: 'next',  title: 'Next Image',     svgClass: 'svg_ui-arrow', xlink: '#ui_arrow' },
				{ id: 'close', title: 'Close Image',    svgClass: 'svg_ui-close', xlink: '#ui_close' }
			];

		// define <nav> attributes
		elModalNav.id = 'nav_gallery';
		elModalNav.setAttribute('class', 'nav_gallery');

		// define <img> attributes
		elModalImage.id = 'gallery_image';
		elModalImage.setAttribute('src', '');
		elModalImage.setAttribute('alt', '');

		// iterate through nav links array
		for (var i = 0; i < arrNavLinks.length; i++) {

			// build nav links (svg & use require a namespace)
			var thisNavLink = document.createElement('a'),
				thisSVG     = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
				thisUse     = document.createElementNS('http://www.w3.org/2000/svg', 'use');

			// define nav link attributes
			thisNavLink.id = 'nav_' + arrNavLinks[i].id;
			thisNavLink.setAttribute('href', '#');
			thisNavLink.setAttribute('title', arrNavLinks[i].title);
			thisNavLink.setAttribute('class', 'wrap_svg nav_' + arrNavLinks[i].id);

			// define namespaced element attributes
			thisSVG.setAttribute('class', arrNavLinks[i].svgClass);
			thisUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', arrNavLinks[i].xlink);

			// append nav links
			thisSVG.appendChild(thisUse);
			thisNavLink.appendChild(thisSVG);
			elModalNav.appendChild(thisNavLink);

		}

		// append nav and image
		elModal.appendChild(elModalNav);
		elModal.appendChild(elModalImage);


		// append to document fragment and empty into <body>
		docFragment.appendChild(elModal);
		elBody.appendChild(docFragment);

	}

	createModal();


	// photoGallery: Photo section modal gallery
	// ----------------------------------------------------------------------------
	function photoGallery() {

		var arrGalleryLinks = document.querySelectorAll('a.gallery_link'),
			numGalleryCount = arrGalleryLinks.length;

		// check if arrGalleryLinks is not empty
		if (numGalleryCount === 0) {
			return; // array is empty... exit function
		}

		var numGalleryCountAdjusted = numGalleryCount - 1,
			elGalleryModal          = document.getElementById('gallery'),
			elGalleryPrev           = document.getElementById('nav_prev'),
			elGalleryNext           = document.getElementById('nav_next'),
			elGalleryClose          = document.getElementById('nav_close'),
			elGalleryImage          = document.getElementById('gallery_image'),
			arrGallerySource        = [],
			dataCurrent,
			dataSRC;

		for (var i = 0; i < numGalleryCount; i++) {
			launchGallery(arrGalleryLinks[i], i);
		}

		function launchGallery(thisGalleryLink, index) {

			// push a.gallery_link href to arrGallerySource array
			arrGallerySource.push(thisGalleryLink.getAttribute('href'));

			thisGalleryLink.addEventListener('click', function(e) {

				dataCurrent = index;

				createOverlay();
				loadImage();

				e.preventDefault();

			});

		}

		function loadImage() {

			// scroll the <aside> to 0 so we don't end up opening a new image that is scrolled half way down
			// elGalleryModal.scrollTop = 0;

			// get the image source from our array
			dataSRC = arrGallerySource[dataCurrent];

			// set the new image source
			elGalleryImage.src = dataSRC;

			// set data-current on <aside> (currently not used for anything)
			elGalleryModal.setAttribute('data-current', dataCurrent);

		}

		elGalleryPrev.addEventListener('click', function(e) {

			if (dataCurrent <= 0) {
				dataCurrent = numGalleryCountAdjusted;
			} else {
				dataCurrent--;
			}

			loadImage();

			e.preventDefault();

		});

		elGalleryNext.addEventListener('click', function(e) {

			if (dataCurrent >= numGalleryCountAdjusted) {
				dataCurrent = 0;
			} else {
				dataCurrent++;
			}

			loadImage();

			e.preventDefault();

		});

		elGalleryClose.addEventListener('click', function(e) {

			destroyOverlay();

			e.preventDefault();

		});

	}

// photoGallery();









/*

	// toggleModal: Open & Close modal windows
	// ----------------------------------------------------------------------------
	function toggleModal() {

		var arrModalOpen   = document.getElementsByClassName('modal_open'),
			arrModalClose  = document.getElementsByClassName('modal_close'),
			elTargetModal;

		// check if a.modal_open exists and is not empty
		if (typeof arrModalOpen !== 'undefined' && arrModalOpen.length > 0) {

			for (var i = 0; i < arrModalOpen.length; i++) {
				arrModalOpen[i].addEventListener('click', openModal, false);
			}

			for (var i = 0; i < arrModalClose.length; i++) {
				arrModalClose[i].addEventListener('click', closeModal, false);
			}

		} else {

			return; // array not found or empty... exit function

		}

		function openModal(e) {

			var dataTargetModal = this.getAttribute('href').substring(1); // capture the href of the clicked element, remove the # prefix
				elTargetModal   = document.getElementById(dataTargetModal); // get the modal we need to open

			classie.add(elHTML, 'overlay_active'); // lock <body> scrolling with 'overlay_active'
			classie.add(elTargetModal, 'loaded'); // visibility is initially set to "hidden", "loaded" class applied only once

			// create overlay element and fade in modal
			createOverlay();
			elTargetModal.setAttribute('data-modal', 'active');

			e.preventDefault();

			document.addEventListener('click', documentClick, false);

		}

		function closeModal(e) {

			var dataTargetModal = this.getAttribute('href').substring(1); // capture the href of the clicked element, remove the # prefix
				elTargetModal   = document.getElementById(dataTargetModal); // get the modal we need to open

			// once we have found the desired parent element, hide that modal
			classie.remove(elHTML, 'overlay_active');
			elTargetModal.setAttribute('data-modal', 'inactive');
			destroyOverlay();

			e.preventDefault();

			document.removeEventListener('click', documentClick, false);

		}

		function documentClick(e) {

			// if this is not the currently toggled dropdown
			if ( e.target === document.getElementById('overlay') ) {

				// ignore this event if preventDefault has been called
				if (e.defaultPrevented) {
					return;
				}

				// once we have found the desired parent element, hide that modal (copied from closeModal)
				classie.remove(elHTML, 'overlay_active');
				elTargetModal.setAttribute('data-modal', 'inactive');
				destroyOverlay();

				console.log('clicked on the overlay');

			} else {

				console.log('no, this is NOT the overlay');

			}

		}

	}

*/






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
	// photoGallery();

	smoothScroll.init({
		speed: 1000,
		easing: 'easeInOutQuint',
		updateURL: false
	});


}, false);