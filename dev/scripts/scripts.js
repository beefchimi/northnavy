document.addEventListener('DOMContentLoaded', function() {


	// Global Variables: Variables requiring a global scope
	// ----------------------------------------------------------------------------
	var transitionEvent  = whichTransitionEvent(),
		animationEvent   = whichAnimationEvent(),
		elHTML           = document.documentElement,
		elBody           = document.body,
		elMainNav        = document.getElementById('nav_main'),
		elHeaderLogo     = document.getElementById('resize_logo'),
		elHeaderRule     = document.getElementById('resize_rule'),
		elHeaderWordmark = document.getElementById('resize_wordmark'),
		elWrapMenu       = document.getElementById('wrap_menu'),
		elMenuLunch      = document.getElementById('menu_lunch'),
		elMenuDinner     = document.getElementById('menu_dinner'),
		elOverlay;

	// window measurement variables
	var numScrollWindow   = window.pageYOffset,
		numWindowWidth    = window.innerWidth,
		numWindowHeight   = window.innerHeight,
		numClientWidth    = document.documentElement.clientWidth,
		numScrollbarWidth = numWindowWidth - numClientWidth,
		hasScrollbar      = numScrollbarWidth > 0 ? true : false;

	// section data for scroll functions
	var arrSections = [
		{ title: 'home',     height: 0, section: document.getElementsByTagName('header')[0] },
		{ title: 'reserve',  height: 0, section: document.getElementById('reserve') },
		{ title: 'foodwine', height: 0, section: document.getElementById('foodwine') },
		{ title: 'bacaro',   height: 0, section: document.getElementById('bacaro') },
		{ title: 'private',  height: 0, section: document.getElementById('private') },
		{ title: 'gift',     height: 0, section: document.getElementById('gift') },
		{ title: 'photos',   height: 0, section: document.getElementById('photos') }
	];

	// variables to be scoped globally, defined later
	var numRatio,
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


	// Helper: Detect if browser has visible or hidden scrollbars
	// ----------------------------------------------------------------------------
/*

	function hasScrollbar() {

		// the modern solution
		if (typeof window.innerWidth === 'number') {
			return window.innerWidth > document.documentElement.clientWidth;
		}

		var rootElem = document.documentElement || document.body, // rootElem for quirksmode
			overflowStyle,
			overflowYStyle;

		// check overflow style property on body for fauxscrollbars
		if (typeof rootElem.currentStyle !== 'undefined') {
			overflowStyle = rootElem.currentStyle.overflow;
		}

		overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;

		// also need to check the Y axis overflow
		if (typeof rootElem.currentStyle !== 'undefined') {
			overflowYStyle = rootElem.currentStyle.overflowY;
		}

		overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;

		var contentOverflows  = rootElem.scrollHeight > rootElem.clientHeight,
			overflowShown     = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle),
			alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

		return (contentOverflows && overflowShown) || (alwaysShowScroll);

	}

*/


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


	// Helper: Find Parent Element by Class or Tag Name
	// ----------------------------------------------------------------------------
	function findParentClass(el, className) {

		while (el && !classie.has(el, className) ) {
			el = el.parentNode;
		}

		return el;

	}

	function findParentTag(el, tagName) {

		while (el && el.nodeName !== tagName) {
			el = el.parentNode;
		}

		return el;

	};


	// Helper: CSS Fade In / Out
	// ----------------------------------------------------------------------------
	function fadeIn(thisElement) {

		// make the element fully transparent
		// (don't rely on a predefined CSS style... declare this with JS to getComputedStyle)
		thisElement.style.opacity = 0;

		// make sure the initial state is applied
		window.getComputedStyle(thisElement).opacity;

		// set opacity to 1 (CSS transition will handle the fade)
		thisElement.style.opacity = 1;

	}

	function fadeOut(thisElement) {

		// set opacity to 0 (CSS transition will handle the fade)
		thisElement.style.opacity = 0;

	}


	// Helper: Create loading animation
	// ----------------------------------------------------------------------------
	function createLoader() {

		// create loader elements
		var elLoader     = document.createElement('div'),
			elLoaderWrap = document.createElement('div'),
			elLoaderSVG  = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			elLoaderUse  = document.createElementNS('http://www.w3.org/2000/svg', 'use');

		// define loader attributes
		elLoader.setAttribute('class', 'loader_overlay');
		elLoaderWrap.setAttribute('class', 'wrap_svg');
		elLoaderUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#ui_loader');

		// append loader elements
		elLoaderSVG.appendChild(elLoaderUse);
		elLoaderWrap.appendChild(elLoaderSVG);
		elLoader.appendChild(elLoaderWrap);

		return elLoader;

	}


	// Helper: Lock / Unlock Body Scrolling
	// ----------------------------------------------------------------------------
	function lockBody() {

		classie.add(elHTML, 'overlay_active');

		// if necessary, accomodate for scrollbar width
		if (hasScrollbar) {
			elBody.style.paddingRight = numScrollbarWidth + 'px';
			elMainNav.style.paddingRight = numScrollbarWidth + 'px';
		}

	}

	function unlockBody() {

		classie.remove(elHTML, 'overlay_active');

		// if necessary, remove scrollbar width styles
		// should be expanded to restore original padding if needed
		if (hasScrollbar) {
			elBody.style.paddingRight = '0px';
			elMainNav.style.paddingRight = '0px';
		}

	}


	// Helper: Create and Destroy [data-overlay] element
	// ----------------------------------------------------------------------------
	function createOverlay(childElement, strLabel) {

		// create document fragment
		var docFragment = document.createDocumentFragment();

		lockBody();

		// create empty overlay <div>
		elOverlay = document.createElement('div');

		// set data-overlay attribute as passed strLabel value
		elOverlay.setAttribute('data-overlay', strLabel);

		// append passed child elements
		elOverlay.appendChild(childElement);

		// append the [data-overlay] to the document fragement
		docFragment.appendChild(elOverlay);

		// empty document fragment into <body>
		elBody.appendChild(docFragment);

		fadeIn(elOverlay);

	}

	function destroyOverlay() {

		fadeOut(elOverlay);

		// listen for CSS transitionEnd before removing the element
		elOverlay.addEventListener(transitionEvent, removeOverlay);

	}

	// move this into destoryOverlay?
	// add id to overlay element and get it within destory?
	// maybe expand this to be passed an ID, and it can destroy / remove any element?
	function removeOverlay(e) {

		// only listen for the opacity property
		if (e.propertyName == "opacity") {

			unlockBody();

			// remove elOverlay from <body>
			elBody.removeChild(elOverlay);

			// must remove event listener!
			elOverlay.removeEventListener(transitionEvent, removeOverlay);

		}

	}


	// pageLoaded: Execute once the page has loaded and the FOUT animation has ended
	// ----------------------------------------------------------------------------
	function pageLoaded() {

		var elHeader = document.getElementsByTagName('header')[0];

		elHeader.addEventListener(animationEvent, removeFOUT);

		function removeFOUT() {

			classie.add(elHTML, 'ready');
			elHeader.removeEventListener(animationEvent, removeFOUT);

		}

	}


	// launchForm: Display the opentable form
	// ----------------------------------------------------------------------------
	function launchForm() {

		// get all opentable links
		var elOpenTable    = document.getElementById('opentable'),
			elSubmitButton = document.getElementById('submit'),
			arrTriggers    = document.getElementsByClassName('opentable'),
			numTriggers    = arrTriggers.length;

		// check if div.wrap_select exists and is not empty
		if (typeof arrTriggers !== 'undefined' && numTriggers > 0) {

			for (var i = 0; i < numTriggers; i++) {
				toggleForm(arrTriggers[i]);
			}

			closeForm();

		} else {

			return; // array not found or empty... exit function

		}

		// accomodate for scrollbar if needed
		if (hasScrollbar) {
			elOpenTable.style.right = -numScrollbarWidth + 'px';
			elOpenTable.style.width = 'calc(100% + ' + numScrollbarWidth + 'px)';
		}

		function toggleForm(thisTrigger) {

			thisTrigger.addEventListener('click', function(e) {

				lockBody();

				elOpenTable.setAttribute('data-opentable', 'active');

				e.preventDefault();

			});

		}

		function closeForm() {

			elOpenTable.addEventListener('click', function(e) {

				// if this is the desired element
				if (e.target === elOpenTable || e.target === elSubmitButton) {

					elOpenTable.setAttribute('data-opentable', 'inactive');

					elOpenTable.addEventListener(animationEvent, restoreScroll);

				}

			});

		}

		function restoreScroll(e) {

			unlockBody();

			// must remove event listener!
			elOpenTable.removeEventListener(animationEvent, restoreScroll);

		}

	}


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
		function menuTrackTransition(e) {

			if (e.propertyName == "opacity") {

				menuHeight();
				classie.add(targetToggle, 'toggled');

				// must remove event listener!
				targetEvent.removeEventListener(transitionEvent, menuTrackTransition);

			}

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

		// rough guess at proper margin spacing for breakpoints
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

		if (numWindowWidth >= 1024 && numScrollWindow >= 200) {
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


	// selectDropdown: Pair each <select> element with its <ul> sibling
	// ----------------------------------------------------------------------------
	function selectDropdown() {

		// search for any div.wrap_select elements
		var arrSelectWrap   = document.getElementsByClassName('wrap_select'),
			numSelectLength = arrSelectWrap.length;

		// check if div.wrap_select exists and is not empty
		if (typeof arrSelectWrap !== 'undefined' && numSelectLength > 0) {

			for (var i = 0; i < numSelectLength; i++) {
				dropdownToggle(arrSelectWrap[i]);
			}

			passSelectValue();

		} else {

			return; // array not found or empty... exit function

		}

		// function for toggling dropdowns
		function dropdownToggle(thisSelectWrap) {

			var thisDropdownToggle = thisSelectWrap.getElementsByClassName('dropdown_toggle')[0];

			thisDropdownToggle.addEventListener('click', function(e) {

				// run through each div.wrap_select...
				for (var i = 0; i < numSelectLength; i++) {

					// and if this is NOT the parent div.wrap_select we have clicked on...
					if (arrSelectWrap[i] != thisSelectWrap) {
						classie.remove(arrSelectWrap[i], 'toggle_show');
					}

				}

				classie.toggle(thisSelectWrap, 'toggle_show');

				e.preventDefault(); // requires the event.preventDefault for the document listener to work

			});

			// click outside of element to close dropdown
			document.addEventListener('click', function(e) {

				// if this is not the currently toggled dropdown
				if (e.target != thisDropdownToggle) {

					// ignore this event if preventDefault has been called
					if (e.defaultPrevented) {
						return;
					}

					// hide dropdown
					classie.remove(thisSelectWrap, 'toggle_show');

				}

			});

		}

		// function for passing <ul> values to the corresponding <select>
		function passSelectValue() {

			var arrDropdownLinks = document.getElementsByClassName('dropdown_link');

			// assign the click event to each a.dropdown_link found in the document
			for (var i = 0; i < arrDropdownLinks.length; i++) {
				optionChange(arrDropdownLinks[i]);
			}

			function optionChange(thisDropdownLink) {

				thisDropdownLink.addEventListener('click', function(e) {

					var dataValue        = this.getAttribute('data-value'),
						dataLabel        = this.innerHTML,
						elParentLI       = this.parentNode,
						elParentUL       = elParentLI.parentNode,
						elParentWrap     = findParentClass(elParentUL, 'wrap_select'),
						elSiblingLabel   = findParentClass(elParentUL, 'wrap_dropdown').previousElementSibling.childNodes[1], // 1st child = empty textNode
						elMatchedOption  = elParentWrap.querySelector('option[value="' + dataValue + '"]'),
						dataPrevSelected = elParentWrap.getAttribute('data-selected'),
						elPrevSelected   = elParentUL.querySelector('a[data-value="' + dataPrevSelected + '"]');

					// define the correct <option> as :selected
					elMatchedOption.selected = true;

					// set 'data-selected' to new value
					elParentWrap.setAttribute('data-selected', dataValue);

					// replace div.dropdown_label innerHTML with the selected option text
					elSiblingLabel.innerHTML = dataLabel;

					// remove 'selected' class from previous <li>, if it exists...
					if (elPrevSelected != null) {
						classie.remove(elPrevSelected.parentNode, 'selected');
					}

					// then add 'selected' class to parent <li> of newly chosen a[data-value]
					classie.add(elParentLI, 'selected');

					// hide the parent dropdown
					classie.remove(elParentWrap, 'toggle_show');

					e.preventDefault();

				});

			}

		}

	}


	// initPikaday: Initialize date picker
	// ----------------------------------------------------------------------------
	function initPikaday() {

		var dateNow      = moment(),
			dateFuture   = moment().add(2, 'months'),
			elDateWrap   = document.getElementById('wrap_input-date'),
			elDateInput  = document.getElementById('startDate'),
			elDatePicker = new Pikaday({
				field: elDateInput,
				container: elDateWrap,
				position: 'top left',
				reposition: false,
				format: 'L',
				minDate: dateNow.toDate(),
				maxDate: dateFuture.toDate()
			});

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
				gutter: 'div.gutter-sizer'
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


	// photoGallery: Photo section modal gallery
	// ----------------------------------------------------------------------------
	function photoGallery() {

		// get all <a.gallery_link>s in document (ignore <div>s with same class)
		var arrGalleryLinks = document.querySelectorAll('a.gallery_link'),
			numGalleryCount = arrGalleryLinks.length;

		// check if arrGalleryLinks is not empty
		if (numGalleryCount === 0) {
			return; // array is empty... exit function
		}

		// define & scope variables for child functions
		var numGalleryCountAdjusted = numGalleryCount - 1,
			arrGallerySource        = [],
			boolFirstRun            = true,
			elGalleryModal,
			elGalleryNav,
			elGalleryPrev,
			elGalleryNext,
			elGalleryClose,
			elGalleryImage,
			elGalleryLoader,
			dataCurrent;

		for (var i = 0; i < numGalleryCount; i++) {

			// push a.gallery_link href to arrGallerySource array
			arrGallerySource.push(arrGalleryLinks[i].getAttribute('href'));

			// attach this a.gallery_link click event
			arrGalleryLinks[i].addEventListener('click', launchGallery);

		}

		// create <aside data-modal> element and children
		function createGalleryModal() {

			// create and define modal variables as new elements
			elGalleryModal  = document.createElement('aside');
			elGalleryNav    = document.createElement('nav');
			elGalleryImage  = document.createElement('img');
			elGalleryLoader = createLoader();

			// create new modal variables
			var elGalleryNavWrap = document.createElement('div');

			// define <aside> attributes
			elGalleryModal.setAttribute('data-modal', 'gallery');

			// hide scroll bar if necessary (don't worry about removing this, as the element will get destroyed)
			if (hasScrollbar) {
				elGalleryModal.style.right = -numScrollbarWidth + 'px';
				elGalleryModal.style.width = 'calc(100% + ' + numScrollbarWidth + 'px)';
			}

			// define contents of nav links
			var arrNavLinks  = [
					{ id: 'prev',  xlink: '#ui_arrow', title: 'Previous Image' },
					{ id: 'next',  xlink: '#ui_arrow', title: 'Next Image'     },
					{ id: 'close', xlink: '#ui_close', title: 'Close Image'    }
				];

			// define <nav> attributes
			elGalleryNav.setAttribute('class', 'nav_gallery');
			elGalleryNavWrap.setAttribute('data-container', 'width_1200');

			// define <img> attributes
			elGalleryImage.setAttribute('src', '');
			elGalleryImage.setAttribute('alt', '');

			// iterate through each nav link
			for (var i = 0; i < arrNavLinks.length; i++) {

				// create nav links (svg & use require a namespace)
				var thisNavLink = document.createElement('a'),
					thisSVG     = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
					thisUse     = document.createElementNS('http://www.w3.org/2000/svg', 'use');

				// define nav link attributes
				thisNavLink.setAttribute('href', '#');
				thisNavLink.setAttribute('title', arrNavLinks[i].title);
				thisNavLink.setAttribute('class', 'wrap_svg nav_' + arrNavLinks[i].id);

				// define namespaced element attributes
				thisUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', arrNavLinks[i].xlink);

				// append nav link elements
				thisSVG.appendChild(thisUse);
				thisNavLink.appendChild(thisSVG);
				elGalleryNavWrap.appendChild(thisNavLink);

			}

			// append nav, image, and loader
			elGalleryNav.appendChild(elGalleryNavWrap);
			elGalleryModal.appendChild(elGalleryNav);
			elGalleryModal.appendChild(elGalleryImage);
			elGalleryModal.appendChild(elGalleryLoader);

			// create overlay and append gallery modal, pass 'gallery' as data-overlay value
			createOverlay(elGalleryModal, 'gallery');

			// get reference to nav links
			elGalleryPrev  = document.getElementsByClassName('nav_prev')[0];
			elGalleryNext  = document.getElementsByClassName('nav_next')[0];
			elGalleryClose = document.getElementsByClassName('nav_close')[0];

		}

		// a.gallery_link click event
		function launchGallery(e) {

			// retreive this <a.gallery_link>s data-gallery value
			dataCurrent = parseInt( this.getAttribute('data-gallery') );

			createGalleryModal();
			loadImage();

			elGalleryPrev.addEventListener('click', galleryPrevious);
			elGalleryNext.addEventListener('click', galleryNext);
			elGalleryClose.addEventListener('click', clickClose);
			elGalleryModal.addEventListener('click', clickModal);

			e.preventDefault();

		}

		// load the next image
		function loadImage() {

			if (boolFirstRun) {

				// add loading classes
				classie.add(elGalleryLoader, 'visible');

				updateImageSrc();
				boolFirstRun = false;

			} else {

				// add loading classes
				classie.add(elGalleryLoader, 'visible');

				// remove 'img_loaded' class - return to opacity: 0;
				classie.remove(elGalleryModal, 'img_loaded');

				// listen for CSS transitionEnd before setting new image src
				elGalleryImage.addEventListener(transitionEvent, galleryTransitionEnd);

			}

		}

		function updateImageSrc() {

			// apply the new image source
			elGalleryImage.src = arrGallerySource[dataCurrent];

			// use imagesLoaded to check image progress
			var imgLoad = imagesLoaded(elGalleryModal);

			imgLoad.on('always', onAlways);

		}

		// require that the opacity of the previous image has reached 0 before continuing
		function galleryTransitionEnd(e) {

			// once opacity has reached 0
			if (e.propertyName == "opacity") {

				updateImageSrc();

				// must remove event listener!
				elGalleryImage.removeEventListener(transitionEvent, galleryTransitionEnd);

			}

		}

		// hide status when done
		function onAlways() {

			// setTimeout(function() {}, 1000);

			classie.add(elGalleryModal, 'img_loaded');
			classie.remove(elGalleryLoader, 'visible');

		}

		// #nav_prev click event
		function galleryPrevious(e) {

			// do not allow click is the image has not loaded
			if ( classie.has(elGalleryModal, 'img_loaded') ) {

				// if we are on the very first image (0),
				// clicking 'prev' should take us to the last image,
				// otherwise, increment down
				if (dataCurrent <= 0) {
					dataCurrent = numGalleryCountAdjusted;
				} else {
					dataCurrent--;
				}

				loadImage();

			}

			e.preventDefault();

		}

		// #nav_next click event
		function galleryNext(e) {

			// do not allow click is the image has not loaded
			if ( classie.has(elGalleryModal, 'img_loaded') ) {

				// if we are on the very last image,
				// clicking 'next' should take us to the first image (0),
				// otherwise, increment up
				if (dataCurrent >= numGalleryCountAdjusted) {
					dataCurrent = 0;
				} else {
					dataCurrent++;
				}

				loadImage();

			}

			e.preventDefault();

		}

		// destroy the modal + overlay
		function galleryClose() {

			boolFirstRun = true;

			// destroy [data-overlay], including <aside> child
			destroyOverlay();

			// remove click event from nav links (does this matter?)
			elGalleryPrev.removeEventListener('click', galleryPrevious);
			elGalleryNext.removeEventListener('click', galleryNext);
			elGalleryClose.removeEventListener('click', clickClose);
			elGalleryModal.removeEventListener('click', clickModal);

		}

		// #nav_close click event
		function clickClose(e) {

			galleryClose();

			e.preventDefault();

		}

		// gallery modal click event (ignore image or nav)
		function clickModal(e) {

			if (e.target === elGalleryModal) {

				// ignore this event if preventDefault has been called
				if (e.defaultPrevented) {
					return;
				}

				galleryClose();

			}

		}

	}


	// Window Events: On - Scroll, Resize
	// ----------------------------------------------------------------------------
	window.addEventListener('scroll', function(e) {

		// re-measure the window scroll distance
		numScrollWindow = window.pageYOffset;

		navTrackSection();
		toggleNavLogo();

	});

	window.addEventListener('resize', function(e) {

		// re-measure window width and height on resize
		numWindowWidth  = window.innerWidth;
		numWindowHeight = window.innerHeight;

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			menuHeight();

		}, 500, 'unique string');

		viewportHeader();

	});


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	pageLoaded();
	launchForm();
	menuToggle();
	menuHeight();
	viewportHeader();
	measureSectionHeight();
	toggleNavLogo();
	secretEmail();
	selectDropdown();
	initPikaday();
	layoutPackery();
	photoGallery();

	smoothScroll.init({
		speed: 1000,
		easing: 'easeInOutQuint',
		updateURL: false
	});


});