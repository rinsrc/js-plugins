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
	viewportScroll();
});

var viewportScroll = (function() {
	// array holds elements with given class name
	var box = document.getElementsByClassName("box");

	// returns viewport dimensions
	function getViewportDimensions() {
		var width = window.innerWidth || document.documentElement.clientWidth;
		var height = window.innerHeight || document.documentElement.clientHeight;

		return {
			width: width,
			height: height
		};
	}

	// returns true if an element is in viewport (pass in elem as parameter)
	function inViewport(e) {
		var rect = e.getBoundingClientRect();
		var viewSize = getViewportDimensions();
		var viewWidth = viewSize.width;
		var viewHeight = viewSize.height;

		// see if bounding rect of element is in viewport
		return rect.bottom >= 0 && rect.right >= 0 && rect.top <= viewHeight && rect.left <= viewWidth;
	}

	// returns correct browser vendor prefix for transition end
	// transition end determines when a CSS transition has finished animating
	function getTransitionEndPrefix(e) {
		var transitionEvent = {
			WebkitTransition : "webkitTransitionEnd",
			OTransition : "oTransitionEnd",
			MozTransition : "mozTransitionEnd",
			transition : "transitionend"
		}

		for(var end in transitionEvent) {
			if(e.style[end] !== undefined) {
				return transitionEvent[end];
			}
		}

		return false; // return false if transitionEnd is not supported
	}

	// when first element e finishes transition, e2 transition will activate
	// element, element-2, string (transition class CSS)
	// add multiple elements if you want to chain more than 2 elements in succession
	function chainTransition(e, e2, transitionClass) {
		var transitionEnd = getTransitionEndPrefix(e);

		e.addEventListener(transitionEnd, function() {
			e2.classList.add(transitionClass);
			
			counter = 1;

			if(!inViewport(box[11])) {
				e2.classList.remove(transitionClass);
			}

		});
	}

	// add/remove CSS animations/transitions when element is in viewport
	function addClassAnimation() {
		if(inViewport(box[0])) 
			box[0].classList.add("slide-up");
		else 
			box[0].classList.remove("slide-up");
	
		if(inViewport(box[1]))
			box[1].classList.add("slide-down");
		else 
			box[1].classList.remove("slide-down");

		if(inViewport(box[2]))
			box[2].classList.add("slide-left");
		else
			box[2].classList.remove("slide-left");

		if(inViewport(box[3]))
			box[3].classList.add("slide-right");
		else
			box[3].classList.remove("slide-right");

		if(inViewport(box[4]))
			box[4].classList.add("diagonal-slide-left");
		else
			box[4].classList.remove("diagonal-slide-left");

		if(inViewport(box[5]))
			box[5].classList.add("diagonal-slide-right");
		else
			box[5].classList.remove("diagonal-slide-right");

		if(inViewport(box[6]))
			box[6].classList.add("scale-and-rotate");
		else
			box[6].classList.remove("scale-and-rotate");

		if(inViewport(box[7]))
			box[7].classList.add("scale-and-rotate-2");
		else
			box[7].classList.remove("scale-and-rotate-2");

		if(inViewport(box[8]))
			box[8].classList.add("slide-right");
		else
			box[8].classList.remove("slide-right");

		if(inViewport(box[9]))
			box[9].classList.add("slide-overlap-left");
		else
			box[9].classList.remove("slide-overlap-left");

		if(inViewport(box[10])) {
			box[10].classList.add("slide-right");
			chainTransition(box[10], box[11], "slide-right");
		}
		else 
			box[10].classList.remove("slide-right");

		// if you want to run transition effect only once, do not include else statement
		if(inViewport(box[12]))
			box[12].classList.add("slide-right");

		if(inViewport(box[13]))
			box[13].classList.add("scale-and-rotate-2");
	}

	// main function that runs everything based on scrolling event listener
	function startViewportScroll() {
		// add listeners on scroll
		if(window.addEventListener) {
			window.addEventListener("scroll", function() {
				window.addEventListener("scroll", addClassAnimation());
			});
		}
		else if(window.attachEvent) {
			window.attachEvent("onscroll", addClassAnimation());
		}
		else {
			window.onscroll = addClassAnimation();
		}
	}

	return startViewportScroll();
});