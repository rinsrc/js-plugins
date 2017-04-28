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
	dragSlider();
});

var dragSlider = (function() {
	// gather id, classes, and elem width
	var slider = document.getElementById("drag-slider-container");
	var sliderElem = document.getElementsByClassName("ds-elem");

	// enables autoSlide()
	var enableAuto = true;

	// speed in px the autoSlide() function moves at (more pixels means faster)
	var autoPxSpeed = 1;

	// convert sliderElem into an array
	var sliderElemArr = [];
	sliderElemArr = Object.keys(sliderElem).map(function(key) {
		return sliderElem[key];
	});

	// use at least the biggest width of the elem (in px)
	// otherwise elem would stack due to absolute position in CSS
	var leftSpacing = 310;

	// used to calculate element sliding position
	var xPos = 0;

	// add spacing to the slider elements (width of element)
	var spacing = 0;
	for(var i = 0; i < sliderElem.length; i++) {
		sliderElem[i].style.left = spacing + "px";
		spacing = spacing + leftSpacing;
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

	// loops elements in a continuous array by popping and pushing
	function loopElem() {
		// start is the index 0's left px value
		var start = parseInt(sliderElemArr[0].style.left.replace("px", ""));

		// lastElemLeft is last index left px value
		var lastElemLeft = parseInt(sliderElemArr[sliderElemArr.length-1].style.left.replace("px", ""));

		// when slider is moving left
		// if starting element left position is negative, push to end of array
		if(start < -1 * leftSpacing) {
			var lastElemLeft = parseInt(sliderElemArr[sliderElemArr.length-1].style.left.replace("px", ""));
			
			// before pushing index 0 elem, change its left style to last element plus more spacing
			// this allows it to be correctly placed after last element
			sliderElemArr[0].style.left = lastElemLeft + leftSpacing + "px";
			sliderElemArr.push(sliderElemArr.shift());
		}
		
		// when slider is moving right
		// if starting element's position is positive, pop last element and put it in front
		if(start > 1) {
			var lastElem = sliderElemArr.pop();
			lastElem.style.left = start - leftSpacing + "px";
			sliderElemArr.unshift(lastElem);
		}
	}

	// function adds some basic fade in/out CSS classes if elem is in view
	function enableFocus() {
		for(var i = 0; i < sliderElemArr.length; i++) {
			var elemLeft = parseInt(sliderElemArr[i].style.left.replace("px", ""));

			// if element's left position is greater than -50 
			// and less than 9/10 of screen width
			// add/remove CSS classes
			if(elemLeft > -50 && elemLeft < (window.innerWidth * 9/10)) {
				sliderElemArr[i].classList.remove("no-focus-elem");
				sliderElemArr[i].classList.add("focus-elem");
			}

			else {
				sliderElemArr[i].classList.remove("focus-elem");
				sliderElemArr[i].classList.add("no-focus-elem");
			}
		}
	}

	// uses animation to slide by itself
	function autoSlide() {
		var raf = getRaf();

		function step() {
			// check index 0 element
			var start = parseInt(sliderElemArr[0].style.left.replace("px", ""));

			// using a part of the same code from loopElem()
			if(start < -1 * leftSpacing) {
				var lastElemLeft = parseInt(sliderElemArr[sliderElemArr.length-1].style.left.replace("px", ""));
				sliderElemArr[0].style.left = lastElemLeft + leftSpacing + "px";
				sliderElemArr.push(sliderElemArr.shift());
			}

			// slide all elements left style by autoPxSpeed, which is 1
			for(var i = 0; i < sliderElemArr.length; i++) {
				var currLeft = parseInt(sliderElemArr[i].style.left.replace("px", ""));
				sliderElemArr[i].style.left = (currLeft - autoPxSpeed) + "px";
			}

			if(enableAuto) {
				raf(step);
			}

			else {
				return;
			}
		}

		if(enableAuto) {
			step();
		}

		else {
			return;
		}
	}

	// moves element by changing its left position
	function elemMove(event) {
		for(var i = 0; i < sliderElemArr.length; i++) {
			var currLeft = parseInt(sliderElemArr[i].style.left.replace("px", ""));
			sliderElemArr[i].style.left = leftSpacing * i + (event.clientX - xPos) + "px";
		}
	}

	// onmouseup, stops drag/sliding by removing event listener and reenable autoSlide
	function stopSlide() {
		enableAuto = true;
		slider.removeEventListener("mousemove", elemMove, false);
	}

	// onmousedown, allow user to slide elements and disables autoSlide temporarily
	function startSlide(elem, event) {
		enableAuto = false;
		slider.addEventListener("mousemove", elemMove, false);

		// calculate elem left position
		xPos = event.clientX - elem.offsetLeft;
	}

	// main function that adds event listeners
	function startDragSlider() {
		if(window.addEventListener) {
			// if enableAuto is true, autoSlide() will start
			autoSlide();
			enableFocus();

			// while the mouse is over slide, put first element to back for infinite looping
			// also enableFocus() effects
			slider.addEventListener("mouseover", function() {
				loopElem();
				enableFocus();
			}, false);

			// on mousedown, enable slide/drag
			slider.addEventListener("mousedown", function(event) {
				startSlide(sliderElemArr[0], event);
			}, false);

			// on mouse up, stop slide/drag and activate autoSlide()
			slider.addEventListener("mouseup", function() {
				stopSlide();
				autoSlide();
			}, false);
		}
		else if(window.attachEvent) {
			// if enableAuto is true, autoSlide() will start
			autoSlide();
			enableFocus();

			// while the mouse is over slide, put first element to back for infinite looping
			// also enableFocus() effects
			slider.attachEvent("onmouseover", function() {
				loopElem();
				enableFocus();
			}, false);

			// on mousedown, enable slide/drag
			slider.attachEvent("onmousedown", function(event) {
				startSlide(sliderElemArr[0], event);
			}, false);

			// on mouse up, stop slide/drag and activate autoSlide()
			slider.attachEvent("onmouseup", function() {
				stopSlide();
				autoSlide();
			}, false);
		}
		else {
			console.log("Unsupported event listeners.");
		}
	}

	return startDragSlider();
});