var ready = function(f) {
	// check to see if f is function
	if(typeof f !== "function") return;

	// if document has loaded all stylesheets, images, etc.
	if(document.readyState === "interactive" || document.readyState === "complete")
		return f();

	// else, wait for dom content to load
	document.addEventListener("DOMContentLoaded", f, false);
};

ready(function() {
	navRevealer();
});

var navRevealer = (function() {
	// pxDelay determines how long nav will wait at top 
	// before triggering navEffect (to hide, etc.)
	var pxDelay = 500;

	// CSS class that fixes nav to top of page
	var fixedNavClass = "fixed-nav";

	// CSS class that uses transition effect (can make custom effect using CSS)
	var navEffect = "slide-up-nav";

	// id of header (if you use a header in your website)
	var headerId = "nr-header";

	// id of nav
	var navId = "nr-nav";

	// return position data of elem
	function getElemPos(e) {
		var rect = e.getBoundingClientRect();
		return rect;
	}

	// add/remove class on nav when user is scrolling down or up
	function addScrollDownClass(e) {
		var prevScrollPos = window.pageYOffset;
		
		var addNavEffect = function() {
			// compare prevScrollPos with currScrollPos to see if scrolling up or down
			var currScrollPos = window.pageYOffset;

			// when scrolling down, add navEffect (slides nav up)
			if(currScrollPos > prevScrollPos) {
				e.classList.add(navEffect);
			}

			// when scrolling up, reveals nav
			else {
				e.classList.remove(navEffect);
				return;
			}

			// reset prev scroll position to continue determining down/up scroll
			prevScrollPos = currScrollPos;
		}

		if(window.addEventListener) {
			window.addEventListener("scroll", addNavEffect, false);
		}
		else if(window.attachEvent) {
			window.attachEvent("onscroll", addNavEffect, false);
		}
		else {
			console.log("Unsupported event listener");
		}
	}

	// add fixed nav class
	function addFixedNavClass() {
		// get the nav elem and header elem
		var navElem = document.getElementById(navId);
		var headerElem = document.getElementById(headerId);

		// get the position of nav
		var navPos = getElemPos(navElem);

		// stores current scroll position
		var currentScrollPos = window.pageYOffset;

		// if there is a header, run code below
		if(headerElem != null) {
			// stores height of header
			var headerHeight = headerElem.scrollHeight;

			// if top of nav is at 0 and user scrolled past header elem's height
			if(navPos.top <= 0 && currentScrollPos >= headerHeight && currentScrollPos <= headerHeight + pxDelay) {
				// add class to fix position of the nav to the top
				navElem.classList.add(fixedNavClass);
				navElem.classList.remove(navEffect);
			}
			// if user scrolls beyond pxDelay, add fixed class and navEffect
			else if(currentScrollPos >= headerElem.scrollHeight + pxDelay) {
				navElem.classList.add(fixedNavClass);
				addScrollDownClass(navElem);
			}
			// else remove all classes/effects
			else {
				navElem.classList.remove(fixedNavClass);
				navElem.classList.remove(navEffect);
			}
		}

		// if not using header
		else {
			// if top of nav is at 0 and user has not scrolled passed pxDelay
			if(navPos.top <= 0 && currentScrollPos <= pxDelay) {
				// add class to fix position of the nav to the top
				navElem.classList.add(fixedNavClass);
				navElem.classList.remove(navEffect);
			}
			// if user scrolls beyond pxDelay, add fixed class and navEffect
			else if(navPos.top <= 0 && currentScrollPos >= pxDelay) {
				navElem.classList.add(fixedNavClass);
				addScrollDownClass(navElem);
			}
			// else remove all classes/effects
			else {
				navElem.classList.remove(fixedNavClass);
				navElem.classList.remove(navEffect);
			}
		}
	}

	// main function that starts the nav revealer
	function startNavRevealer() {
		if(window.addEventListener) {
			window.addEventListener("scroll", addFixedNavClass, false);
		}
		else if(window.attachEvent) {
			window.attachEvent("onscroll", addFixedNavClass, false);
		}
		else {
			console.log("Unsupported event listener.");
		}
	}

	return startNavRevealer();
});