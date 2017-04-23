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
	clickScroll();
});

var clickScroll = (function(){
	// the duration of the animation in  milliseconds (change if you want)
	var duration = 1500;

	// return all div tags with id name that has "section"
	function getDivs() {
		// get all divs in document
		var divTags = document.getElementsByTagName("div");

		// array will store all divs with id "section"
		var divsWithIdSection = [];

		// traverse through all divs
		for(var i = 0; i < divTags.length; i++) {
			// if div has an id, continue
			if(divTags[i].id != null) {
				if(divTags[i].id.indexOf("section", 0) != -1) {
					divsWithIdSection.push(divTags[i]);
				}
			}
		}
	
		return divsWithIdSection;
	}

	// return all anchors with href attribute "section"
	function getAnchors() {
		// get all anchors in document
		var anchorTags = document.getElementsByTagName("a");

		// array will store all anchors with href attribute "section"
		var anchorsWithHrefSection = [];

		for(var i = 0; i < anchorTags.length; i++) {
			if(anchorTags[i].getAttribute("href").indexOf("section", 1)) {
				anchorsWithHrefSection.push(anchorTags[i]);
			}
		}

		return anchorsWithHrefSection;
	}

	// return time in milliseconds
	function getTime() {
		if(!Date.now()) {
			return new Date().getTime();
		}

		return Date.now();
	}

	// return correct requestAnimationFrame for specific browser vendor
	function getRaf() {
		var lastTime = 0;
		var correctRaf = window.requestAnimationFrame;
		var vendors = ["ms", "moz", "webkit", "o"];

		// loop through vendors to see if it works
		for(var i = 0; i < vendors.length && !correctRaf; i++) {
			correctRaf = window[vendors[i] + "requestAnimationFrame"];
		}

		return correctRaf;
	}

	// return the elements position from the top in pixels
	function getElemPos(e) {
		var rect = e.getBoundingClientRect();

		// return scroll position + element's top position
		return rect.top + window.pageYOffset;
	}

	// cubic easing function using parameter of time t (pass in values between 0 to 1)
	function easing(t) {
		return t < 0.5 ? (4*t*t*t) : (t-1) * (2*t-2) * (2*t-2) + 1;
	}

	// this function scrolls smoothly to a particular div/section
	function animateScroll(e) {
		// get the correct requestAnimationFrame for browser
		var raf = getRaf();

		// start time
		var start = getTime();

		// end time
		var end = start + duration;

		// scroll start position
		var scrollStart = window.pageYOffset;

		// get the element's position in document in px
		var elemPos = getElemPos(e);

		// calculate error (distance) in px
		var error = elemPos - scrollStart;

		// animation of each step/frame
		function step() {
			// get the current time
			var currentTime = getTime();

			// get the remaining time in animation
			var remainingTime = end - currentTime;

			// calculate percentage of elapsed time (0 to 1)
			var percentDone = Math.min((currentTime - start)/duration, 1);

			var t = easing(percentDone);

			window.scrollTo(0, error * t + scrollStart);

			// continue step() as long as percent is less than 1 (1 means 100% done)
			if(percentDone < 1) {
				raf(step);
			}
		}

		raf(step);
		step();
	}

	// returns click events for individual div
	function getClickEvents(e) {
		return function() {
			animateScroll(e);
		}
	}

	function startClickScroll() {
		// collect all anchors and divs with "section" in it
		var anchors = getAnchors();
		var divs = getDivs();

		// addEventListeners for anchor clicks
		if(window.addEventListener) {
			for(var i = 0; i < anchors.length; i++) {
				anchors[i].addEventListener("click", getClickEvents(divs[i]));
			}
		}
		else if(window.attachEvent) {
			for(var i = 0; i < anchors.length; i++) {
				anchors[i].attachEvent("onclick", getClickEvents(divs[i]));
			}
		}
		else {
			console.log("Unsupported event listeners.");
		}

		// you can simply animate like below without using click events
		// animateScroll(document.getElementById("section-3"));
	}

	return startClickScroll();
});