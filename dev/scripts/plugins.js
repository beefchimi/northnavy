// Helper: Animation / Transition Event Listener
// --------------------------------------------------------------------------------------------------------------------------------------------------------
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

var animationEvent  = whichAnimationEvent(),
	transitionEvent = whichTransitionEvent();


// Helper: Fire Window Resize Event Upon Finish
// --------------------------------------------------------------------------------------------------------------------------------------------------------
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

}


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


// Helper: Get a random number between a min and max range
// --------------------------------------------------------------------------------------------------------------------------------------------------------
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


// classie v1.0.1
// copyright David DeSandro | class helper functions | from bonzo https://github.com/ded/bonzo | MIT license
// --------------------------------------------------------------------------------------------------------------------------------------------------------
(function(window) {

	'use strict';

	function classReg( className ) {
		return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}

	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;

	if ( 'classList' in document.documentElement ) {

		hasClass = function( elem, c ) {
			return elem.classList.contains( c );
		};
		addClass = function( elem, c ) {
			elem.classList.add( c );
		};
		removeClass = function( elem, c ) {
			elem.classList.remove( c );
		};

	} else {

		hasClass = function( elem, c ) {
			return classReg( c ).test( elem.className );
		};
		addClass = function( elem, c ) {
			if ( !hasClass( elem, c ) ) {
				elem.className = elem.className + ' ' + c;
			}
		};
		removeClass = function( elem, c ) {
			elem.className = elem.className.replace( classReg( c ), ' ' );
		};
	}

	function toggleClass( elem, c ) {
		var fn = hasClass( elem, c ) ? removeClass : addClass;
		fn( elem, c );
	}

	var classie = {
		// full names
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
		// short names
		has: hasClass,
		add: addClass,
		remove: removeClass,
		toggle: toggleClass
	};

	// transport
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( classie );
	} else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = classie;
	} else {
		// browser global
		window.classie = classie;
	}

})(window);


// Packery PACKAGED v1.4.2 [moved: classie]
// by David DeSandro | http://packery.metafizzy.co | Copyright 2015 Metafizzy | Licensed GPLv3 for open source use or Flickity Commercial License for commercial use
// --------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Bridget makes jQuery widgets
 * v1.1.0
 * MIT license
 */

( function( window ) {

// -------------------------- utils -------------------------- //

var slice = Array.prototype.slice;

function noop() {}

// -------------------------- definition -------------------------- //

function defineBridget( $ ) {

// bail if no jQuery
if ( !$ ) {
	return;
}

// -------------------------- addOptionMethod -------------------------- //

/**
 * adds option method -> $().plugin('option', {...})
 * @param {Function} PluginClass - constructor class
 */
function addOptionMethod( PluginClass ) {
	// don't overwrite original option method
	if ( PluginClass.prototype.option ) {
		return;
	}

	// option setter
	PluginClass.prototype.option = function( opts ) {
		// bail out if not an object
		if ( !$.isPlainObject( opts ) ){
			return;
		}
		this.options = $.extend( true, this.options, opts );
	};
}

// -------------------------- plugin bridge -------------------------- //

// helper function for logging errors
// $.error breaks jQuery chaining
var logError = typeof console === 'undefined' ? noop :
	function( message ) {
		console.error( message );
	};

/**
 * jQuery plugin bridge, access methods like $elem.plugin('method')
 * @param {String} namespace - plugin name
 * @param {Function} PluginClass - constructor class
 */
function bridge( namespace, PluginClass ) {
	// add to jQuery fn namespace
	$.fn[ namespace ] = function( options ) {
		if ( typeof options === 'string' ) {
			// call plugin method when first argument is a string
			// get arguments for method
			var args = slice.call( arguments, 1 );

			for ( var i=0, len = this.length; i < len; i++ ) {
				var elem = this[i];
				var instance = $.data( elem, namespace );
				if ( !instance ) {
					logError( "cannot call methods on " + namespace + " prior to initialization; " +
						"attempted to call '" + options + "'" );
					continue;
				}
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
					logError( "no such method '" + options + "' for " + namespace + " instance" );
					continue;
				}

				// trigger method with arguments
				var returnValue = instance[ options ].apply( instance, args );

				// break look and return first value if provided
				if ( returnValue !== undefined ) {
					return returnValue;
				}
			}
			// return this if no return value
			return this;
		} else {
			return this.each( function() {
				var instance = $.data( this, namespace );
				if ( instance ) {
					// apply options & init
					instance.option( options );
					instance._init();
				} else {
					// initialize new instance
					instance = new PluginClass( this, options );
					$.data( this, namespace, instance );
				}
			});
		}
	};

}

// -------------------------- bridget -------------------------- //

/**
 * converts a Prototypical class into a proper jQuery plugin
 *	 the class must have a ._init method
 * @param {String} namespace - plugin name, used in $().pluginName
 * @param {Function} PluginClass - constructor class
 */
$.bridget = function( namespace, PluginClass ) {
	addOptionMethod( PluginClass );
	bridge( namespace, PluginClass );
};

return $.bridget;

}

// transport
if ( typeof define === 'function' && define.amd ) {
	// AMD
	define( 'jquery-bridget/jquery.bridget',[ 'jquery' ], defineBridget );
} else if ( typeof exports === 'object' ) {
	defineBridget( require('jquery') );
} else {
	// get jquery from browser global
	defineBridget( window.jQuery );
}

})( window );

/*!
 * getStyleProperty v1.0.4
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {

var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
	if ( !propName ) {
		return;
	}

	// test standard property first
	if ( typeof docElemStyle[ propName ] === 'string' ) {
		return propName;
	}

	// capitalize
	propName = propName.charAt(0).toUpperCase() + propName.slice(1);

	// test vendor specific properties
	var prefixed;
	for ( var i=0, len = prefixes.length; i < len; i++ ) {
		prefixed = prefixes[i] + propName;
		if ( typeof docElemStyle[ prefixed ] === 'string' ) {
			return prefixed;
		}
	}
}

// transport
if ( typeof define === 'function' && define.amd ) {
	// AMD
	define( 'get-style-property/get-style-property',[],function() {
		return getStyleProperty;
	});
} else if ( typeof exports === 'object' ) {
	// CommonJS for Component
	module.exports = getStyleProperty;
} else {
	// browser global
	window.getStyleProperty = getStyleProperty;
}

})( window );

/*!
 * getSize v1.2.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false, console: false */

( function( window, undefined ) {



// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
	var num = parseFloat( value );
	// not a percent like '100%', and a number
	var isValid = value.indexOf('%') === -1 && !isNaN( num );
	return isValid && num;
}

function noop() {}

var logError = typeof console === 'undefined' ? noop :
	function( message ) {
		console.error( message );
	};

// -------------------------- measurements -------------------------- //

var measurements = [
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'paddingBottom',
	'marginLeft',
	'marginRight',
	'marginTop',
	'marginBottom',
	'borderLeftWidth',
	'borderRightWidth',
	'borderTopWidth',
	'borderBottomWidth'
];

function getZeroSize() {
	var size = {
		width: 0,
		height: 0,
		innerWidth: 0,
		innerHeight: 0,
		outerWidth: 0,
		outerHeight: 0
	};
	for ( var i=0, len = measurements.length; i < len; i++ ) {
		var measurement = measurements[i];
		size[ measurement ] = 0;
	}
	return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- setup -------------------------- //

var isSetup = false;

var getStyle, boxSizingProp, isBoxSizeOuter;

/**
 * setup vars and functions
 * do it on initial getSize(), rather than on script load
 * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function setup() {
	// setup once
	if ( isSetup ) {
		return;
	}
	isSetup = true;

	var getComputedStyle = window.getComputedStyle;
	getStyle = ( function() {
		var getStyleFn = getComputedStyle ?
			function( elem ) {
				return getComputedStyle( elem, null );
			} :
			function( elem ) {
				return elem.currentStyle;
			};

			return function getStyle( elem ) {
				var style = getStyleFn( elem );
				if ( !style ) {
					logError( 'Style returned ' + style +
						'. Are you running this code in a hidden iframe on Firefox? ' +
						'See http://bit.ly/getsizebug1' );
				}
				return style;
			};
	})();

	// -------------------------- box sizing -------------------------- //

	boxSizingProp = getStyleProperty('boxSizing');

	/**
	 * WebKit measures the outer-width on style.width on border-box elems
	 * IE & Firefox measures the inner-width
	 */
	if ( boxSizingProp ) {
		var div = document.createElement('div');
		div.style.width = '200px';
		div.style.padding = '1px 2px 3px 4px';
		div.style.borderStyle = 'solid';
		div.style.borderWidth = '1px 2px 3px 4px';
		div.style[ boxSizingProp ] = 'border-box';

		var body = document.body || document.documentElement;
		body.appendChild( div );
		var style = getStyle( div );

		isBoxSizeOuter = getStyleSize( style.width ) === 200;
		body.removeChild( div );
	}

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
	setup();

	// use querySeletor if elem is string
	if ( typeof elem === 'string' ) {
		elem = document.querySelector( elem );
	}

	// do not proceed on non-objects
	if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
		return;
	}

	var style = getStyle( elem );

	// if hidden, everything is 0
	if ( style.display === 'none' ) {
		return getZeroSize();
	}

	var size = {};
	size.width = elem.offsetWidth;
	size.height = elem.offsetHeight;

	var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
		style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

	// get all measurements
	for ( var i=0, len = measurements.length; i < len; i++ ) {
		var measurement = measurements[i];
		var value = style[ measurement ];
		value = mungeNonPixel( elem, value );
		var num = parseFloat( value );
		// any 'auto', 'medium' value will be 0
		size[ measurement ] = !isNaN( num ) ? num : 0;
	}

	var paddingWidth = size.paddingLeft + size.paddingRight;
	var paddingHeight = size.paddingTop + size.paddingBottom;
	var marginWidth = size.marginLeft + size.marginRight;
	var marginHeight = size.marginTop + size.marginBottom;
	var borderWidth = size.borderLeftWidth + size.borderRightWidth;
	var borderHeight = size.borderTopWidth + size.borderBottomWidth;

	var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

	// overwrite width and height if we can get it from style
	var styleWidth = getStyleSize( style.width );
	if ( styleWidth !== false ) {
		size.width = styleWidth +
			// add padding and border unless it's already including it
			( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
	}

	var styleHeight = getStyleSize( style.height );
	if ( styleHeight !== false ) {
		size.height = styleHeight +
			// add padding and border unless it's already including it
			( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
	}

	size.innerWidth = size.width - ( paddingWidth + borderWidth );
	size.innerHeight = size.height - ( paddingHeight + borderHeight );

	size.outerWidth = size.width + marginWidth;
	size.outerHeight = size.height + marginHeight;

	return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
	// IE8 and has percent value
	if ( window.getComputedStyle || value.indexOf('%') === -1 ) {
		return value;
	}
	var style = elem.style;
	// Remember the original values
	var left = style.left;
	var rs = elem.runtimeStyle;
	var rsLeft = rs && rs.left;

	// Put in the new values to get a computed value out
	if ( rsLeft ) {
		rs.left = elem.currentStyle.left;
	}
	style.left = value;
	value = style.pixelLeft;

	// Revert the changed values
	style.left = left;
	if ( rsLeft ) {
		rs.left = rsLeft;
	}

	return value;
}

return getSize;

}

// transport
if ( typeof define === 'function' && define.amd ) {
	// AMD for RequireJS
	define( 'get-size/get-size',[ 'get-style-property/get-style-property' ], defineGetSize );
} else if ( typeof exports === 'object' ) {
	// CommonJS for Component
	module.exports = defineGetSize( require('desandro-get-style-property') );
} else {
	// browser global
	window.getSize = defineGetSize( window.getStyleProperty );
}

})( window );

/*!
 * eventie v1.0.6
 * event binding helper
 *	 eventie.bind( elem, 'click', myFn )
 *	 eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
	var event = window.event;
	// add event.target
	event.target = event.target || event.srcElement || obj;
	return event;
}

if ( docElem.addEventListener ) {
	bind = function( obj, type, fn ) {
		obj.addEventListener( type, fn, false );
	};
} else if ( docElem.attachEvent ) {
	bind = function( obj, type, fn ) {
		obj[ type + fn ] = fn.handleEvent ?
			function() {
				var event = getIEEvent( obj );
				fn.handleEvent.call( fn, event );
			} :
			function() {
				var event = getIEEvent( obj );
				fn.call( obj, event );
			};
		obj.attachEvent( "on" + type, obj[ type + fn ] );
	};
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
	unbind = function( obj, type, fn ) {
		obj.removeEventListener( type, fn, false );
	};
} else if ( docElem.detachEvent ) {
	unbind = function( obj, type, fn ) {
		obj.detachEvent( "on" + type, obj[ type + fn ] );
		try {
			delete obj[ type + fn ];
		} catch ( err ) {
			// can't delete window object properties
			obj[ type + fn ] = undefined;
		}
	};
}

var eventie = {
	bind: bind,
	unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
	// AMD
	define( 'eventie/eventie',eventie );
} else if ( typeof exports === 'object' ) {
	// CommonJS
	module.exports = eventie;
} else {
	// browser global
	window.eventie = eventie;
}

})( window );

/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {


		/**
		 * Class for managing events.
		 * Can be extended to provide event functionality in other classes.
		 *
		 * @class EventEmitter Manages event registering and emitting.
		 */
		function EventEmitter() {}

		// Shortcuts to improve speed and size
		var proto = EventEmitter.prototype;
		var exports = this;
		var originalGlobalValue = exports.EventEmitter;

		/**
		 * Finds the index of the listener for the event in its storage array.
		 *
		 * @param {Function[]} listeners Array of listeners to search through.
		 * @param {Function} listener Method to look for.
		 * @return {Number} Index of the specified listener, -1 if not found
		 * @api private
		 */
		function indexOfListener(listeners, listener) {
				var i = listeners.length;
				while (i--) {
						if (listeners[i].listener === listener) {
								return i;
						}
				}

				return -1;
		}

		/**
		 * Alias a method while keeping the context correct, to allow for overwriting of target method.
		 *
		 * @param {String} name The name of the target method.
		 * @return {Function} The aliased method
		 * @api private
		 */
		function alias(name) {
				return function aliasClosure() {
						return this[name].apply(this, arguments);
				};
		}

		/**
		 * Returns the listener array for the specified event.
		 * Will initialise the event object and listener arrays if required.
		 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
		 * Each property in the object response is an array of listener functions.
		 *
		 * @param {String|RegExp} evt Name of the event to return the listeners from.
		 * @return {Function[]|Object} All listener functions for the event.
		 */
		proto.getListeners = function getListeners(evt) {
				var events = this._getEvents();
				var response;
				var key;

				// Return a concatenated array of all matching events if
				// the selector is a regular expression.
				if (evt instanceof RegExp) {
						response = {};
						for (key in events) {
								if (events.hasOwnProperty(key) && evt.test(key)) {
										response[key] = events[key];
								}
						}
				}
				else {
						response = events[evt] || (events[evt] = []);
				}

				return response;
		};

		/**
		 * Takes a list of listener objects and flattens it into a list of listener functions.
		 *
		 * @param {Object[]} listeners Raw listener objects.
		 * @return {Function[]} Just the listener functions.
		 */
		proto.flattenListeners = function flattenListeners(listeners) {
				var flatListeners = [];
				var i;

				for (i = 0; i < listeners.length; i += 1) {
						flatListeners.push(listeners[i].listener);
				}

				return flatListeners;
		};

		/**
		 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
		 *
		 * @param {String|RegExp} evt Name of the event to return the listeners from.
		 * @return {Object} All listener functions for an event in an object.
		 */
		proto.getListenersAsObject = function getListenersAsObject(evt) {
				var listeners = this.getListeners(evt);
				var response;

				if (listeners instanceof Array) {
						response = {};
						response[evt] = listeners;
				}

				return response || listeners;
		};

		/**
		 * Adds a listener function to the specified event.
		 * The listener will not be added if it is a duplicate.
		 * If the listener returns true then it will be removed after it is called.
		 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
		 *
		 * @param {String|RegExp} evt Name of the event to attach the listener to.
		 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.addListener = function addListener(evt, listener) {
				var listeners = this.getListenersAsObject(evt);
				var listenerIsWrapped = typeof listener === 'object';
				var key;

				for (key in listeners) {
						if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
								listeners[key].push(listenerIsWrapped ? listener : {
										listener: listener,
										once: false
								});
						}
				}

				return this;
		};

		/**
		 * Alias of addListener
		 */
		proto.on = alias('addListener');

		/**
		 * Semi-alias of addListener. It will add a listener that will be
		 * automatically removed after its first execution.
		 *
		 * @param {String|RegExp} evt Name of the event to attach the listener to.
		 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.addOnceListener = function addOnceListener(evt, listener) {
				return this.addListener(evt, {
						listener: listener,
						once: true
				});
		};

		/**
		 * Alias of addOnceListener.
		 */
		proto.once = alias('addOnceListener');

		/**
		 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
		 * You need to tell it what event names should be matched by a regex.
		 *
		 * @param {String} evt Name of the event to create.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.defineEvent = function defineEvent(evt) {
				this.getListeners(evt);
				return this;
		};

		/**
		 * Uses defineEvent to define multiple events.
		 *
		 * @param {String[]} evts An array of event names to define.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.defineEvents = function defineEvents(evts) {
				for (var i = 0; i < evts.length; i += 1) {
						this.defineEvent(evts[i]);
				}
				return this;
		};

		/**
		 * Removes a listener function from the specified event.
		 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
		 *
		 * @param {String|RegExp} evt Name of the event to remove the listener from.
		 * @param {Function} listener Method to remove from the event.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.removeListener = function removeListener(evt, listener) {
				var listeners = this.getListenersAsObject(evt);
				var index;
				var key;

				for (key in listeners) {
						if (listeners.hasOwnProperty(key)) {
								index = indexOfListener(listeners[key], listener);

								if (index !== -1) {
										listeners[key].splice(index, 1);
								}
						}
				}

				return this;
		};

		/**
		 * Alias of removeListener
		 */
		proto.off = alias('removeListener');

		/**
		 * Adds listeners in bulk using the manipulateListeners method.
		 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
		 * You can also pass it a regular expression to add the array of listeners to all events that match it.
		 * Yeah, this function does quite a bit. That's probably a bad thing.
		 *
		 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
		 * @param {Function[]} [listeners] An optional array of listener functions to add.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.addListeners = function addListeners(evt, listeners) {
				// Pass through to manipulateListeners
				return this.manipulateListeners(false, evt, listeners);
		};

		/**
		 * Removes listeners in bulk using the manipulateListeners method.
		 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
		 * You can also pass it an event name and an array of listeners to be removed.
		 * You can also pass it a regular expression to remove the listeners from all events that match it.
		 *
		 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
		 * @param {Function[]} [listeners] An optional array of listener functions to remove.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.removeListeners = function removeListeners(evt, listeners) {
				// Pass through to manipulateListeners
				return this.manipulateListeners(true, evt, listeners);
		};

		/**
		 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
		 * The first argument will determine if the listeners are removed (true) or added (false).
		 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
		 * You can also pass it an event name and an array of listeners to be added/removed.
		 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
		 *
		 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
		 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
		 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
				var i;
				var value;
				var single = remove ? this.removeListener : this.addListener;
				var multiple = remove ? this.removeListeners : this.addListeners;

				// If evt is an object then pass each of its properties to this method
				if (typeof evt === 'object' && !(evt instanceof RegExp)) {
						for (i in evt) {
								if (evt.hasOwnProperty(i) && (value = evt[i])) {
										// Pass the single listener straight through to the singular method
										if (typeof value === 'function') {
												single.call(this, i, value);
										}
										else {
												// Otherwise pass back to the multiple function
												multiple.call(this, i, value);
										}
								}
						}
				}
				else {
						// So evt must be a string
						// And listeners must be an array of listeners
						// Loop over it and pass each one to the multiple method
						i = listeners.length;
						while (i--) {
								single.call(this, evt, listeners[i]);
						}
				}

				return this;
		};

		/**
		 * Removes all listeners from a specified event.
		 * If you do not specify an event then all listeners will be removed.
		 * That means every event will be emptied.
		 * You can also pass a regex to remove all events that match it.
		 *
		 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.removeEvent = function removeEvent(evt) {
				var type = typeof evt;
				var events = this._getEvents();
				var key;

				// Remove different things depending on the state of evt
				if (type === 'string') {
						// Remove all listeners for the specified event
						delete events[evt];
				}
				else if (evt instanceof RegExp) {
						// Remove all events matching the regex.
						for (key in events) {
								if (events.hasOwnProperty(key) && evt.test(key)) {
										delete events[key];
								}
						}
				}
				else {
						// Remove all listeners in all events
						delete this._events;
				}

				return this;
		};

		/**
		 * Alias of removeEvent.
		 *
		 * Added to mirror the node API.
		 */
		proto.removeAllListeners = alias('removeEvent');

		/**
		 * Emits an event of your choice.
		 * When emitted, every listener attached to that event will be executed.
		 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
		 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
		 * So they will not arrive within the array on the other side, they will be separate.
		 * You can also pass a regular expression to emit to all events that match it.
		 *
		 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
		 * @param {Array} [args] Optional array of arguments to be passed to each listener.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.emitEvent = function emitEvent(evt, args) {
				var listeners = this.getListenersAsObject(evt);
				var listener;
				var i;
				var key;
				var response;

				for (key in listeners) {
						if (listeners.hasOwnProperty(key)) {
								i = listeners[key].length;

								while (i--) {
										// If the listener returns true then it shall be removed from the event
										// The function is executed either with a basic call or an apply if there is an args array
										listener = listeners[key][i];

										if (listener.once === true) {
												this.removeListener(evt, listener.listener);
										}

										response = listener.listener.apply(this, args || []);

										if (response === this._getOnceReturnValue()) {
												this.removeListener(evt, listener.listener);
										}
								}
						}
				}

				return this;
		};

		/**
		 * Alias of emitEvent
		 */
		proto.trigger = alias('emitEvent');

		/**
		 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
		 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
		 *
		 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
		 * @param {...*} Optional additional arguments to be passed to each listener.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.emit = function emit(evt) {
				var args = Array.prototype.slice.call(arguments, 1);
				return this.emitEvent(evt, args);
		};

		/**
		 * Sets the current value to check against when executing listeners. If a
		 * listeners return value matches the one set here then it will be removed
		 * after execution. This value defaults to true.
		 *
		 * @param {*} value The new value to check for when executing listeners.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.setOnceReturnValue = function setOnceReturnValue(value) {
				this._onceReturnValue = value;
				return this;
		};

		/**
		 * Fetches the current value to check against when executing listeners. If
		 * the listeners return value matches this one then it should be removed
		 * automatically. It will return true by default.
		 *
		 * @return {*|Boolean} The current value to check for or the default, true.
		 * @api private
		 */
		proto._getOnceReturnValue = function _getOnceReturnValue() {
				if (this.hasOwnProperty('_onceReturnValue')) {
						return this._onceReturnValue;
				}
				else {
						return true;
				}
		};

		/**
		 * Fetches the events object and creates one if required.
		 *
		 * @return {Object} The events storage object.
		 * @api private
		 */
		proto._getEvents = function _getEvents() {
				return this._events || (this._events = {});
		};

		/**
		 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
		 *
		 * @return {Function} Non conflicting EventEmitter class.
		 */
		EventEmitter.noConflict = function noConflict() {
				exports.EventEmitter = originalGlobalValue;
				return EventEmitter;
		};

		// Expose the class either via AMD, CommonJS or the global object
		if (typeof define === 'function' && define.amd) {
				define('eventEmitter/EventEmitter',[],function () {
						return EventEmitter;
				});
		}
		else if (typeof module === 'object' && module.exports){
				module.exports = EventEmitter;
		}
		else {
				exports.EventEmitter = EventEmitter;
		}
}.call(this));

/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {



var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
	// throw out non-functions
	if ( typeof fn !== 'function' ) {
		return;
	}

	if ( docReady.isReady ) {
		// ready now, hit it
		fn();
	} else {
		// queue function when ready
		queue.push( fn );
	}
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
	// bail if already triggered or IE8 document is not ready just yet
	var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
	if ( docReady.isReady || isIE8NotReady ) {
		return;
	}

	trigger();
}

function trigger() {
	docReady.isReady = true;
	// process queue
	for ( var i=0, len = queue.length; i < len; i++ ) {
		var fn = queue[i];
		fn();
	}
}

function defineDocReady( eventie ) {
	// trigger ready if page is ready
	if ( document.readyState === 'complete' ) {
		trigger();
	} else {
		// listen for events
		eventie.bind( document, 'DOMContentLoaded', onReady );
		eventie.bind( document, 'readystatechange', onReady );
		eventie.bind( window, 'load', onReady );
	}

	return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
	// AMD
	define( 'doc-ready/doc-ready',[ 'eventie/eventie' ], defineDocReady );
} else if ( typeof exports === 'object' ) {
	module.exports = defineDocReady( require('eventie') );
} else {
	// browser global
	window.docReady = defineDocReady( window.eventie );
}

})( window );

/**
 * matchesSelector v1.0.3
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( ElemProto ) {



	var matchesMethod = ( function() {
		// check for the standard method name first
		if ( ElemProto.matches ) {
			return 'matches';
		}
		// check un-prefixed
		if ( ElemProto.matchesSelector ) {
			return 'matchesSelector';
		}
		// check vendor prefixes
		var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

		for ( var i=0, len = prefixes.length; i < len; i++ ) {
			var prefix = prefixes[i];
			var method = prefix + 'MatchesSelector';
			if ( ElemProto[ method ] ) {
				return method;
			}
		}
	})();

	// ----- match ----- //

	function match( elem, selector ) {
		return elem[ matchesMethod ]( selector );
	}

	// ----- appendToFragment ----- //

	function checkParent( elem ) {
		// not needed if already has parent
		if ( elem.parentNode ) {
			return;
		}
		var fragment = document.createDocumentFragment();
		fragment.appendChild( elem );
	}

	// ----- query ----- //

	// fall back to using QSA
	// thx @jonathantneal https://gist.github.com/3062955
	function query( elem, selector ) {
		// append to fragment if no parent
		checkParent( elem );

		// match elem with all selected elems of parent
		var elems = elem.parentNode.querySelectorAll( selector );
		for ( var i=0, len = elems.length; i < len; i++ ) {
			// return true if match
			if ( elems[i] === elem ) {
				return true;
			}
		}
		// otherwise return false
		return false;
	}

	// ----- matchChild ----- //

	function matchChild( elem, selector ) {
		checkParent( elem );
		return match( elem, selector );
	}

	// ----- matchesSelector ----- //

	var matchesSelector;

	if ( matchesMethod ) {
		// IE9 supports matchesSelector, but doesn't work on orphaned elems
		// check for that
		var div = document.createElement('div');
		var supportsOrphans = match( div, 'div' );
		matchesSelector = supportsOrphans ? match : matchChild;
	} else {
		matchesSelector = query;
	}

	// transport
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( 'matches-selector/matches-selector',[],function() {
			return matchesSelector;
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = matchesSelector;
	}
	else {
		// browser global
		window.matchesSelector = matchesSelector;
	}

})( Element.prototype );

/**
 * Fizzy UI utils v1.0.1
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
	/*global define: false, module: false, require: false */

	// universal module definition

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'fizzy-ui-utils/utils',[
			'doc-ready/doc-ready',
			'matches-selector/matches-selector'
		], function( docReady, matchesSelector ) {
			return factory( window, docReady, matchesSelector );
		});
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			window,
			require('doc-ready'),
			require('desandro-matches-selector')
		);
	} else {
		// browser global
		window.fizzyUIUtils = factory(
			window,
			window.docReady,
			window.matchesSelector
		);
	}

}( window, function factory( window, docReady, matchesSelector ) {



var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
	for ( var prop in b ) {
		a[ prop ] = b[ prop ];
	}
	return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
	return ( ( num % div ) + div ) % div;
};

// ----- isArray ----- //

var objToString = Object.prototype.toString;
utils.isArray = function( obj ) {
	return objToString.call( obj ) == '[object Array]';
};

// ----- makeArray ----- //

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
	var ary = [];
	if ( utils.isArray( obj ) ) {
		// use object if already an array
		ary = obj;
	} else if ( obj && typeof obj.length == 'number' ) {
		// convert nodeList to array
		for ( var i=0, len = obj.length; i < len; i++ ) {
			ary.push( obj[i] );
		}
	} else {
		// array of single index
		ary.push( obj );
	}
	return ary;
};

// ----- indexOf ----- //

// index of helper cause IE8
utils.indexOf = Array.prototype.indexOf ? function( ary, obj ) {
		return ary.indexOf( obj );
	} : function( ary, obj ) {
		for ( var i=0, len = ary.length; i < len; i++ ) {
			if ( ary[i] === obj ) {
				return i;
			}
		}
		return -1;
	};

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
	var index = utils.indexOf( ary, obj );
	if ( index != -1 ) {
		ary.splice( index, 1 );
	}
};

// ----- isElement ----- //

// http://stackoverflow.com/a/384380/182183
utils.isElement = ( typeof HTMLElement == 'function' || typeof HTMLElement == 'object' ) ?
	function isElementDOM2( obj ) {
		return obj instanceof HTMLElement;
	} :
	function isElementQuirky( obj ) {
		return obj && typeof obj == 'object' &&
			obj.nodeType == 1 && typeof obj.nodeName == 'string';
	};

// ----- setText ----- //

utils.setText = ( function() {
	var setTextProperty;
	function setText( elem, text ) {
		// only check setTextProperty once
		setTextProperty = setTextProperty || ( document.documentElement.textContent !== undefined ? 'textContent' : 'innerText' );
		elem[ setTextProperty ] = text;
	}
	return setText;
})();

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
	while ( elem != document.body ) {
		elem = elem.parentNode;
		if ( matchesSelector( elem, selector ) ) {
			return elem;
		}
	}
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
	if ( typeof elem == 'string' ) {
		return document.querySelector( elem );
	}
	return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
	var method = 'on' + event.type;
	if ( this[ method ] ) {
		this[ method ]( event );
	}
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
	// make array of elems
	elems = utils.makeArray( elems );
	var ffElems = [];

	for ( var i=0, len = elems.length; i < len; i++ ) {
		var elem = elems[i];
		// check that elem is an actual element
		if ( !utils.isElement( elem ) ) {
			continue;
		}
		// filter & find items if we have a selector
		if ( selector ) {
			// filter siblings
			if ( matchesSelector( elem, selector ) ) {
				ffElems.push( elem );
			}
			// find children
			var childElems = elem.querySelectorAll( selector );
			// concat childElems to filterFound array
			for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
				ffElems.push( childElems[j] );
			}
		} else {
			ffElems.push( elem );
		}
	}

	return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
	// original method
	var method = _class.prototype[ methodName ];
	var timeoutName = methodName + 'Timeout';

	_class.prototype[ methodName ] = function() {
		var timeout = this[ timeoutName ];
		if ( timeout ) {
			clearTimeout( timeout );
		}
		var args = arguments;

		var _this = this;
		this[ timeoutName ] = setTimeout( function() {
			method.apply( _this, args );
			delete _this[ timeoutName ];
		}, threshold || 100 );
	};
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
	return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
		return $1 + '-' + $2;
	}).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-option attribute
 */
utils.htmlInit = function( WidgetClass, namespace ) {
	docReady( function() {
		var dashedNamespace = utils.toDashed( namespace );
		var elems = document.querySelectorAll( '.js-' + dashedNamespace );
		var dataAttr = 'data-' + dashedNamespace + '-options';

		for ( var i=0, len = elems.length; i < len; i++ ) {
			var elem = elems[i];
			var attr = elem.getAttribute( dataAttr );
			var options;
			try {
				options = attr && JSON.parse( attr );
			} catch ( error ) {
				// log error, do not initialize
				if ( console ) {
					console.error( 'Error parsing ' + dataAttr + ' on ' +
						elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
						error );
				}
				continue;
			}
			// initialize
			var instance = new WidgetClass( elem, options );
			// make available via $().data('layoutname')
			var jQuery = window.jQuery;
			if ( jQuery ) {
				jQuery.data( elem, namespace, instance );
			}
		}
	});
};

// -----	----- //

return utils;

}));

/**
 * Outlayer Item
 */

( function( window, factory ) {

	// universal module definition
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( 'outlayer/item',[
				'eventEmitter/EventEmitter',
				'get-size/get-size',
				'get-style-property/get-style-property',
				'fizzy-ui-utils/utils'
			],
			function( EventEmitter, getSize, getStyleProperty, utils ) {
				return factory( window, EventEmitter, getSize, getStyleProperty, utils );
			}
		);
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory(
			window,
			require('wolfy87-eventemitter'),
			require('get-size'),
			require('desandro-get-style-property'),
			require('fizzy-ui-utils')
		);
	} else {
		// browser global
		window.Outlayer = {};
		window.Outlayer.Item = factory(
			window,
			window.EventEmitter,
			window.getSize,
			window.getStyleProperty,
			window.fizzyUIUtils
		);
	}

}( window, function factory( window, EventEmitter, getSize, getStyleProperty, utils ) {


// ----- helpers ----- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
	function( elem ) {
		return getComputedStyle( elem, null );
	} :
	function( elem ) {
		return elem.currentStyle;
	};


function isEmptyObj( obj ) {
	for ( var prop in obj ) {
		return false;
	}
	prop = null;
	return true;
}

// -------------------------- CSS3 support -------------------------- //

var transitionProperty = getStyleProperty('transition');
var transformProperty = getStyleProperty('transform');
var supportsCSS3 = transitionProperty && transformProperty;
var is3d = !!getStyleProperty('perspective');

var transitionEndEvent = {
	WebkitTransition: 'webkitTransitionEnd',
	MozTransition: 'transitionend',
	OTransition: 'otransitionend',
	transition: 'transitionend'
}[ transitionProperty ];

// properties that could have vendor prefix
var prefixableProperties = [
	'transform',
	'transition',
	'transitionDuration',
	'transitionProperty'
];

// cache all vendor properties
var vendorProperties = ( function() {
	var cache = {};
	for ( var i=0, len = prefixableProperties.length; i < len; i++ ) {
		var prop = prefixableProperties[i];
		var supportedProp = getStyleProperty( prop );
		if ( supportedProp && supportedProp !== prop ) {
			cache[ prop ] = supportedProp;
		}
	}
	return cache;
})();

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
	if ( !element ) {
		return;
	}

	this.element = element;
	// parent layout class, i.e. Masonry, Isotope, or Packery
	this.layout = layout;
	this.position = {
		x: 0,
		y: 0
	};

	this._create();
}

// inherit EventEmitter
utils.extend( Item.prototype, EventEmitter.prototype );

Item.prototype._create = function() {
	// transition objects
	this._transn = {
		ingProperties: {},
		clean: {},
		onEnd: {}
	};

	this.css({
		position: 'absolute'
	});
};

// trigger specified handler for event type
Item.prototype.handleEvent = function( event ) {
	var method = 'on' + event.type;
	if ( this[ method ] ) {
		this[ method ]( event );
	}
};

Item.prototype.getSize = function() {
	this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
Item.prototype.css = function( style ) {
	var elemStyle = this.element.style;

	for ( var prop in style ) {
		// use vendor property if available
		var supportedProp = vendorProperties[ prop ] || prop;
		elemStyle[ supportedProp ] = style[ prop ];
	}
};

 // measure position, and sets it
Item.prototype.getPosition = function() {
	var style = getStyle( this.element );
	var layoutOptions = this.layout.options;
	var isOriginLeft = layoutOptions.isOriginLeft;
	var isOriginTop = layoutOptions.isOriginTop;
	var xValue = style[ isOriginLeft ? 'left' : 'right' ];
	var yValue = style[ isOriginTop ? 'top' : 'bottom' ];
	var x = parseInt( xValue, 10 );
	var y = parseInt( yValue, 10 );
	// convert percent to pixels
	var layoutSize = this.layout.size;
	x = xValue.indexOf('%') != -1 ? ( x / 100 ) * layoutSize.width : x;
	y = yValue.indexOf('%') != -1 ? ( y / 100 ) * layoutSize.height : y;

	// clean up 'auto' or other non-integer values
	x = isNaN( x ) ? 0 : x;
	y = isNaN( y ) ? 0 : y;
	// remove padding from measurement
	x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
	y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

	this.position.x = x;
	this.position.y = y;
};

// set settled position, apply padding
Item.prototype.layoutPosition = function() {
	var layoutSize = this.layout.size;
	var layoutOptions = this.layout.options;
	var style = {};

	// x
	var xPadding = layoutOptions.isOriginLeft ? 'paddingLeft' : 'paddingRight';
	var xProperty = layoutOptions.isOriginLeft ? 'left' : 'right';
	var xResetProperty = layoutOptions.isOriginLeft ? 'right' : 'left';

	var x = this.position.x + layoutSize[ xPadding ];
	// set in percentage or pixels
	style[ xProperty ] = this.getXValue( x );
	// reset other property
	style[ xResetProperty ] = '';

	// y
	var yPadding = layoutOptions.isOriginTop ? 'paddingTop' : 'paddingBottom';
	var yProperty = layoutOptions.isOriginTop ? 'top' : 'bottom';
	var yResetProperty = layoutOptions.isOriginTop ? 'bottom' : 'top';

	var y = this.position.y + layoutSize[ yPadding ];
	// set in percentage or pixels
	style[ yProperty ] = this.getYValue( y );
	// reset other property
	style[ yResetProperty ] = '';

	this.css( style );
	this.emitEvent( 'layout', [ this ] );
};

Item.prototype.getXValue = function( x ) {
	var layoutOptions = this.layout.options;
	return layoutOptions.percentPosition && !layoutOptions.isHorizontal ?
		( ( x / this.layout.size.width ) * 100 ) + '%' : x + 'px';
};

Item.prototype.getYValue = function( y ) {
	var layoutOptions = this.layout.options;
	return layoutOptions.percentPosition && layoutOptions.isHorizontal ?
		( ( y / this.layout.size.height ) * 100 ) + '%' : y + 'px';
};


Item.prototype._transitionTo = function( x, y ) {
	this.getPosition();
	// get current x & y from top/left
	var curX = this.position.x;
	var curY = this.position.y;

	var compareX = parseInt( x, 10 );
	var compareY = parseInt( y, 10 );
	var didNotMove = compareX === this.position.x && compareY === this.position.y;

	// save end position
	this.setPosition( x, y );

	// if did not move and not transitioning, just go to layout
	if ( didNotMove && !this.isTransitioning ) {
		this.layoutPosition();
		return;
	}

	var transX = x - curX;
	var transY = y - curY;
	var transitionStyle = {};
	transitionStyle.transform = this.getTranslate( transX, transY );

	this.transition({
		to: transitionStyle,
		onTransitionEnd: {
			transform: this.layoutPosition
		},
		isCleaning: true
	});
};

Item.prototype.getTranslate = function( x, y ) {
	// flip cooridinates if origin on right or bottom
	var layoutOptions = this.layout.options;
	x = layoutOptions.isOriginLeft ? x : -x;
	y = layoutOptions.isOriginTop ? y : -y;
	x = this.getXValue( x );
	y = this.getYValue( y );

	if ( is3d ) {
		return 'translate3d(' + x + ', ' + y + ', 0)';
	}

	return 'translate(' + x + ', ' + y + ')';
};

// non transition + transform support
Item.prototype.goTo = function( x, y ) {
	this.setPosition( x, y );
	this.layoutPosition();
};

// use transition and transforms if supported
Item.prototype.moveTo = supportsCSS3 ?
	Item.prototype._transitionTo : Item.prototype.goTo;

Item.prototype.setPosition = function( x, y ) {
	this.position.x = parseInt( x, 10 );
	this.position.y = parseInt( y, 10 );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
Item.prototype._nonTransition = function( args ) {
	this.css( args.to );
	if ( args.isCleaning ) {
		this._removeStyles( args.to );
	}
	for ( var prop in args.onTransitionEnd ) {
		args.onTransitionEnd[ prop ].call( this );
	}
};

/**
 * proper transition
 * @param {Object} args - arguments
 *	 @param {Object} to - style to transition to
 *	 @param {Object} from - style to start transition from
 *	 @param {Boolean} isCleaning - removes transition styles after transition
 *	 @param {Function} onTransitionEnd - callback
 */
Item.prototype._transition = function( args ) {
	// redirect to nonTransition if no transition duration
	if ( !parseFloat( this.layout.options.transitionDuration ) ) {
		this._nonTransition( args );
		return;
	}

	var _transition = this._transn;
	// keep track of onTransitionEnd callback by css property
	for ( var prop in args.onTransitionEnd ) {
		_transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
	}
	// keep track of properties that are transitioning
	for ( prop in args.to ) {
		_transition.ingProperties[ prop ] = true;
		// keep track of properties to clean up when transition is done
		if ( args.isCleaning ) {
			_transition.clean[ prop ] = true;
		}
	}

	// set from styles
	if ( args.from ) {
		this.css( args.from );
		// force redraw. http://blog.alexmaccaw.com/css-transitions
		var h = this.element.offsetHeight;
		// hack for JSHint to hush about unused var
		h = null;
	}
	// enable transition
	this.enableTransition( args.to );
	// set styles that are transitioning
	this.css( args.to );

	this.isTransitioning = true;

};

// dash before all cap letters, including first for
// WebkitTransform => -webkit-transform
function toDashedAll( str ) {
	return str.replace( /([A-Z])/g, function( $1 ) {
		return '-' + $1.toLowerCase();
	});
}

var transitionProps = 'opacity,' +
	toDashedAll( vendorProperties.transform || 'transform' );

Item.prototype.enableTransition = function(/* style */) {
	// HACK changing transitionProperty during a transition
	// will cause transition to jump
	if ( this.isTransitioning ) {
		return;
	}

	// make `transition: foo, bar, baz` from style object
	// HACK un-comment this when enableTransition can work
	// while a transition is happening
	// var transitionValues = [];
	// for ( var prop in style ) {
	//	 // dash-ify camelCased properties like WebkitTransition
	//	 prop = vendorProperties[ prop ] || prop;
	//	 transitionValues.push( toDashedAll( prop ) );
	// }
	// enable transition styles
	this.css({
		transitionProperty: transitionProps,
		transitionDuration: this.layout.options.transitionDuration
	});
	// listen for transition end event
	this.element.addEventListener( transitionEndEvent, this, false );
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

// ----- events ----- //

Item.prototype.onwebkitTransitionEnd = function( event ) {
	this.ontransitionend( event );
};

Item.prototype.onotransitionend = function( event ) {
	this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
	'-webkit-transform': 'transform',
	'-moz-transform': 'transform',
	'-o-transform': 'transform'
};

Item.prototype.ontransitionend = function( event ) {
	// disregard bubbled events from children
	if ( event.target !== this.element ) {
		return;
	}
	var _transition = this._transn;
	// get property name of transitioned property, convert to prefix-free
	var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

	// remove property that has completed transitioning
	delete _transition.ingProperties[ propertyName ];
	// check if any properties are still transitioning
	if ( isEmptyObj( _transition.ingProperties ) ) {
		// all properties have completed transitioning
		this.disableTransition();
	}
	// clean style
	if ( propertyName in _transition.clean ) {
		// clean up style
		this.element.style[ event.propertyName ] = '';
		delete _transition.clean[ propertyName ];
	}
	// trigger onTransitionEnd callback
	if ( propertyName in _transition.onEnd ) {
		var onTransitionEnd = _transition.onEnd[ propertyName ];
		onTransitionEnd.call( this );
		delete _transition.onEnd[ propertyName ];
	}

	this.emitEvent( 'transitionEnd', [ this ] );
};

Item.prototype.disableTransition = function() {
	this.removeTransitionStyles();
	this.element.removeEventListener( transitionEndEvent, this, false );
	this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
Item.prototype._removeStyles = function( style ) {
	// clean up transition styles
	var cleanStyle = {};
	for ( var prop in style ) {
		cleanStyle[ prop ] = '';
	}
	this.css( cleanStyle );
};

var cleanTransitionStyle = {
	transitionProperty: '',
	transitionDuration: ''
};

Item.prototype.removeTransitionStyles = function() {
	// remove transition
	this.css( cleanTransitionStyle );
};

// ----- show/hide/remove ----- //

// remove element from DOM
Item.prototype.removeElem = function() {
	this.element.parentNode.removeChild( this.element );
	// remove display: none
	this.css({ display: '' });
	this.emitEvent( 'remove', [ this ] );
};

Item.prototype.remove = function() {
	// just remove element if no transition support or no transition
	if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
		this.removeElem();
		return;
	}

	// start transition
	var _this = this;
	this.once( 'transitionEnd', function() {
		_this.removeElem();
	});
	this.hide();
};

Item.prototype.reveal = function() {
	delete this.isHidden;
	// remove display: none
	this.css({ display: '' });

	var options = this.layout.options;

	var onTransitionEnd = {};
	var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
	onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;

	this.transition({
		from: options.hiddenStyle,
		to: options.visibleStyle,
		isCleaning: true,
		onTransitionEnd: onTransitionEnd
	});
};

Item.prototype.onRevealTransitionEnd = function() {
	// check if still visible
	// during transition, item may have been hidden
	if ( !this.isHidden ) {
		this.emitEvent('reveal');
	}
};

/**
 * get style property use for hide/reveal transition end
 * @param {String} styleProperty - hiddenStyle/visibleStyle
 * @returns {String}
 */
Item.prototype.getHideRevealTransitionEndProperty = function( styleProperty ) {
	var optionStyle = this.layout.options[ styleProperty ];
	// use opacity
	if ( optionStyle.opacity ) {
		return 'opacity';
	}
	// get first property
	for ( var prop in optionStyle ) {
		return prop;
	}
};

Item.prototype.hide = function() {
	// set flag
	this.isHidden = true;
	// remove display: none
	this.css({ display: '' });

	var options = this.layout.options;

	var onTransitionEnd = {};
	var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
	onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;

	this.transition({
		from: options.visibleStyle,
		to: options.hiddenStyle,
		// keep hidden stuff hidden
		isCleaning: true,
		onTransitionEnd: onTransitionEnd
	});
};

Item.prototype.onHideTransitionEnd = function() {
	// check if still hidden
	// during transition, item may have been un-hidden
	if ( this.isHidden ) {
		this.css({ display: 'none' });
		this.emitEvent('hide');
	}
};

Item.prototype.destroy = function() {
	this.css({
		position: '',
		left: '',
		right: '',
		top: '',
		bottom: '',
		transition: '',
		transform: ''
	});
};

return Item;

}));

/*!
 * Outlayer v1.4.1
 * the brains and guts of a layout library
 * MIT license
 */

( function( window, factory ) {

	// universal module definition

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'outlayer/outlayer',[
				'eventie/eventie',
				'eventEmitter/EventEmitter',
				'get-size/get-size',
				'fizzy-ui-utils/utils',
				'./item'
			],
			function( eventie, EventEmitter, getSize, utils, Item ) {
				return factory( window, eventie, EventEmitter, getSize, utils, Item);
			}
		);
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			window,
			require('eventie'),
			require('wolfy87-eventemitter'),
			require('get-size'),
			require('fizzy-ui-utils'),
			require('./item')
		);
	} else {
		// browser global
		window.Outlayer = factory(
			window,
			window.eventie,
			window.EventEmitter,
			window.getSize,
			window.fizzyUIUtils,
			window.Outlayer.Item
		);
	}

}( window, function factory( window, eventie, EventEmitter, getSize, utils, Item ) {


// ----- vars ----- //

var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
	var queryElement = utils.getQueryElement( element );
	if ( !queryElement ) {
		if ( console ) {
			console.error( 'Bad element for ' + this.constructor.namespace +
				': ' + ( queryElement || element ) );
		}
		return;
	}
	this.element = queryElement;
	// add jQuery
	if ( jQuery ) {
		this.$element = jQuery( this.element );
	}

	// options
	this.options = utils.extend( {}, this.constructor.defaults );
	this.option( options );

	// add id for Outlayer.getFromElement
	var id = ++GUID;
	this.element.outlayerGUID = id; // expando
	instances[ id ] = this; // associate via id

	// kick it off
	this._create();

	if ( this.options.isInitLayout ) {
		this.layout();
	}
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
	containerStyle: {
		position: 'relative'
	},
	isInitLayout: true,
	isOriginLeft: true,
	isOriginTop: true,
	isResizeBound: true,
	isResizingContainer: true,
	// item options
	transitionDuration: '0.4s',
	hiddenStyle: {
		opacity: 0,
		transform: 'scale(0.001)'
	},
	visibleStyle: {
		opacity: 1,
		transform: 'scale(1)'
	}
};

// inherit EventEmitter
utils.extend( Outlayer.prototype, EventEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
Outlayer.prototype.option = function( opts ) {
	utils.extend( this.options, opts );
};

Outlayer.prototype._create = function() {
	// get items from children
	this.reloadItems();
	// elements that affect layout, but are not laid out
	this.stamps = [];
	this.stamp( this.options.stamp );
	// set container style
	utils.extend( this.element.style, this.options.containerStyle );

	// bind resize method
	if ( this.options.isResizeBound ) {
		this.bindResize();
	}
};

// goes through all children again and gets bricks in proper order
Outlayer.prototype.reloadItems = function() {
	// collection of item elements
	this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
Outlayer.prototype._itemize = function( elems ) {

	var itemElems = this._filterFindItemElements( elems );
	var Item = this.constructor.Item;

	// create new Outlayer Items for collection
	var items = [];
	for ( var i=0, len = itemElems.length; i < len; i++ ) {
		var elem = itemElems[i];
		var item = new Item( elem, this );
		items.push( item );
	}

	return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Outlayer.prototype._filterFindItemElements = function( elems ) {
	return utils.filterFindElements( elems, this.options.itemSelector );
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
Outlayer.prototype.getItemElements = function() {
	var elems = [];
	for ( var i=0, len = this.items.length; i < len; i++ ) {
		elems.push( this.items[i].element );
	}
	return elems;
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
Outlayer.prototype.layout = function() {
	this._resetLayout();
	this._manageStamps();

	// don't animate first layout
	var isInstant = this.options.isLayoutInstant !== undefined ?
		this.options.isLayoutInstant : !this._isLayoutInited;
	this.layoutItems( this.items, isInstant );

	// flag for initalized
	this._isLayoutInited = true;
};

// _init is alias for layout
Outlayer.prototype._init = Outlayer.prototype.layout;

/**
 * logic before any new layout
 */
Outlayer.prototype._resetLayout = function() {
	this.getSize();
};


Outlayer.prototype.getSize = function() {
	this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
Outlayer.prototype._getMeasurement = function( measurement, size ) {
	var option = this.options[ measurement ];
	var elem;
	if ( !option ) {
		// default to 0
		this[ measurement ] = 0;
	} else {
		// use option as an element
		if ( typeof option === 'string' ) {
			elem = this.element.querySelector( option );
		} else if ( utils.isElement( option ) ) {
			elem = option;
		}
		// use size of element, if element
		this[ measurement ] = elem ? getSize( elem )[ size ] : option;
	}
};

/**
 * layout a collection of item elements
 * @api public
 */
Outlayer.prototype.layoutItems = function( items, isInstant ) {
	items = this._getItemsForLayout( items );

	this._layoutItems( items, isInstant );

	this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
Outlayer.prototype._getItemsForLayout = function( items ) {
	var layoutItems = [];
	for ( var i=0, len = items.length; i < len; i++ ) {
		var item = items[i];
		if ( !item.isIgnored ) {
			layoutItems.push( item );
		}
	}
	return layoutItems;
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
Outlayer.prototype._layoutItems = function( items, isInstant ) {
	this._emitCompleteOnItems( 'layout', items );

	if ( !items || !items.length ) {
		// no items, emit event with empty array
		return;
	}

	var queue = [];

	for ( var i=0, len = items.length; i < len; i++ ) {
		var item = items[i];
		// get x/y object from method
		var position = this._getItemLayoutPosition( item );
		// enqueue
		position.item = item;
		position.isInstant = isInstant || item.isLayoutInstant;
		queue.push( position );
	}

	this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
Outlayer.prototype._getItemLayoutPosition = function( /* item */ ) {
	return {
		x: 0,
		y: 0
	};
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
Outlayer.prototype._processLayoutQueue = function( queue ) {
	for ( var i=0, len = queue.length; i < len; i++ ) {
		var obj = queue[i];
		this._positionItem( obj.item, obj.x, obj.y, obj.isInstant );
	}
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
Outlayer.prototype._positionItem = function( item, x, y, isInstant ) {
	if ( isInstant ) {
		// if not transition, just set CSS
		item.goTo( x, y );
	} else {
		item.moveTo( x, y );
	}
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
Outlayer.prototype._postLayout = function() {
	this.resizeContainer();
};

Outlayer.prototype.resizeContainer = function() {
	if ( !this.options.isResizingContainer ) {
		return;
	}
	var size = this._getContainerSize();
	if ( size ) {
		this._setContainerMeasure( size.width, true );
		this._setContainerMeasure( size.height, false );
	}
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *	 @param {Number} width
 *	 @param {Number} height
 */
Outlayer.prototype._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
	if ( measure === undefined ) {
		return;
	}

	var elemSize = this.size;
	// add padding and border width if border box
	if ( elemSize.isBorderBox ) {
		measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
			elemSize.borderLeftWidth + elemSize.borderRightWidth :
			elemSize.paddingBottom + elemSize.paddingTop +
			elemSize.borderTopWidth + elemSize.borderBottomWidth;
	}

	measure = Math.max( measure, 0 );
	this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * emit eventComplete on a collection of items events
 * @param {String} eventName
 * @param {Array} items - Outlayer.Items
 */
Outlayer.prototype._emitCompleteOnItems = function( eventName, items ) {
	var _this = this;
	function onComplete() {
		_this.dispatchEvent( eventName + 'Complete', null, [ items ] );
	}

	var count = items.length;
	if ( !items || !count ) {
		onComplete();
		return;
	}

	var doneCount = 0;
	function tick() {
		doneCount++;
		if ( doneCount === count ) {
			onComplete();
		}
	}

	// bind callback
	for ( var i=0, len = items.length; i < len; i++ ) {
		var item = items[i];
		item.once( eventName, tick );
	}
};

/**
 * emits events via eventEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
Outlayer.prototype.dispatchEvent = function( type, event, args ) {
	// add original event to arguments
	var emitArgs = event ? [ event ].concat( args ) : args;
	this.emitEvent( type, emitArgs );

	if ( jQuery ) {
		// set this.$element
		this.$element = this.$element || jQuery( this.element );
		if ( event ) {
			// create jQuery event
			var $event = jQuery.Event( event );
			$event.type = type;
			this.$element.trigger( $event, args );
		} else {
			// just trigger with type if no event available
			this.$element.trigger( type, args );
		}
	}
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
Outlayer.prototype.ignore = function( elem ) {
	var item = this.getItem( elem );
	if ( item ) {
		item.isIgnored = true;
	}
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Outlayer.prototype.unignore = function( elem ) {
	var item = this.getItem( elem );
	if ( item ) {
		delete item.isIgnored;
	}
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
Outlayer.prototype.stamp = function( elems ) {
	elems = this._find( elems );
	if ( !elems ) {
		return;
	}

	this.stamps = this.stamps.concat( elems );
	// ignore
	for ( var i=0, len = elems.length; i < len; i++ ) {
		var elem = elems[i];
		this.ignore( elem );
	}
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
Outlayer.prototype.unstamp = function( elems ) {
	elems = this._find( elems );
	if ( !elems ){
		return;
	}

	for ( var i=0, len = elems.length; i < len; i++ ) {
		var elem = elems[i];
		// filter out removed stamp elements
		utils.removeFrom( this.stamps, elem );
		this.unignore( elem );
	}

};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
Outlayer.prototype._find = function( elems ) {
	if ( !elems ) {
		return;
	}
	// if string, use argument as selector string
	if ( typeof elems === 'string' ) {
		elems = this.element.querySelectorAll( elems );
	}
	elems = utils.makeArray( elems );
	return elems;
};

Outlayer.prototype._manageStamps = function() {
	if ( !this.stamps || !this.stamps.length ) {
		return;
	}

	this._getBoundingRect();

	for ( var i=0, len = this.stamps.length; i < len; i++ ) {
		var stamp = this.stamps[i];
		this._manageStamp( stamp );
	}
};

// update boundingLeft / Top
Outlayer.prototype._getBoundingRect = function() {
	// get bounding rect for container element
	var boundingRect = this.element.getBoundingClientRect();
	var size = this.size;
	this._boundingRect = {
		left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
		top: boundingRect.top + size.paddingTop + size.borderTopWidth,
		right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
		bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
	};
};

/**
 * @param {Element} stamp
**/
Outlayer.prototype._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
Outlayer.prototype._getElementOffset = function( elem ) {
	var boundingRect = elem.getBoundingClientRect();
	var thisRect = this._boundingRect;
	var size = getSize( elem );
	var offset = {
		left: boundingRect.left - thisRect.left - size.marginLeft,
		top: boundingRect.top - thisRect.top - size.marginTop,
		right: thisRect.right - boundingRect.right - size.marginRight,
		bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
	};
	return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
Outlayer.prototype.handleEvent = function( event ) {
	var method = 'on' + event.type;
	if ( this[ method ] ) {
		this[ method ]( event );
	}
};

/**
 * Bind layout to window resizing
 */
Outlayer.prototype.bindResize = function() {
	// bind just one listener
	if ( this.isResizeBound ) {
		return;
	}
	eventie.bind( window, 'resize', this );
	this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
Outlayer.prototype.unbindResize = function() {
	if ( this.isResizeBound ) {
		eventie.unbind( window, 'resize', this );
	}
	this.isResizeBound = false;
};

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Outlayer.prototype.onresize = function() {
	if ( this.resizeTimeout ) {
		clearTimeout( this.resizeTimeout );
	}

	var _this = this;
	function delayed() {
		_this.resize();
		delete _this.resizeTimeout;
	}

	this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Outlayer.prototype.resize = function() {
	// don't trigger if size did not change
	// or if resize was unbound. See #9
	if ( !this.isResizeBound || !this.needsResizeLayout() ) {
		return;
	}

	this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
Outlayer.prototype.needsResizeLayout = function() {
	var size = getSize( this.element );
	// check that this.size and size are there
	// IE8 triggers resize on body size change, so they might not be
	var hasSizes = this.size && size;
	return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
Outlayer.prototype.addItems = function( elems ) {
	var items = this._itemize( elems );
	// add items to collection
	if ( items.length ) {
		this.items = this.items.concat( items );
	}
	return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.appended = function( elems ) {
	var items = this.addItems( elems );
	if ( !items.length ) {
		return;
	}
	// layout and reveal just the new items
	this.layoutItems( items, true );
	this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.prepended = function( elems ) {
	var items = this._itemize( elems );
	if ( !items.length ) {
		return;
	}
	// add items to beginning of collection
	var previousItems = this.items.slice(0);
	this.items = items.concat( previousItems );
	// start new layout
	this._resetLayout();
	this._manageStamps();
	// layout new stuff without transition
	this.layoutItems( items, true );
	this.reveal( items );
	// layout previous items
	this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.reveal = function( items ) {
	this._emitCompleteOnItems( 'reveal', items );

	var len = items && items.length;
	for ( var i=0; len && i < len; i++ ) {
		var item = items[i];
		item.reveal();
	}
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.hide = function( items ) {
	this._emitCompleteOnItems( 'hide', items );

	var len = items && items.length;
	for ( var i=0; len && i < len; i++ ) {
		var item = items[i];
		item.hide();
	}
};

/**
 * reveal item elements
 * @param {Array}, {Element}, {NodeList} items
 */
Outlayer.prototype.revealItemElements = function( elems ) {
	var items = this.getItems( elems );
	this.reveal( items );
};

/**
 * hide item elements
 * @param {Array}, {Element}, {NodeList} items
 */
Outlayer.prototype.hideItemElements = function( elems ) {
	var items = this.getItems( elems );
	this.hide( items );
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
Outlayer.prototype.getItem = function( elem ) {
	// loop through items to get the one that matches
	for ( var i=0, len = this.items.length; i < len; i++ ) {
		var item = this.items[i];
		if ( item.element === elem ) {
			// return item
			return item;
		}
	}
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
Outlayer.prototype.getItems = function( elems ) {
	elems = utils.makeArray( elems );
	var items = [];
	for ( var i=0, len = elems.length; i < len; i++ ) {
		var elem = elems[i];
		var item = this.getItem( elem );
		if ( item ) {
			items.push( item );
		}
	}

	return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.remove = function( elems ) {
	var removeItems = this.getItems( elems );

	this._emitCompleteOnItems( 'remove', removeItems );

	// bail if no items to remove
	if ( !removeItems || !removeItems.length ) {
		return;
	}

	for ( var i=0, len = removeItems.length; i < len; i++ ) {
		var item = removeItems[i];
		item.remove();
		// remove item from collection
		utils.removeFrom( this.items, item );
	}
};

// ----- destroy ----- //

// remove and disable Outlayer instance
Outlayer.prototype.destroy = function() {
	// clean up dynamic styles
	var style = this.element.style;
	style.height = '';
	style.position = '';
	style.width = '';
	// destroy items
	for ( var i=0, len = this.items.length; i < len; i++ ) {
		var item = this.items[i];
		item.destroy();
	}

	this.unbindResize();

	var id = this.element.outlayerGUID;
	delete instances[ id ]; // remove reference to instance by id
	delete this.element.outlayerGUID;
	// remove data for jQuery
	if ( jQuery ) {
		jQuery.removeData( this.element, this.constructor.namespace );
	}

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
	elem = utils.getQueryElement( elem );
	var id = elem && elem.outlayerGUID;
	return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
	// sub-class Outlayer
	function Layout() {
		Outlayer.apply( this, arguments );
	}
	// inherit Outlayer prototype, use Object.create if there
	if ( Object.create ) {
		Layout.prototype = Object.create( Outlayer.prototype );
	} else {
		utils.extend( Layout.prototype, Outlayer.prototype );
	}
	// set contructor, used for namespace and Item
	Layout.prototype.constructor = Layout;

	Layout.defaults = utils.extend( {}, Outlayer.defaults );
	// apply new options
	utils.extend( Layout.defaults, options );
	// keep prototype.settings for backwards compatibility (Packery v1.2.0)
	Layout.prototype.settings = {};

	Layout.namespace = namespace;

	Layout.data = Outlayer.data;

	// sub-class Item
	Layout.Item = function LayoutItem() {
		Item.apply( this, arguments );
	};

	Layout.Item.prototype = new Item();

	// -------------------------- declarative -------------------------- //

	utils.htmlInit( Layout, namespace );

	// -------------------------- jQuery bridge -------------------------- //

	// make into jQuery plugin
	if ( jQuery && jQuery.bridget ) {
		jQuery.bridget( namespace, Layout );
	}

	return Layout;
};

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}));


/**
 * Rect
 * low-level utility class for basic geometry
 */

( function( window, factory ) {

	// universal module definition
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'packery/js/rect',factory );
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory();
	} else {
		// browser global
		window.Packery = window.Packery || {};
		window.Packery.Rect = factory();
	}

}( window, function factory() {


// -------------------------- Packery -------------------------- //

// global namespace
var Packery = window.Packery = function() {};

// -------------------------- Rect -------------------------- //

function Rect( props ) {
	// extend properties from defaults
	for ( var prop in Rect.defaults ) {
		this[ prop ] = Rect.defaults[ prop ];
	}

	for ( prop in props ) {
		this[ prop ] = props[ prop ];
	}

}

// make available
Packery.Rect = Rect;

Rect.defaults = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
};

/**
 * Determines whether or not this rectangle wholly encloses another rectangle or point.
 * @param {Rect} rect
 * @returns {Boolean}
**/
Rect.prototype.contains = function( rect ) {
	// points don't have width or height
	var otherWidth = rect.width || 0;
	var otherHeight = rect.height || 0;
	return this.x <= rect.x &&
		this.y <= rect.y &&
		this.x + this.width >= rect.x + otherWidth &&
		this.y + this.height >= rect.y + otherHeight;
};

/**
 * Determines whether or not the rectangle intersects with another.
 * @param {Rect} rect
 * @returns {Boolean}
**/
Rect.prototype.overlaps = function( rect ) {
	var thisRight = this.x + this.width;
	var thisBottom = this.y + this.height;
	var rectRight = rect.x + rect.width;
	var rectBottom = rect.y + rect.height;

	// http://stackoverflow.com/a/306332
	return this.x < rectRight &&
		thisRight > rect.x &&
		this.y < rectBottom &&
		thisBottom > rect.y;
};

/**
 * @param {Rect} rect - the overlapping rect
 * @returns {Array} freeRects - rects representing the area around the rect
**/
Rect.prototype.getMaximalFreeRects = function( rect ) {

	// if no intersection, return false
	if ( !this.overlaps( rect ) ) {
		return false;
	}

	var freeRects = [];
	var freeRect;

	var thisRight = this.x + this.width;
	var thisBottom = this.y + this.height;
	var rectRight = rect.x + rect.width;
	var rectBottom = rect.y + rect.height;

	// top
	if ( this.y < rect.y ) {
		freeRect = new Rect({
			x: this.x,
			y: this.y,
			width: this.width,
			height: rect.y - this.y
		});
		freeRects.push( freeRect );
	}

	// right
	if ( thisRight > rectRight ) {
		freeRect = new Rect({
			x: rectRight,
			y: this.y,
			width: thisRight - rectRight,
			height: this.height
		});
		freeRects.push( freeRect );
	}

	// bottom
	if ( thisBottom > rectBottom ) {
		freeRect = new Rect({
			x: this.x,
			y: rectBottom,
			width: this.width,
			height: thisBottom - rectBottom
		});
		freeRects.push( freeRect );
	}

	// left
	if ( this.x < rect.x ) {
		freeRect = new Rect({
			x: this.x,
			y: this.y,
			width: rect.x - this.x,
			height: this.height
		});
		freeRects.push( freeRect );
	}

	return freeRects;
};

Rect.prototype.canFit = function( rect ) {
	return this.width >= rect.width && this.height >= rect.height;
};

return Rect;

}));

/**
 * Packer
 * bin-packing algorithm
 */

( function( window, factory ) {

	// universal module definition
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'packery/js/packer',[ './rect' ], factory );
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			require('./rect')
		);
	} else {
		// browser global
		var Packery = window.Packery = window.Packery || {};
		Packery.Packer = factory( Packery.Rect );
	}

}( window, function factory( Rect ) {


// -------------------------- Packer -------------------------- //

/**
 * @param {Number} width
 * @param {Number} height
 * @param {String} sortDirection
 *	 topLeft for vertical, leftTop for horizontal
 */
function Packer( width, height, sortDirection ) {
	this.width = width || 0;
	this.height = height || 0;
	this.sortDirection = sortDirection || 'downwardLeftToRight';

	this.reset();
}

Packer.prototype.reset = function() {
	this.spaces = [];
	this.newSpaces = [];

	var initialSpace = new Rect({
		x: 0,
		y: 0,
		width: this.width,
		height: this.height
	});

	this.spaces.push( initialSpace );
	// set sorter
	this.sorter = sorters[ this.sortDirection ] || sorters.downwardLeftToRight;
};

// change x and y of rect to fit with in Packer's available spaces
Packer.prototype.pack = function( rect ) {
	for ( var i=0, len = this.spaces.length; i < len; i++ ) {
		var space = this.spaces[i];
		if ( space.canFit( rect ) ) {
			this.placeInSpace( rect, space );
			break;
		}
	}
};

Packer.prototype.placeInSpace = function( rect, space ) {
	// place rect in space
	rect.x = space.x;
	rect.y = space.y;

	this.placed( rect );
};

// update spaces with placed rect
Packer.prototype.placed = function( rect ) {
	// update spaces
	var revisedSpaces = [];
	for ( var i=0, len = this.spaces.length; i < len; i++ ) {
		var space = this.spaces[i];
		var newSpaces = space.getMaximalFreeRects( rect );
		// add either the original space or the new spaces to the revised spaces
		if ( newSpaces ) {
			revisedSpaces.push.apply( revisedSpaces, newSpaces );
		} else {
			revisedSpaces.push( space );
		}
	}

	this.spaces = revisedSpaces;

	this.mergeSortSpaces();
};

Packer.prototype.mergeSortSpaces = function() {
	// remove redundant spaces
	Packer.mergeRects( this.spaces );
	this.spaces.sort( this.sorter );
};

// add a space back
Packer.prototype.addSpace = function( rect ) {
	this.spaces.push( rect );
	this.mergeSortSpaces();
};

// -------------------------- utility functions -------------------------- //

/**
 * Remove redundant rectangle from array of rectangles
 * @param {Array} rects: an array of Rects
 * @returns {Array} rects: an array of Rects
**/
Packer.mergeRects = function( rects ) {
	for ( var i=0, len = rects.length; i < len; i++ ) {
		var rect = rects[i];
		// skip over this rect if it was already removed
		if ( !rect ) {
			continue;
		}
		// clone rects we're testing, remove this rect
		var compareRects = rects.slice(0);
		// do not compare with self
		compareRects.splice( i, 1 );
		// compare this rect with others
		var removedCount = 0;
		for ( var j=0, jLen = compareRects.length; j < jLen; j++ ) {
			var compareRect = compareRects[j];
			// if this rect contains another,
			// remove that rect from test collection
			var indexAdjust = i > j ? 0 : 1;
			if ( rect.contains( compareRect ) ) {
				// console.log( 'current test rects:' + testRects.length, testRects );
				// console.log( i, j, indexAdjust, rect, compareRect );
				rects.splice( j + indexAdjust - removedCount, 1 );
				removedCount++;
			}
		}
	}

	return rects;
};


// -------------------------- sorters -------------------------- //

// functions for sorting rects in order
var sorters = {
	// top down, then left to right
	downwardLeftToRight: function( a, b ) {
		return a.y - b.y || a.x - b.x;
	},
	// left to right, then top down
	rightwardTopToBottom: function( a, b ) {
		return a.x - b.x || a.y - b.y;
	}
};


// --------------------------	-------------------------- //

return Packer;

}));
/**
 * Packery Item Element
**/

( function( window, factory ) {

	// universal module definition

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'packery/js/item',[
				'get-style-property/get-style-property',
				'outlayer/outlayer',
				'./rect'
			],
			factory );
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			require('desandro-get-style-property'),
			require('outlayer'),
			require('./rect')
		);
	} else {
		// browser global
		window.Packery.Item = factory(
			window.getStyleProperty,
			window.Outlayer,
			window.Packery.Rect
		);
	}

}( window, function factory( getStyleProperty, Outlayer, Rect ) {


// -------------------------- Item -------------------------- //

var transformProperty = getStyleProperty('transform');

// sub-class Item
var Item = function PackeryItem() {
	Outlayer.Item.apply( this, arguments );
};

Item.prototype = new Outlayer.Item();

var protoCreate = Item.prototype._create;
Item.prototype._create = function() {
	// call default _create logic
	protoCreate.call( this );
	this.rect = new Rect();
	// rect used for placing, in drag or Packery.fit()
	this.placeRect = new Rect();
};

// -------------------------- drag -------------------------- //

Item.prototype.dragStart = function() {
	this.getPosition();
	this.removeTransitionStyles();
	// remove transform property from transition
	if ( this.isTransitioning && transformProperty ) {
		this.element.style[ transformProperty ] = 'none';
	}
	this.getSize();
	// create place rect, used for position when dragged then dropped
	// or when positioning
	this.isPlacing = true;
	this.needsPositioning = false;
	this.positionPlaceRect( this.position.x, this.position.y );
	this.isTransitioning = false;
	this.didDrag = false;
};

/**
 * handle item when it is dragged
 * @param {Number} x - horizontal position of dragged item
 * @param {Number} y - vertical position of dragged item
 */
Item.prototype.dragMove = function( x, y ) {
	this.didDrag = true;
	var packerySize = this.layout.size;
	x -= packerySize.paddingLeft;
	y -= packerySize.paddingTop;
	this.positionPlaceRect( x, y );
};

Item.prototype.dragStop = function() {
	this.getPosition();
	var isDiffX = this.position.x != this.placeRect.x;
	var isDiffY = this.position.y != this.placeRect.y;
	// set post-drag positioning flag
	this.needsPositioning = isDiffX || isDiffY;
	// reset flag
	this.didDrag = false;
};

// -------------------------- placing -------------------------- //

/**
 * position a rect that will occupy space in the packer
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} isMaxYContained
 */
Item.prototype.positionPlaceRect = function( x, y, isMaxYOpen ) {
	this.placeRect.x = this.getPlaceRectCoord( x, true );
	this.placeRect.y = this.getPlaceRectCoord( y, false, isMaxYOpen );
};

/**
 * get x/y coordinate for place rect
 * @param {Number} coord - x or y
 * @param {Boolean} isX
 * @param {Boolean} isMaxOpen - does not limit value to outer bound
 * @returns {Number} coord - processed x or y
 */
Item.prototype.getPlaceRectCoord = function( coord, isX, isMaxOpen ) {
	var measure = isX ? 'Width' : 'Height';
	var size = this.size[ 'outer' + measure ];
	var segment = this.layout[ isX ? 'columnWidth' : 'rowHeight' ];
	var parentSize = this.layout.size[ 'inner' + measure ];

	// additional parentSize calculations for Y
	if ( !isX ) {
		parentSize = Math.max( parentSize, this.layout.maxY );
		// prevent gutter from bumping up height when non-vertical grid
		if ( !this.layout.rowHeight ) {
			parentSize -= this.layout.gutter;
		}
	}

	var max;

	if ( segment ) {
		segment += this.layout.gutter;
		// allow for last column to reach the edge
		parentSize += isX ? this.layout.gutter : 0;
		// snap to closest segment
		coord = Math.round( coord / segment );
		// contain to outer bound
		// contain non-growing bound, allow growing bound to grow
		var mathMethod;
		if ( this.layout.options.isHorizontal ) {
			mathMethod = !isX ? 'floor' : 'ceil';
		} else {
			mathMethod = isX ? 'floor' : 'ceil';
		}
		var maxSegments = Math[ mathMethod ]( parentSize / segment );
		maxSegments -= Math.ceil( size / segment );
		max = maxSegments;
	} else {
		max = parentSize - size;
	}

	coord = isMaxOpen ? coord : Math.min( coord, max );
	coord *= segment || 1;

	return Math.max( 0, coord );
};

Item.prototype.copyPlaceRectPosition = function() {
	this.rect.x = this.placeRect.x;
	this.rect.y = this.placeRect.y;
};

// -----	----- //

// remove element from DOM
Item.prototype.removeElem = function() {
	this.element.parentNode.removeChild( this.element );
	// add space back to packer
	this.layout.packer.addSpace( this.rect );
	this.emitEvent( 'remove', [ this ] );
};

// -----	----- //

return Item;

}));

/*!
 * Packery v1.4.2
 * bin-packing layout library
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * http://packery.metafizzy.co
 * Copyright 2015 Metafizzy
 */

( function( window, factory ) {

	// universal module definition
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( [
				'classie/classie',
				'get-size/get-size',
				'outlayer/outlayer',
				'packery/js/rect',
				'packery/js/packer',
				'packery/js/item'
			],
			factory );
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			require('desandro-classie'),
			require('get-size'),
			require('outlayer'),
			require('./rect'),
			require('./packer'),
			require('./item')
		);
	} else {
		// browser global
		window.Packery = factory(
			window.classie,
			window.getSize,
			window.Outlayer,
			window.Packery.Rect,
			window.Packery.Packer,
			window.Packery.Item
		);
	}

}( window, function factory( classie, getSize, Outlayer, Rect, Packer, Item ) {


// ----- Rect ----- //

// allow for pixel rounding errors IE8-IE11 & Firefox; #227
Rect.prototype.canFit = function( rect ) {
	return this.width >= rect.width - 1 && this.height >= rect.height - 1;
};

// -------------------------- Packery -------------------------- //

// create an Outlayer layout class
var Packery = Outlayer.create('packery');
Packery.Item = Item;

Packery.prototype._create = function() {
	// call super
	Outlayer.prototype._create.call( this );

	// initial properties
	this.packer = new Packer();

	// Left over from v1.0
	this.stamp( this.options.stamped );

	// create drag handlers
	var _this = this;
	this.handleDraggabilly = {
		dragStart: function() {
			_this.itemDragStart( this.element );
		},
		dragMove: function() {
			_this.itemDragMove( this.element, this.position.x, this.position.y );
		},
		dragEnd: function() {
			_this.itemDragEnd( this.element );
		}
	};

	this.handleUIDraggable = {
		start: function handleUIDraggableStart( event, ui ) {
			// HTML5 may trigger dragstart, dismiss HTML5 dragging
			if ( !ui ) {
				return;
			}
			_this.itemDragStart( event.currentTarget );
		},
		drag: function handleUIDraggableDrag( event, ui ) {
			if ( !ui ) {
				return;
			}
			_this.itemDragMove( event.currentTarget, ui.position.left, ui.position.top );
		},
		stop: function handleUIDraggableStop( event, ui ) {
			if ( !ui ) {
				return;
			}
			_this.itemDragEnd( event.currentTarget );
		}
	};

};


// ----- init & layout ----- //

/**
 * logic before any new layout
 */
Packery.prototype._resetLayout = function() {
	this.getSize();

	this._getMeasurements();

	// reset packer
	var packer = this.packer;
	// packer settings, if horizontal or vertical
	if ( this.options.isHorizontal ) {
		packer.width = Number.POSITIVE_INFINITY;
		packer.height = this.size.innerHeight + this.gutter;
		packer.sortDirection = 'rightwardTopToBottom';
	} else {
		packer.width = this.size.innerWidth + this.gutter;
		packer.height = Number.POSITIVE_INFINITY;
		packer.sortDirection = 'downwardLeftToRight';
	}

	packer.reset();

	// layout
	this.maxY = 0;
	this.maxX = 0;
};

/**
 * update columnWidth, rowHeight, & gutter
 * @private
 */
Packery.prototype._getMeasurements = function() {
	this._getMeasurement( 'columnWidth', 'width' );
	this._getMeasurement( 'rowHeight', 'height' );
	this._getMeasurement( 'gutter', 'width' );
};

Packery.prototype._getItemLayoutPosition = function( item ) {
	this._packItem( item );
	return item.rect;
};


/**
 * layout item in packer
 * @param {Packery.Item} item
 */
Packery.prototype._packItem = function( item ) {
	this._setRectSize( item.element, item.rect );
	// pack the rect in the packer
	this.packer.pack( item.rect );
	this._setMaxXY( item.rect );
};

/**
 * set max X and Y value, for size of container
 * @param {Packery.Rect} rect
 * @private
 */
Packery.prototype._setMaxXY = function( rect ) {
	this.maxX = Math.max( rect.x + rect.width, this.maxX );
	this.maxY = Math.max( rect.y + rect.height, this.maxY );
};

/**
 * set the width and height of a rect, applying columnWidth and rowHeight
 * @param {Element} elem
 * @param {Packery.Rect} rect
 */
Packery.prototype._setRectSize = function( elem, rect ) {
	var size = getSize( elem );
	var w = size.outerWidth;
	var h = size.outerHeight;
	// size for columnWidth and rowHeight, if available
	// only check if size is non-zero, #177
	if ( w || h ) {
		w = this._applyGridGutter( w, this.columnWidth );
		h = this._applyGridGutter( h, this.rowHeight );
	}
	// rect must fit in packer
	rect.width = Math.min( w, this.packer.width );
	rect.height = Math.min( h, this.packer.height );
};

/**
 * fits item to columnWidth/rowHeight and adds gutter
 * @param {Number} measurement - item width or height
 * @param {Number} gridSize - columnWidth or rowHeight
 * @returns measurement
 */
Packery.prototype._applyGridGutter = function( measurement, gridSize ) {
	// just add gutter if no gridSize
	if ( !gridSize ) {
		return measurement + this.gutter;
	}
	gridSize += this.gutter;
	// fit item to columnWidth/rowHeight
	var remainder = measurement % gridSize;
	var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
	measurement = Math[ mathMethod ]( measurement / gridSize ) * gridSize;
	return measurement;
};

Packery.prototype._getContainerSize = function() {
	if ( this.options.isHorizontal ) {
		return {
			width: this.maxX - this.gutter
		};
	} else {
		return {
			height: this.maxY - this.gutter
		};
	}
};


// -------------------------- stamp -------------------------- //

/**
 * makes space for element
 * @param {Element} elem
 */
Packery.prototype._manageStamp = function( elem ) {

	var item = this.getItem( elem );
	var rect;
	if ( item && item.isPlacing ) {
		rect = item.placeRect;
	} else {
		var offset = this._getElementOffset( elem );
		rect = new Rect({
			x: this.options.isOriginLeft ? offset.left : offset.right,
			y: this.options.isOriginTop ? offset.top : offset.bottom
		});
	}

	this._setRectSize( elem, rect );
	// save its space in the packer
	this.packer.placed( rect );
	this._setMaxXY( rect );
};

// -------------------------- methods -------------------------- //

function verticalSorter( a, b ) {
	return a.position.y - b.position.y || a.position.x - b.position.x;
}

function horizontalSorter( a, b ) {
	return a.position.x - b.position.x || a.position.y - b.position.y;
}

Packery.prototype.sortItemsByPosition = function() {
	var sorter = this.options.isHorizontal ? horizontalSorter : verticalSorter;
	this.items.sort( sorter );
};

/**
 * Fit item element in its current position
 * Packery will position elements around it
 * useful for expanding elements
 *
 * @param {Element} elem
 * @param {Number} x - horizontal destination position, optional
 * @param {Number} y - vertical destination position, optional
 */
Packery.prototype.fit = function( elem, x, y ) {
	var item = this.getItem( elem );
	if ( !item ) {
		return;
	}

	// prepare internal properties
	this._getMeasurements();

	// stamp item to get it out of layout
	this.stamp( item.element );
	// required for positionPlaceRect
	item.getSize();
	// set placing flag
	item.isPlacing = true;
	// fall back to current position for fitting
	x = x === undefined ? item.rect.x: x;
	y = y === undefined ? item.rect.y: y;

	// position it best at its destination
	item.positionPlaceRect( x, y, true );

	this._bindFitEvents( item );
	item.moveTo( item.placeRect.x, item.placeRect.y );
	// layout everything else
	this.layout();

	// return back to regularly scheduled programming
	this.unstamp( item.element );
	this.sortItemsByPosition();
	// un set placing flag, back to normal
	item.isPlacing = false;
	// copy place rect position
	item.copyPlaceRectPosition();
};

/**
 * emit event when item is fit and other items are laid out
 * @param {Packery.Item} item
 * @private
 */
Packery.prototype._bindFitEvents = function( item ) {
	var _this = this;
	var ticks = 0;
	function tick() {
		ticks++;
		if ( ticks != 2 ) {
			return;
		}
		_this.dispatchEvent( 'fitComplete', null, [ item ] );
	}
	// when item is laid out
	item.on( 'layout', function() {
		tick();
		return true;
	});
	// when all items are laid out
	this.on( 'layoutComplete', function() {
		tick();
		return true;
	});
};

// -------------------------- resize -------------------------- //

// debounced, layout on resize
Packery.prototype.resize = function() {
	// don't trigger if size did not change
	var size = getSize( this.element );
	// check that this.size and size are there
	// IE8 triggers resize on body size change, so they might not be
	var hasSizes = this.size && size;
	var innerSize = this.options.isHorizontal ? 'innerHeight' : 'innerWidth';
	if ( hasSizes && size[ innerSize ] == this.size[ innerSize ] ) {
		return;
	}

	this.layout();
};

// -------------------------- drag -------------------------- //

/**
 * handle an item drag start event
 * @param {Element} elem
 */
Packery.prototype.itemDragStart = function( elem ) {
	this.stamp( elem );
	var item = this.getItem( elem );
	if ( item ) {
		item.dragStart();
	}
};

/**
 * handle an item drag move event
 * @param {Element} elem
 * @param {Number} x - horizontal change in position
 * @param {Number} y - vertical change in position
 */
Packery.prototype.itemDragMove = function( elem, x, y ) {
	var item = this.getItem( elem );
	if ( item ) {
		item.dragMove( x, y );
	}

	// debounce
	var _this = this;
	// debounce triggering layout
	function delayed() {
		_this.layout();
		delete _this.dragTimeout;
	}

	this.clearDragTimeout();

	this.dragTimeout = setTimeout( delayed, 40 );
};

Packery.prototype.clearDragTimeout = function() {
	if ( this.dragTimeout ) {
		clearTimeout( this.dragTimeout );
	}
};

/**
 * handle an item drag end event
 * @param {Element} elem
 */
Packery.prototype.itemDragEnd = function( elem ) {
	var item = this.getItem( elem );
	var itemDidDrag;
	if ( item ) {
		itemDidDrag = item.didDrag;
		item.dragStop();
	}
	// if elem didn't move, or if it doesn't need positioning
	// unignore and unstamp and call it a day
	if ( !item || ( !itemDidDrag && !item.needsPositioning ) ) {
		this.unstamp( elem );
		return;
	}
	// procced with dragged item

	classie.add( item.element, 'is-positioning-post-drag' );

	// save this var, as it could get reset in dragStart
	var onLayoutComplete = this._getDragEndLayoutComplete( elem, item );

	if ( item.needsPositioning ) {
		item.on( 'layout', onLayoutComplete );
		item.moveTo( item.placeRect.x, item.placeRect.y );
	} else if ( item ) {
		// item didn't need placement
		item.copyPlaceRectPosition();
	}

	this.clearDragTimeout();
	this.on( 'layoutComplete', onLayoutComplete );
	this.layout();

};

/**
 * get drag end callback
 * @param {Element} elem
 * @param {Packery.Item} item
 * @returns {Function} onLayoutComplete
 */
Packery.prototype._getDragEndLayoutComplete = function( elem, item ) {
	var itemNeedsPositioning = item && item.needsPositioning;
	var completeCount = 0;
	var asyncCount = itemNeedsPositioning ? 2 : 1;
	var _this = this;

	return function onLayoutComplete() {
		completeCount++;
		// don't proceed if not complete
		if ( completeCount != asyncCount ) {
			return true;
		}
		// reset item
		if ( item ) {
			classie.remove( item.element, 'is-positioning-post-drag' );
			item.isPlacing = false;
			item.copyPlaceRectPosition();
		}

		_this.unstamp( elem );
		// only sort when item moved
		_this.sortItemsByPosition();

		// emit item drag event now that everything is done
		if ( itemNeedsPositioning ) {
			_this.dispatchEvent( 'dragItemPositioned', null, [ item ] );
		}
		// listen once
		return true;
	};
};

/**
 * binds Draggabilly events
 * @param {Draggabilly} draggie
 */
Packery.prototype.bindDraggabillyEvents = function( draggie ) {
	draggie.on( 'dragStart', this.handleDraggabilly.dragStart );
	draggie.on( 'dragMove', this.handleDraggabilly.dragMove );
	draggie.on( 'dragEnd', this.handleDraggabilly.dragEnd );
};

/**
 * binds jQuery UI Draggable events
 * @param {jQuery} $elems
 */
Packery.prototype.bindUIDraggableEvents = function( $elems ) {
	$elems
		.on( 'dragstart', this.handleUIDraggable.start )
		.on( 'drag', this.handleUIDraggable.drag )
		.on( 'dragstop', this.handleUIDraggable.stop );
};

Packery.Rect = Rect;
Packery.Packer = Packer;

return Packery;

}));


// imagesLoaded v3.1.8 - JavaScript is all like "You images are done yet or what?" | MIT License
// --------------------------------------------------------------------------------------------------------------------------------------------------------
(function(window, factory) {
	// universal module definition
	/*global define: false, module: false, require: false */
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['eventEmitter/EventEmitter', 'eventie/eventie'], function(EventEmitter, eventie) {
			return factory(window, EventEmitter, eventie);
		});
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory(
		window, require('wolfy87-eventemitter'), require('eventie'));
	} else {
		// browser global
		window.imagesLoaded = factory(
		window, window.EventEmitter, window.eventie);
	}
})(window,


// --------------------------  factory -------------------------- //
function factory(window, EventEmitter, eventie) {

	var $ = window.jQuery;
	var console = window.console;
	var hasConsole = typeof console !== 'undefined';

	// -------------------------- helpers -------------------------- //
	// extend objects
	function extend(a, b) {
		for (var prop in b) {
			a[prop] = b[prop];
		}
		return a;
	}
	var objToString = Object.prototype.toString;

	function isArray(obj) {
		return objToString.call(obj) === '[object Array]';
	}

	// turn element or nodeList into an array
	function makeArray(obj) {
		var ary = [];
		if (isArray(obj)) {
			// use object if already an array
			ary = obj;
		} else if (typeof obj.length === 'number') {
			// convert nodeList to array
			for (var i = 0, len = obj.length; i < len; i++) {
				ary.push(obj[i]);
			}
		} else {
			// array of single index
			ary.push(obj);
		}
		return ary;
	}

	// -------------------------- imagesLoaded -------------------------- //
	/**
	 * @param {Array, Element, NodeList, String} elem
	 * @param {Object or Function} options - if function, use as callback
	 * @param {Function} onAlways - callback function
	 */
	function ImagesLoaded(elem, options, onAlways) {
		// coerce ImagesLoaded() without new, to be new ImagesLoaded()
		if (!(this instanceof ImagesLoaded)) {
			return new ImagesLoaded(elem, options);
		}
		// use elem as selector string
		if (typeof elem === 'string') {
			elem = document.querySelectorAll(elem);
		}
		this.elements = makeArray(elem);
		this.options = extend({}, this.options);
		if (typeof options === 'function') {
			onAlways = options;
		} else {
			extend(this.options, options);
		}
		if (onAlways) {
			this.on('always', onAlways);
		}
		this.getImages();
		if ($) {
			// add jQuery Deferred object
			this.jqDeferred = new $.Deferred();
		}
		// HACK check async to allow time to bind listeners
		var _this = this;
		setTimeout(function() {
			_this.check();
		});
	}
	ImagesLoaded.prototype = new EventEmitter();
	ImagesLoaded.prototype.options = {};
	ImagesLoaded.prototype.getImages = function() {
		this.images = [];
		// filter & find items if we have an item selector
		for (var i = 0, len = this.elements.length; i < len; i++) {
			var elem = this.elements[i];
			// filter siblings
			if (elem.nodeName === 'IMG') {
				this.addImage(elem);
			}
			// find children
			// no non-element nodes, #143
			var nodeType = elem.nodeType;
			if (!nodeType || !(nodeType === 1 || nodeType === 9 || nodeType === 11)) {
				continue;
			}
			var childElems = elem.querySelectorAll('img');
			// concat childElems to filterFound array
			for (var j = 0, jLen = childElems.length; j < jLen; j++) {
				var img = childElems[j];
				this.addImage(img);
			}
		}
	};
	/**
	 * @param {Image} img
	 */
	ImagesLoaded.prototype.addImage = function(img) {
		var loadingImage = new LoadingImage(img);
		this.images.push(loadingImage);
	};
	ImagesLoaded.prototype.check = function() {
		var _this = this;
		var checkedCount = 0;
		var length = this.images.length;
		this.hasAnyBroken = false;
		// complete if no images
		if (!length) {
			this.complete();
			return;
		}

		function onConfirm(image, message) {
			if (_this.options.debug && hasConsole) {
				console.log('confirm', image, message);
			}
			_this.progress(image);
			checkedCount++;
			if (checkedCount === length) {
				_this.complete();
			}
			return true; // bind once
		}
		for (var i = 0; i < length; i++) {
			var loadingImage = this.images[i];
			loadingImage.on('confirm', onConfirm);
			loadingImage.check();
		}
	};
	ImagesLoaded.prototype.progress = function(image) {
		this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
		// HACK - Chrome triggers event before object properties have changed. #83
		var _this = this;
		setTimeout(function() {
			_this.emit('progress', _this, image);
			if (_this.jqDeferred && _this.jqDeferred.notify) {
				_this.jqDeferred.notify(_this, image);
			}
		});
	};
	ImagesLoaded.prototype.complete = function() {
		var eventName = this.hasAnyBroken ? 'fail' : 'done';
		this.isComplete = true;
		var _this = this;
		// HACK - another setTimeout so that confirm happens after progress
		setTimeout(function() {
			_this.emit(eventName, _this);
			_this.emit('always', _this);
			if (_this.jqDeferred) {
				var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
				_this.jqDeferred[jqMethod](_this);
			}
		});
	};

	// -------------------------- jquery -------------------------- //
	if ($) {
		$.fn.imagesLoaded = function(options, callback) {
			var instance = new ImagesLoaded(this, options, callback);
			return instance.jqDeferred.promise($(this));
		};
	}

	// --------------------------  -------------------------- //
	function LoadingImage(img) {
		this.img = img;
	}
	LoadingImage.prototype = new EventEmitter();
	LoadingImage.prototype.check = function() {
		// first check cached any previous images that have same src
		var resource = cache[this.img.src] || new Resource(this.img.src);
		if (resource.isConfirmed) {
			this.confirm(resource.isLoaded, 'cached was confirmed');
			return;
		}
		// If complete is true and browser supports natural sizes,
		// try to check for image status manually.
		if (this.img.complete && this.img.naturalWidth !== undefined) {
			// report based on naturalWidth
			this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
			return;
		}
		// If none of the checks above matched, simulate loading on detached element.
		var _this = this;
		resource.on('confirm', function(resrc, message) {
			_this.confirm(resrc.isLoaded, message);
			return true;
		});
		resource.check();
	};
	LoadingImage.prototype.confirm = function(isLoaded, message) {
		this.isLoaded = isLoaded;
		this.emit('confirm', this, message);
	};

	// -------------------------- Resource -------------------------- //
	// Resource checks each src, only once
	// separate class from LoadingImage to prevent memory leaks. See #115
	var cache = {};

	function Resource(src) {
		this.src = src;
		// add to cache
		cache[src] = this;
	}
	Resource.prototype = new EventEmitter();
	Resource.prototype.check = function() {
		// only trigger checking once
		if (this.isChecked) {
			return;
		}
		// simulate loading on detached element
		var proxyImage = new Image();
		eventie.bind(proxyImage, 'load', this);
		eventie.bind(proxyImage, 'error', this);
		proxyImage.src = this.src;
		// set flag
		this.isChecked = true;
	};

	// ----- events ----- //
	// trigger specified handler for event type
	Resource.prototype.handleEvent = function(event) {
		var method = 'on' + event.type;
		if (this[method]) {
			this[method](event);
		}
	};
	Resource.prototype.onload = function(event) {
		this.confirm(true, 'onload');
		this.unbindProxyEvents(event);
	};
	Resource.prototype.onerror = function(event) {
		this.confirm(false, 'onerror');
		this.unbindProxyEvents(event);
	};

	// ----- confirm ----- //
	Resource.prototype.confirm = function(isLoaded, message) {
		this.isConfirmed = true;
		this.isLoaded = isLoaded;
		this.emit('confirm', this, message);
	};
	Resource.prototype.unbindProxyEvents = function(event) {
		eventie.unbind(event.target, 'load', this);
		eventie.unbind(event.target, 'error', this);
	};

	// -----  ----- //
	return ImagesLoaded;

});


// smooth-scroll v7.0.2
// copyright Chris Ferdinandi | http://github.com/cferdinandi/smooth-scroll | Licensed under MIT: http://gomakethings.com/mit/
// --------------------------------------------------------------------------------------------------------------------------------------------------------
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.smoothScroll = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var smoothScroll = {}; // Object for public APIs
	var supports = !!root.document.querySelector && !!root.addEventListener; // Feature test
	var settings, eventTimeout, fixedHeader, headerHeight;

	// Default settings
	var defaults = {
		speed: 500,
		easing: 'easeInOutCubic',
		offset: 0,
		updateURL: true,
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Get the height of an element.
	 * @private
	 * @param  {Node} elem The element to get the height of
	 * @return {Number}    The element's height in pixels
	 */
	var getHeight = function ( elem ) {
		return Math.max( elem.scrollHeight, elem.offsetHeight, elem.clientHeight );
	};

	/**
	 * Get the closest matching element up the DOM tree.
	 * @private
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	var getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var supports = 'classList' in document.documentElement;
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( supports ) {
					if ( elem.classList.contains( selector.substr(1) ) ) {
						return elem;
					}
				} else {
					if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
						return elem;
					}
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Escape special characters for use with querySelector
	 * @private
	 * @param {String} id The anchor ID to escape
	 * @author Mathias Bynens
	 * @link https://github.com/mathiasbynens/CSS.escape
	 */
	var escapeCharacters = function ( id ) {
		var string = String(id);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then throw an
			// `InvalidCharacterError` exception and terminate these steps.
			if (codeUnit === 0x0000) {
				throw new InvalidCharacterError(
					'Invalid character: the input contains U+0000.'
				);
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, […]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), […]
				(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
				(
					index === 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit === 0x002D
				)
			) {
				// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (
				codeUnit >= 0x0080 ||
				codeUnit === 0x002D ||
				codeUnit === 0x005F ||
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// http://dev.w3.org/csswg/cssom/#escape-a-character
			result += '\\' + string.charAt(index);

		}
		return result;
	};

	/**
	 * Calculate the easing pattern
	 * @private
	 * @link https://gist.github.com/gre/1650294
	 * @param {String} type Easing pattern
	 * @param {Number} time Time animation should take to complete
	 * @returns {Number}
	 */
	var easingPattern = function ( type, time ) {
		var pattern;
		if ( type === 'easeInQuad' ) pattern = time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuad' ) pattern = time * (2 - time); // decelerating to zero velocity
		if ( type === 'easeInOutQuad' ) pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
		if ( type === 'easeInCubic' ) pattern = time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutCubic' ) pattern = (--time) * time * time + 1; // decelerating to zero velocity
		if ( type === 'easeInOutCubic' ) pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
		if ( type === 'easeInQuart' ) pattern = time * time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuart' ) pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
		if ( type === 'easeInOutQuart' ) pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
		if ( type === 'easeInQuint' ) pattern = time * time * time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuint' ) pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
		if ( type === 'easeInOutQuint' ) pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
		return pattern || time; // no easing, no acceleration
	};

	/**
	 * Calculate how far to scroll
	 * @private
	 * @param {Element} anchor The anchor element to scroll to
	 * @param {Number} headerHeight Height of a fixed header, if any
	 * @param {Number} offset Number of pixels by which to offset scroll
	 * @returns {Number}
	 */
	var getEndLocation = function ( anchor, headerHeight, offset ) {
		var location = 0;
		if (anchor.offsetParent) {
			do {
				location += anchor.offsetTop;
				anchor = anchor.offsetParent;
			} while (anchor);
		}
		location = location - headerHeight - offset;
		return location >= 0 ? location : 0;
	};

	/**
	 * Determine the document's height
	 * @private
	 * @returns {Number}
	 */
	var getDocumentHeight = function () {
		return Math.max(
			root.document.body.scrollHeight, root.document.documentElement.scrollHeight,
			root.document.body.offsetHeight, root.document.documentElement.offsetHeight,
			root.document.body.clientHeight, root.document.documentElement.clientHeight
		);
	};

	/**
	 * Convert data-options attribute into an object of key/value pairs
	 * @private
	 * @param {String} options Link-specific options as a data attribute string
	 * @returns {Object}
	 */
	var getDataOptions = function ( options ) {
		return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse( options );
	};

	/**
	 * Update the URL
	 * @private
	 * @param {Element} anchor The element to scroll to
	 * @param {Boolean} url Whether or not to update the URL history
	 */
	var updateUrl = function ( anchor, url ) {
		if ( root.history.pushState && (url || url === 'true') ) {
			root.history.pushState( null, null, [root.location.protocol, '//', root.location.host, root.location.pathname, root.location.search, anchor].join('') );
		}
	};

	var getHeaderHeight = function ( header ) {
		return header === null ? 0 : ( getHeight( header ) + header.offsetTop );
	};

	/**
	 * Start/stop the scrolling animation
	 * @public
	 * @param {Element} toggle The element that toggled the scroll event
	 * @param {Element} anchor The element to scroll to
	 * @param {Object} options
	 */
	smoothScroll.animateScroll = function ( toggle, anchor, options ) {

		// Options and overrides
		var overrides = getDataOptions( toggle ? toggle.getAttribute('data-options') : null );
		var settings = extend( settings || defaults, options || {}, overrides ); // Merge user options with defaults
		anchor = '#' + escapeCharacters(anchor.substr(1)); // Escape special characters and leading numbers

		// Selectors and variables
		var anchorElem = anchor === '#' ? root.document.documentElement : root.document.querySelector(anchor);
		var startLocation = root.pageYOffset; // Current location on the page
		if ( !fixedHeader ) { fixedHeader = root.document.querySelector('[data-scroll-header]'); }  // Get the fixed header if not already set
		if ( !headerHeight ) { headerHeight = getHeaderHeight( fixedHeader ); } // Get the height of a fixed header if one exists and not already set
		var endLocation = getEndLocation( anchorElem, headerHeight, parseInt(settings.offset, 10) ); // Scroll to location
		var animationInterval; // interval timer
		var distance = endLocation - startLocation; // distance to travel
		var documentHeight = getDocumentHeight();
		var timeLapsed = 0;
		var percentage, position;

		// Update URL
		updateUrl(anchor, settings.updateURL);

		/**
		 * Stop the scroll animation when it reaches its target (or the bottom/top of page)
		 * @private
		 * @param {Number} position Current position on the page
		 * @param {Number} endLocation Scroll to location
		 * @param {Number} animationInterval How much to scroll on this loop
		 */
		var stopAnimateScroll = function (position, endLocation, animationInterval) {
			var currentLocation = root.pageYOffset;
			if ( position == endLocation || currentLocation == endLocation || ( (root.innerHeight + currentLocation) >= documentHeight ) ) {
				clearInterval(animationInterval);
				anchorElem.focus();
				settings.callback( toggle, anchor ); // Run callbacks after animation complete
			}
		};

		/**
		 * Loop scrolling animation
		 * @private
		 */
		var loopAnimateScroll = function () {
			timeLapsed += 16;
			percentage = ( timeLapsed / parseInt(settings.speed, 10) );
			percentage = ( percentage > 1 ) ? 1 : percentage;
			position = startLocation + ( distance * easingPattern(settings.easing, percentage) );
			root.scrollTo( 0, Math.floor(position) );
			stopAnimateScroll(position, endLocation, animationInterval);
		};

		/**
		 * Set interval timer
		 * @private
		 */
		var startAnimateScroll = function () {
			animationInterval = setInterval(loopAnimateScroll, 16);
		};

		/**
		 * Reset position to fix weird iOS bug
		 * @link https://github.com/cferdinandi/smooth-scroll/issues/45
		 */
		if ( root.pageYOffset === 0 ) {
			root.scrollTo( 0, 0 );
		}

		// Start scrolling animation
		startAnimateScroll();

	};

	/**
	 * If smooth scroll element clicked, animate scroll
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = getClosest(event.target, '[data-scroll]');
		if ( toggle && toggle.tagName.toLowerCase() === 'a' ) {
			event.preventDefault(); // Prevent default click event
			smoothScroll.animateScroll( toggle, toggle.hash, settings); // Animate scroll
		}
	};

	/**
	 * On window scroll and resize, only run events at a rate of 15fps for better performance
	 * @private
	 * @param  {Function} eventTimeout Timeout function
	 * @param  {Object} settings
	 */
	var eventThrottler = function (event) {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout(function() {
				eventTimeout = null; // Reset timeout
				headerHeight = getHeaderHeight( fixedHeader ); // Get the height of a fixed header if one exists
			}, 66);
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	smoothScroll.destroy = function () {

		// If plugin isn't already initialized, stop
		if ( !settings ) return;

		// Remove event listeners
		root.document.removeEventListener( 'click', eventHandler, false );
		root.removeEventListener( 'resize', eventThrottler, false );

		// Reset varaibles
		settings = null;
		eventTimeout = null;
		fixedHeader = null;
		headerHeight = null;
	};

	/**
	 * Initialize Smooth Scroll
	 * @public
	 * @param {Object} options User settings
	 */
	smoothScroll.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		smoothScroll.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		fixedHeader = root.document.querySelector('[data-scroll-header]'); // Get the fixed header
		headerHeight = getHeaderHeight( fixedHeader );

		// When a toggle is clicked, run the click handler
		root.document.addEventListener('click', eventHandler, false );
		if ( fixedHeader ) { root.addEventListener( 'resize', eventThrottler, false ); }

	};


	//
	// Public APIs
	//

	return smoothScroll;

});


// moment v2.10.6
// copyright © 2015 Tim Wood, Iskren Chernev, Moment.js contributors - momentjs.com | MIT license
// --------------------------------------------------------------------------------------------------------------------------------------------------------
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));


// pikaday v1.3.3 - date picker
// copyright © 2015 David Bushell https://github.com/dbushell/Pikaday | BSD & MIT license
// --------------------------------------------------------------------------------------------------------------------------------------------------------
(function (root, factory)
{
    'use strict';

    var moment;
    if (typeof exports === 'object') {
        // CommonJS module
        // Load moment.js as an optional dependency
        try { moment = require('moment'); } catch (e) {}
        module.exports = factory(moment);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function (req)
        {
            // Load moment.js as an optional dependency
            var id = 'moment';
            try { moment = req(id); } catch (e) {}
            return factory(moment);
        });
    } else {
        root.Pikaday = factory(root.moment);
    }
}(this, function (moment)
{
    'use strict';

    /**
     * feature detection and helper functions
     */
    var hasMoment = typeof moment === 'function',

    hasEventListeners = !!window.addEventListener,

    document = window.document,

    sto = window.setTimeout,

    addEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    },

    removeEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.removeEventListener(e, callback, !!capture);
        } else {
            el.detachEvent('on' + e, callback);
        }
    },

    fireEvent = function(el, eventName, data)
    {
        var ev;

        if (document.createEvent) {
            ev = document.createEvent('HTMLEvents');
            ev.initEvent(eventName, true, false);
            ev = extend(ev, data);
            el.dispatchEvent(ev);
        } else if (document.createEventObject) {
            ev = document.createEventObject();
            ev = extend(ev, data);
            el.fireEvent('on' + eventName, ev);
        }
    },

    trim = function(str)
    {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    },

    hasClass = function(el, cn)
    {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    },

    addClass = function(el, cn)
    {
        if (!hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    },

    removeClass = function(el, cn)
    {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    },

    isArray = function(obj)
    {
        return (/Array/).test(Object.prototype.toString.call(obj));
    },

    isDate = function(obj)
    {
        return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
    },

    isWeekend = function(date)
    {
        var day = date.getDay();
        return day === 0 || day === 6;
    },

    isLeapYear = function(year)
    {
        // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },

    getDaysInMonth = function(year, month)
    {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    setToStartOfDay = function(date)
    {
        if (isDate(date)) date.setHours(0,0,0,0);
    },

    compareDates = function(a,b)
    {
        // weak date comparison (use setToStartOfDay(date) to ensure correct result)
        return a.getTime() === b.getTime();
    },

    extend = function(to, from, overwrite)
    {
        var prop, hasProp;
        for (prop in from) {
            hasProp = to[prop] !== undefined;
            if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
                if (isDate(from[prop])) {
                    if (overwrite) {
                        to[prop] = new Date(from[prop].getTime());
                    }
                }
                else if (isArray(from[prop])) {
                    if (overwrite) {
                        to[prop] = from[prop].slice(0);
                    }
                } else {
                    to[prop] = extend({}, from[prop], overwrite);
                }
            } else if (overwrite || !hasProp) {
                to[prop] = from[prop];
            }
        }
        return to;
    },

    adjustCalendar = function(calendar) {
        if (calendar.month < 0) {
            calendar.year -= Math.ceil(Math.abs(calendar.month)/12);
            calendar.month += 12;
        }
        if (calendar.month > 11) {
            calendar.year += Math.floor(Math.abs(calendar.month)/12);
            calendar.month -= 12;
        }
        return calendar;
    },

    /**
     * defaults and localisation
     */
    defaults = {

        // bind the picker to a form field
        field: null,

        // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
        bound: undefined,

        // position of the datepicker, relative to the field (default to bottom & left)
        // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
        position: 'bottom left',

        // automatically fit in the viewport even if it means repositioning from the position option
        reposition: true,

        // the default output format for `.toString()` and `field` value
        format: 'YYYY-MM-DD',

        // the initial date to view when first opened
        defaultDate: null,

        // make the `defaultDate` the initial selected value
        setDefaultDate: false,

        // first day of week (0: Sunday, 1: Monday etc)
        firstDay: 0,

        // the minimum/earliest date that can be selected
        minDate: null,
        // the maximum/latest date that can be selected
        maxDate: null,

        // number of years either side, or array of upper/lower range
        yearRange: 10,

        // show week numbers at head of row
        showWeekNumber: false,

        // used internally (don't config outside)
        minYear: 0,
        maxYear: 9999,
        minMonth: undefined,
        maxMonth: undefined,

        startRange: null,
        endRange: null,

        isRTL: false,

        // Additional text to append to the year in the calendar title
        yearSuffix: '',

        // Render the month after year in the calendar title
        showMonthAfterYear: false,

        // how many months are visible
        numberOfMonths: 1,

        // when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
        // only used for the first display or when a selected date is not visible
        mainCalendar: 'left',

        // Specify a DOM element to render the calendar in
        container: undefined,

        // internationalization
        i18n: {
            previousMonth : 'Previous Month',
            nextMonth     : 'Next Month',
            months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
            weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        },

        // Theme Classname
        theme: null,

        // callback function
        onSelect: null,
        onOpen: null,
        onClose: null,
        onDraw: null
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function(opts, day, abbr)
    {
        day += opts.firstDay;
        while (day >= 7) {
            day -= 7;
        }
        return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },

    renderDay = function(opts)
    {
        if (opts.isEmpty) {
            return '<td class="is-empty"></td>';
        }
        var arr = [];
        if (opts.isDisabled) {
            arr.push('is-disabled');
        }
        if (opts.isToday) {
            arr.push('is-today');
        }
        if (opts.isSelected) {
            arr.push('is-selected');
        }
        if (opts.isInRange) {
            arr.push('is-inrange');
        }
        if (opts.isStartRange) {
            arr.push('is-startrange');
        }
        if (opts.isEndRange) {
            arr.push('is-endrange');
        }
        return '<td data-day="' + opts.day + '" class="' + arr.join(' ') + '">' +
                 '<button class="pika-button pika-day" type="button" ' +
                    'data-pika-year="' + opts.year + '" data-pika-month="' + opts.month + '" data-pika-day="' + opts.day + '">' +
                        opts.day +
                 '</button>' +
               '</td>';
    },

    renderWeek = function (d, m, y) {
        // Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
        var onejan = new Date(y, 0, 1),
            weekNum = Math.ceil((((new Date(y, m, d) - onejan) / 86400000) + onejan.getDay()+1)/7);
        return '<td class="pika-week">' + weekNum + '</td>';
    },

    renderRow = function(days, isRTL)
    {
        return '<tr>' + (isRTL ? days.reverse() : days).join('') + '</tr>';
    },

    renderBody = function(rows)
    {
        return '<tbody>' + rows.join('') + '</tbody>';
    },

    renderHead = function(opts)
    {
        var i, arr = [];
        if (opts.showWeekNumber) {
            arr.push('<th></th>');
        }
        for (i = 0; i < 7; i++) {
            arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
        }
        return '<thead>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</thead>';
    },

    renderTitle = function(instance, c, year, month, refYear)
    {
        var i, j, arr,
            opts = instance._o,
            isMinYear = year === opts.minYear,
            isMaxYear = year === opts.maxYear,
            html = '<div class="pika-title">',
            monthHtml,
            yearHtml,
            prev = true,
            next = true;

        for (arr = [], i = 0; i < 12; i++) {
            arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' +
                (i === month ? ' selected': '') +
                ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth) ? 'disabled' : '') + '>' +
                opts.i18n.months[i] + '</option>');
        }
        monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month" tabindex="-1">' + arr.join('') + '</select></div>';

        if (isArray(opts.yearRange)) {
            i = opts.yearRange[0];
            j = opts.yearRange[1] + 1;
        } else {
            i = year - opts.yearRange;
            j = 1 + year + opts.yearRange;
        }

        for (arr = []; i < j && i <= opts.maxYear; i++) {
            if (i >= opts.minYear) {
                arr.push('<option value="' + i + '"' + (i === year ? ' selected': '') + '>' + (i) + '</option>');
            }
        }
        yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + arr.join('') + '</select></div>';

        if (opts.showMonthAfterYear) {
            html += yearHtml + monthHtml;
        } else {
            html += monthHtml + yearHtml;
        }

        if (isMinYear && (month === 0 || opts.minMonth >= month)) {
            prev = false;
        }

        if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
            next = false;
        }

        if (c === 0) {
            html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
        }
        if (c === (instance._o.numberOfMonths - 1) ) {
            html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';
        }

        return html += '</div>';
    },

    renderTable = function(opts, data)
    {
        return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead(opts) + renderBody(data) + '</table>';
    },


    /**
     * Pikaday constructor
     */
    Pikaday = function(options)
    {
        var self = this,
            opts = self.config(options);

        self._onMouseDown = function(e)
        {
            if (!self._v) {
                return;
            }
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (!hasClass(target.parentNode, 'is-disabled')) {
                if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty')) {
                    self.setDate(new Date(target.getAttribute('data-pika-year'), target.getAttribute('data-pika-month'), target.getAttribute('data-pika-day')));
                    if (opts.bound) {
                        sto(function() {
                            self.hide();
                            if (opts.field) {
                                opts.field.blur();
                            }
                        }, 100);
                    }
                    return;
                }
                else if (hasClass(target, 'pika-prev')) {
                    self.prevMonth();
                }
                else if (hasClass(target, 'pika-next')) {
                    self.nextMonth();
                }
            }
            if (!hasClass(target, 'pika-select')) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                    return false;
                }
            } else {
                self._c = true;
            }
        };

        self._onChange = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }
            if (hasClass(target, 'pika-select-month')) {
                self.gotoMonth(target.value);
            }
            else if (hasClass(target, 'pika-select-year')) {
                self.gotoYear(target.value);
            }
        };

        self._onInputChange = function(e)
        {
            var date;

            if (e.firedBy === self) {
                return;
            }
            if (hasMoment) {
                date = moment(opts.field.value, opts.format);
                date = (date && date.isValid()) ? date.toDate() : null;
            }
            else {
                date = new Date(Date.parse(opts.field.value));
            }
            if (isDate(date)) {
              self.setDate(date);
            }
            if (!self._v) {
                self.show();
            }
        };

        self._onInputFocus = function()
        {
            self.show();
        };

        self._onInputClick = function()
        {
            self.show();
        };

        self._onInputBlur = function()
        {
            // IE allows pika div to gain focus; catch blur the input field
            var pEl = document.activeElement;
            do {
                if (hasClass(pEl, 'pika-single')) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));

            if (!self._c) {
                self._b = sto(function() {
                    self.hide();
                }, 50);
            }
            self._c = false;
        };

        self._onClick = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement,
                pEl = target;
            if (!target) {
                return;
            }
            if (!hasEventListeners && hasClass(target, 'pika-select')) {
                if (!target.onchange) {
                    target.setAttribute('onchange', 'return;');
                    addEvent(target, 'change', self._onChange);
                }
            }
            do {
                if (hasClass(pEl, 'pika-single') || pEl === opts.trigger) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));
            if (self._v && target !== opts.trigger && pEl !== opts.trigger) {
                self.hide();
            }
        };

        self.el = document.createElement('div');
        self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '') + (opts.theme ? ' ' + opts.theme : '');

        addEvent(self.el, 'ontouchend' in document ? 'touchend' : 'mousedown', self._onMouseDown, true);
        addEvent(self.el, 'change', self._onChange);

        if (opts.field) {
            if (opts.container) {
                opts.container.appendChild(self.el);
            } else if (opts.bound) {
                document.body.appendChild(self.el);
            } else {
                opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
            }
            addEvent(opts.field, 'change', self._onInputChange);

            if (!opts.defaultDate) {
                if (hasMoment && opts.field.value) {
                    opts.defaultDate = moment(opts.field.value, opts.format).toDate();
                } else {
                    opts.defaultDate = new Date(Date.parse(opts.field.value));
                }
                opts.setDefaultDate = true;
            }
        }

        var defDate = opts.defaultDate;

        if (isDate(defDate)) {
            if (opts.setDefaultDate) {
                self.setDate(defDate, true);
            } else {
                self.gotoDate(defDate);
            }
        } else {
            self.gotoDate(new Date());
        }

        if (opts.bound) {
            this.hide();
            self.el.className += ' is-bound';
            addEvent(opts.trigger, 'click', self._onInputClick);
            addEvent(opts.trigger, 'focus', self._onInputFocus);
            addEvent(opts.trigger, 'blur', self._onInputBlur);
        } else {
            this.show();
        }
    };


    /**
     * public Pikaday API
     */
    Pikaday.prototype = {


        /**
         * configure functionality
         */
        config: function(options)
        {
            if (!this._o) {
                this._o = extend({}, defaults, true);
            }

            var opts = extend(this._o, options, true);

            opts.isRTL = !!opts.isRTL;

            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

            opts.theme = (typeof opts.theme) === 'string' && opts.theme ? opts.theme : null;

            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

            opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;

            opts.disableWeekends = !!opts.disableWeekends;

            opts.disableDayFn = (typeof opts.disableDayFn) === 'function' ? opts.disableDayFn : null;

            var nom = parseInt(opts.numberOfMonths, 10) || 1;
            opts.numberOfMonths = nom > 4 ? 4 : nom;

            if (!isDate(opts.minDate)) {
                opts.minDate = false;
            }
            if (!isDate(opts.maxDate)) {
                opts.maxDate = false;
            }
            if ((opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate) {
                opts.maxDate = opts.minDate = false;
            }
            if (opts.minDate) {
                this.setMinDate(opts.minDate);
            }
            if (opts.maxDate) {
                setToStartOfDay(opts.maxDate);
                opts.maxYear  = opts.maxDate.getFullYear();
                opts.maxMonth = opts.maxDate.getMonth();
            }

            if (isArray(opts.yearRange)) {
                var fallback = new Date().getFullYear() - 10;
                opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
                opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
            } else {
                opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
                if (opts.yearRange > 100) {
                    opts.yearRange = 100;
                }
            }

            return opts;
        },

        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function(format)
        {
            return !isDate(this._d) ? '' : hasMoment ? moment(this._d).format(format || this._o.format) : this._d.toDateString();
        },

        /**
         * return a Moment.js object of the current selection (if available)
         */
        getMoment: function()
        {
            return hasMoment ? moment(this._d) : null;
        },

        /**
         * set the current selection from a Moment.js object (if available)
         */
        setMoment: function(date, preventOnSelect)
        {
            if (hasMoment && moment.isMoment(date)) {
                this.setDate(date.toDate(), preventOnSelect);
            }
        },

        /**
         * return a Date object of the current selection
         */
        getDate: function()
        {
            return isDate(this._d) ? new Date(this._d.getTime()) : null;
        },

        /**
         * set the current selection
         */
        setDate: function(date, preventOnSelect)
        {
            if (!date) {
                this._d = null;

                if (this._o.field) {
                    this._o.field.value = '';
                    fireEvent(this._o.field, 'change', { firedBy: this });
                }

                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (!isDate(date)) {
                return;
            }

            var min = this._o.minDate,
                max = this._o.maxDate;

            if (isDate(min) && date < min) {
                date = min;
            } else if (isDate(max) && date > max) {
                date = max;
            }

            this._d = new Date(date.getTime());
            setToStartOfDay(this._d);
            this.gotoDate(this._d);

            if (this._o.field) {
                this._o.field.value = this.toString();
                fireEvent(this._o.field, 'change', { firedBy: this });
            }
            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
                this._o.onSelect.call(this, this.getDate());
            }
        },

        /**
         * change view to a specific date
         */
        gotoDate: function(date)
        {
            var newCalendar = true;

            if (!isDate(date)) {
                return;
            }

            if (this.calendars) {
                var firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
                    lastVisibleDate = new Date(this.calendars[this.calendars.length-1].year, this.calendars[this.calendars.length-1].month, 1),
                    visibleDate = date.getTime();
                // get the end of the month
                lastVisibleDate.setMonth(lastVisibleDate.getMonth()+1);
                lastVisibleDate.setDate(lastVisibleDate.getDate()-1);
                newCalendar = (visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate);
            }

            if (newCalendar) {
                this.calendars = [{
                    month: date.getMonth(),
                    year: date.getFullYear()
                }];
                if (this._o.mainCalendar === 'right') {
                    this.calendars[0].month += 1 - this._o.numberOfMonths;
                }
            }

            this.adjustCalendars();
        },

        adjustCalendars: function() {
            this.calendars[0] = adjustCalendar(this.calendars[0]);
            for (var c = 1; c < this._o.numberOfMonths; c++) {
                this.calendars[c] = adjustCalendar({
                    month: this.calendars[0].month + c,
                    year: this.calendars[0].year
                });
            }
            this.draw();
        },

        gotoToday: function()
        {
            this.gotoDate(new Date());
        },

        /**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
        gotoMonth: function(month)
        {
            if (!isNaN(month)) {
                this.calendars[0].month = parseInt(month, 10);
                this.adjustCalendars();
            }
        },

        nextMonth: function()
        {
            this.calendars[0].month++;
            this.adjustCalendars();
        },

        prevMonth: function()
        {
            this.calendars[0].month--;
            this.adjustCalendars();
        },

        /**
         * change view to a specific full year (e.g. "2012")
         */
        gotoYear: function(year)
        {
            if (!isNaN(year)) {
                this.calendars[0].year = parseInt(year, 10);
                this.adjustCalendars();
            }
        },

        /**
         * change the minDate
         */
        setMinDate: function(value)
        {
            setToStartOfDay(value);
            this._o.minDate = value;
            this._o.minYear  = value.getFullYear();
            this._o.minMonth = value.getMonth();
        },

        /**
         * change the maxDate
         */
        setMaxDate: function(value)
        {
            this._o.maxDate = value;
        },

        setStartRange: function(value)
        {
            this._o.startRange = value;
        },

        setEndRange: function(value)
        {
            this._o.endRange = value;
        },

        /**
         * refresh the HTML
         */
        draw: function(force)
        {
            if (!this._v && !force) {
                return;
            }
            var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth,
                html = '';

            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }

            for (var c = 0; c < opts.numberOfMonths; c++) {
                html += '<div class="pika-lendar">' + renderTitle(this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year) + this.render(this.calendars[c].year, this.calendars[c].month) + '</div>';
            }

            this.el.innerHTML = html;

            if (opts.bound) {
                if(opts.field.type !== 'hidden') {
                    sto(function() {
                        opts.trigger.focus();
                    }, 1);
                }
            }

            if (typeof this._o.onDraw === 'function') {
                var self = this;
                sto(function() {
                    self._o.onDraw.call(self);
                }, 0);
            }
        },

        adjustPosition: function()
        {
            var field, pEl, width, height, viewportWidth, viewportHeight, scrollTop, left, top, clientRect;

            if (this._o.container) return;

            this.el.style.position = 'absolute';

            field = this._o.trigger;
            pEl = field;
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
            viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

            if (typeof field.getBoundingClientRect === 'function') {
                clientRect = field.getBoundingClientRect();
                left = clientRect.left + window.pageXOffset;
                top = clientRect.bottom + window.pageYOffset;
            } else {
                left = pEl.offsetLeft;
                top  = pEl.offsetTop + pEl.offsetHeight;
                while((pEl = pEl.offsetParent)) {
                    left += pEl.offsetLeft;
                    top  += pEl.offsetTop;
                }
            }

            // default position is bottom & left
            if ((this._o.reposition && left + width > viewportWidth) ||
                (
                    this._o.position.indexOf('right') > -1 &&
                    left - width + field.offsetWidth > 0
                )
            ) {
                left = left - width + field.offsetWidth;
            }
            if ((this._o.reposition && top + height > viewportHeight + scrollTop) ||
                (
                    this._o.position.indexOf('top') > -1 &&
                    top - height - field.offsetHeight > 0
                )
            ) {
                top = top - height - field.offsetHeight;
            }

            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';
        },

        /**
         * render HTML for a particular month
         */
        render: function(year, month)
        {
            var opts   = this._o,
                now    = new Date(),
                days   = getDaysInMonth(year, month),
                before = new Date(year, month, 1).getDay(),
                data   = [],
                row    = [];
            setToStartOfDay(now);
            if (opts.firstDay > 0) {
                before -= opts.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var cells = days + before,
                after = cells;
            while(after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            for (var i = 0, r = 0; i < cells; i++)
            {
                var day = new Date(year, month, 1 + (i - before)),
                    isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
                    isToday = compareDates(day, now),
                    isEmpty = i < before || i >= (days + before),
                    isStartRange = opts.startRange && compareDates(opts.startRange, day),
                    isEndRange = opts.endRange && compareDates(opts.endRange, day),
                    isInRange = opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange,
                    isDisabled = (opts.minDate && day < opts.minDate) ||
                                 (opts.maxDate && day > opts.maxDate) ||
                                 (opts.disableWeekends && isWeekend(day)) ||
                                 (opts.disableDayFn && opts.disableDayFn(day)),
                    dayConfig = {
                        day: 1 + (i - before),
                        month: month,
                        year: year,
                        isSelected: isSelected,
                        isToday: isToday,
                        isDisabled: isDisabled,
                        isEmpty: isEmpty,
                        isStartRange: isStartRange,
                        isEndRange: isEndRange,
                        isInRange: isInRange
                    };

                row.push(renderDay(dayConfig));

                if (++r === 7) {
                    if (opts.showWeekNumber) {
                        row.unshift(renderWeek(i - before, month, year));
                    }
                    data.push(renderRow(row, opts.isRTL));
                    row = [];
                    r = 0;
                }
            }
            return renderTable(opts, data);
        },

        isVisible: function()
        {
            return this._v;
        },

        show: function()
        {
            if (!this._v) {
                removeClass(this.el, 'is-hidden');
                this._v = true;
                this.draw();
                if (this._o.bound) {
                    addEvent(document, 'click', this._onClick);
                    this.adjustPosition();
                }
                if (typeof this._o.onOpen === 'function') {
                    this._o.onOpen.call(this);
                }
            }
        },

        hide: function()
        {
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    removeEvent(document, 'click', this._onClick);
                }
                this.el.style.position = 'absolute'; // reset
                this.el.style.left = 'auto';
                this.el.style.top = 'auto';
                addClass(this.el, 'is-hidden');
                this._v = false;
                if (v !== undefined && typeof this._o.onClose === 'function') {
                    this._o.onClose.call(this);
                }
            }
        },

        /**
         * GAME OVER
         */
        destroy: function()
        {
            this.hide();
            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
            removeEvent(this.el, 'change', this._onChange);
            if (this._o.field) {
                removeEvent(this._o.field, 'change', this._onInputChange);
                if (this._o.bound) {
                    removeEvent(this._o.trigger, 'click', this._onInputClick);
                    removeEvent(this._o.trigger, 'focus', this._onInputFocus);
                    removeEvent(this._o.trigger, 'blur', this._onInputBlur);
                }
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }

    };

    return Pikaday;

}));