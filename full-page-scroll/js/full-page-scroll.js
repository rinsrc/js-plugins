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
	fullPageScroll();
});

var fullPageScroll = (function() {
	// detects if user is scrolling or not
	var isScrolling = false;

	// variable indicates which div user is currently looking at
	var currentDiv = 0;

	// stores the length of the document (how many full page scrolls there are)
	var totalDiv = document.getElementsByClassName("full-box").length;

	// return time in milliseconds
	var getTime = function() {
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

	// cubic easing function using parameter of time t (pass in values between 0 to 1)
	function easing(t) {
		return t < 0.5 ? (4*t*t*t) : (t-1) * (2*t - 2) * (2*t - 2) + 1;
	}

	function animateScroll() {
		// get the correct requestAnimationFrame for browser
		var raf = getRaf();

		// start time
		var start = getTime();

		// end time
		var end = start + duration;

		// scroll start position
		var scrollStart = window.pageYOffset;

		// animation duration
		var duration = 1500;

		// calculates error from current position to next div
		var error = window.innerHeight * currentDiv - scrollStart; 

		// animation step function
		function step() {
			// get the current time
			var currentTime = getTime();

			// get the remaining time in animation
			var remainingTime = end - currentTime;

			// calculate percentage of elapsed time (0 to 1)
			var percentDone = Math.min((currentTime - start)/duration, 1);

			// store easing
			var t = easing(percentDone);

			window.scrollTo(0, scrollStart + error * t);

			// continue animation as long as percentage is less than 1 (100%)
			if(percentDone < 1) {
				raf(step);
			}
		}

		raf(step);
	}

	function scrollUp() {
		// if user is already at top of page, return
		if(currentDiv === 0) {
			return;
		}

		// subtract 1 from current div and then animate
		currentDiv--;
		animateScroll();
	}

	function scrollDown() {
		// if user is at bottom of page, return
		if(currentDiv === totalDiv) {
			return;
		}

		// add 1 to current div and then animate
		currentDiv++;
		animateScroll();
	}

	// setTimeout on isScrolling at 1500ms
	function setScrollTimeout() {
		setTimeout(function() {
			isScrolling = false;
		}, 1500);
	}

	// depending on mousewheel direction, trigger animations
	function checkWheelEvent(event) {
		// delta will store the wheel delta value (positive or negative)
		var delta = 0;
		var currEvent = event || window.event;

		// if we can detect a wheelDelta event
		if(currEvent.wheelDelta) {
			delta = currEvent.wheelDelta;
		}

		if(delta) {
			startAnim(delta);
		}
	}

	// if user presses up or down arrow keys, scroll as well
	function checkKeyEvent(event) {
		var upArrow = 38;
		var downArrow = 40;
		var direction = "";

		var currEvent = event || window.event;

		// if user press up arrow key "up" is assigned to direction
		if(currEvent.keyCode === upArrow) {
			direction = "up";
		}

		// if user presses down arrow key, "down" is assigned to direction
		else if(currEvent.keyCode === downArrow) {
			direction = "down";
		}

		// otherwise, set to empty string
		else {
			direction = "";
		}

		if(direction) {
			startAnim(direction);
		}
	}

	// startAnim takes in events (both scrolling and arrow key presses)
	function startAnim(event) {
		// if scrolling is running, let it finish
		if(isScrolling) {
			return;
		}

		// if wheel delta is positive, scroll up
		if(event > 0) {
			isScrolling = true;
			scrollUp();
			setScrollTimeout();
		}

		// if wheel delta is negative, scroll down
		else if(event < 0) {
			isScrolling = true;
			scrollDown();
			setScrollTimeout();
		}

		// if key press
		else if(event === "up") {
			isScrolling = true;
			scrollUp();
			setScrollTimeout();
		}

		else if(event === "down") {
			isScrolling = true;
			scrollDown();
			setScrollTimeout();
		}

		else {
			return;
		}
	}

	// add event listeners
	function startFullPageScroll() {
		if(window.addEventListener) {
			window.addEventListener("wheel", checkWheelEvent, false);
			window.addEventListener("keydown", checkKeyEvent, false);
		}
		else if(window.attachEvent) {
			window.addEventListener("wheel", checkWheelEvent, false);
			window.attachEvent("onkeydown", checkKeyEvent, false);
		}
		else {
			console.log("Unsupported event listeners.");
		}
	}

	return startFullPageScroll();
});