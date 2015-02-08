document.addEventListener('DOMContentLoaded', function() {


	// Global Variables
	// ----------------------------------------------------------------------------
	var elHTML = document.documentElement,
		elBody = document.body;


	// Helper: Determine which transition event to use
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

	var transitionEvent = whichTransitionEvent(), // listen for a transition
		animationEvent  = whichAnimationEvent(); // listen for a animation


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


	// Helper: Create and Destroy [data-overlay] element
	// ----------------------------------------------------------------------------
	function createOverlay() {

		// first, create an empty <div>
		var elOverlay = document.createElement('div');

		// apply the attributes: id="overlay" & data-overlay="modal"
		elOverlay.id = 'overlay';
		elOverlay.setAttribute('data-overlay', 'modal'); // could maybe pass the attr value into the function?

		// append this <div> to the document <body>
		elBody.appendChild(elOverlay);

		// make the element fully transparent
		// (don't rely on a predefined CSS style... declare this with JS to getComputerStyle)
		elOverlay.style.opacity = 0;

		// make sure the initial state is applied
		window.getComputedStyle(elOverlay).opacity;

		// set opacity to 1 (predefined CSS transition will handle the fade)
		elOverlay.style.opacity = 1;

	}

	function destroyOverlay() {

		var elOverlay = document.getElementById('overlay');

		elOverlay.style.opacity = 0;

		transitionEvent && elOverlay.addEventListener(transitionEvent, function() {
			elBody.removeChild(elOverlay);
		});

	}


	// Navigation: Click to toggle navigation
	// ----------------------------------------------------------------------------
	function navToggle() {

		var elNavToggle = document.getElementById('nav_toggle');

		elNavToggle.addEventListener('click', function(e) {

			classie.toggle(elBody, 'toggled_mobile-nav');

			e.preventDefault();

		}, false);

	}


	// secretEmail: Add mailto link to footer
	// ----------------------------------------------------------------------------
	function secretEmail() {

		var mailLink = document.getElementById('secret_email'),
			prefix    = 'mailto',
			local    = 'hello',
			domain   = 'northandnavy',
			suffix    = 'com';

		mailLink.setAttribute('href', prefix + ':' + local + '@' + domain + '.' + suffix);
		mailLink.innerHTML = local + '@' + domain + '.' + suffix;

	}


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

			// hide loader by removing 'visible' class
			// classie.remove(elLoader, 'visible');

			// iterate through each article and add 'loaded' class once ready
			for (var i = 0; i < arrImages.length; i++) {
				(function(i){
					setTimeout(function() {
						classie.add(arrImages[i], 'loaded');
					}, 200 * i);
				})(i)
			}

			// once our images have loaded, it is safe to initialize gallery()
			// gallery();

		});

	}




	// Initialize Primary Functions
	// ----------------------------------------------------------------------------

	// navToggle();
	secretEmail();
	layoutPackery();


	// toggleModal();


}, false);