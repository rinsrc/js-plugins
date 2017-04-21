var ready = function(f) {
	// check to see if f is a function
	if(typeof f !== "function") return;

	// if document has loaded all stylesheets, images, etc.
	if(document.readyState === "interactive" || document.readyState === "complete")
		return f();

	// else, wait for dom content to load
	document.addEventListener("DOMContentLoaded", f, false);
};

ready(function () {
	navOverlay();
});

var navOverlay = (function() {
	// id of trigger button or nav btn
	var triggerBtn = document.getElementById("nav-btn");

	// CSS classes that transitions the nav icon (three bars) into an x
	var triggerBtnTop = "nav-btn-top-x";
	var triggerBtnMid = "nav-btn-mid-x";
	var triggerBtnBot = "nav-btn-bot-x";

	// store three divs inside the triggerBtn
	var triggerBtnNodes = triggerBtn.getElementsByTagName("div");

	// nav id and associated CSS classes
	var nav = document.getElementById("nav");
	var navHide = "nav-hide";
	var navReveal = "nav-reveal";

	// CSS classes that have the hide and reveal transitions
	var hideRectClass = "rect-hide";
	var revealRectClass = "rect-reveal";

	// container where animation will occur
	var container = document.getElementById("rect-container");
	var containerWidth = container.scrollWidth;
	var containerHeight = container.scrollHeight;

	// this number determines how many rectangles you want (ex: 4 x 4)
	var numOfRect = 6;

	// var anim speed in milliseconds
	var ms = 40;

	// determine the dimensions of each rectangle
	var	rectWidth = containerWidth / numOfRect;
	var	rectHeight = containerHeight / numOfRect;

	// array holds all the rectangles or divs created
	var allDivs = [];

	// arr will hold the index of each div (used for shuffle animation)
	var arr = [];

	// returns a div/rectangle
	function createDiv() {
		var div = document.createElement("div");

		// add the hideRectClass immediately upon creation
		div.classList.add(hideRectClass);

		// resize the width and height of the div
		div.style.width = rectWidth + "px";
		div.style.height = rectHeight + "px";

		// insert the div into the container
		container.appendChild(div);

		return div;
	}

	// populate allDivs[] by creating divs and pushing into array
	function populateDiv() {
		for(var i = 0; i < numOfRect * numOfRect; i++) {
			var div = createDiv();
			allDivs.push(div);
		}

		// determine how many rectangles there will be and assign them an index
		for(var i = 0; i < numOfRect * numOfRect; i++) {
			arr.push(i);
		}
	}

	// randomly shuffles the values in an array
	function shuffleArray(array) {
		for(var i = array.length - 1; i > 0; i--) {
			// swap numbers around
			var j = Math.floor(Math.random() * (array.length));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	}

	// randomly reveal 1 rectangle, determined by shuffled arr[] and ms
	function revealRect(i) {
		setTimeout(function() {
			allDivs[arr[i]].classList.remove(hideRectClass);
			allDivs[arr[i]].classList.add(revealRectClass);	
		}, ms * i);
	}

	// randomly hide 1 rectangle every, determined by shuffled arr[] and ms
	function hideRect(i) {
		setTimeout(function() {
			allDivs[arr[i]].classList.remove(revealRectClass);
			allDivs[arr[i]].classList.add(hideRectClass)
		}, ms * i);
	}

	// toggles the rectangle animation
	function toggleRect() {
		if(allDivs[0].classList.contains(hideRectClass)) {
			for(var i = 0; i < allDivs.length; i++) {
				revealRect(i);
			}
		}
		else {
			for(var i = 0; i < allDivs.length; i++) {
				hideRect(i);
			}
		}
	}

	// toggles the nav (changes from menu icon into the x)
	function toggleNav() {
		if(nav.classList.contains(navHide)) {
			nav.classList.remove("nav-hide");
			nav.classList.add("nav-reveal");
			
			triggerBtnNodes[0].classList.add(triggerBtnTop);
			triggerBtnNodes[1].classList.add(triggerBtnMid);
			triggerBtnNodes[2].classList.add(triggerBtnBot);
		}

		else {
			nav.classList.remove("nav-reveal");
			nav.classList.add("nav-hide");
			
			triggerBtnNodes[0].classList.remove(triggerBtnTop);
			triggerBtnNodes[1].classList.remove(triggerBtnMid);
			triggerBtnNodes[2].classList.remove(triggerBtnBot);
		}
	}

	// main function that starts everything with event listener
	function startNavOverlay() {
		if(window.addEventListener) {
			triggerBtn.addEventListener("click", function() {
				// update rectangle width and height if window is resized
				containerWidth = container.scrollWidth;
				containerHeight = container.scrollHeight;
				rectWidth = Math.floor(containerWidth / numOfRect);
				rectHeight = Math.floor(containerHeight / numOfRect);

				// populate div and shuffle indices for random apperance
				populateDiv();
				shuffleArray(arr);
				
				// animate the rectangles and enable toggling
				toggleRect();

				// toggle the nav
				toggleNav();
			}, false);
		}
		else if(window.attachEvent) {
			window.attachEvent("onclick", function() {
				// update rectangle width and height if window is resized
				containerWidth = container.scrollWidth;
				containerHeight = container.scrollHeight;
				rectWidth = Math.floor(containerWidth / numOfRect);
				rectHeight = Math.floor(containerHeight / numOfRect);

				// populate div and shuffle indices for random apperance
				populateDiv();
				shuffleArray(arr);
				
				// animate the rectangles and enable toggling
				toggleRect();

				// toggle the nav
				toggleNav();
			}, false);
		}
		else {
			console.log("Unsupported event listeners.");
		}
	}

	return startNavOverlay();
});