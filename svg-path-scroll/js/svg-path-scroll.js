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
	svgPathScroll();
});

var svgPathScroll = (function() {
	var path = document.getElementById("svg-drawing");
	var pathLength = path.getTotalLength();
	var percentLength = 0;
	var svgContainer = "svg-container"
	// make the stroke as long as the path length
	path.style.strokeDasharray = pathLength;

	// offset path by its length so it disappears from view
	path.style.strokeDashoffset = pathLength;

	// returns in percentage [0, 1] of how much scrolling is completed inside the svg container
	function getPercent(pathContainer) {
		var container = document.getElementById(pathContainer);

		// get the top position of cotnainer in px
		var containerTop = container.offsetTop;

		// calculate container height by subtracting scrollHeight from top
		var containerHeight = container.scrollHeight - containerTop;

		// if user has not scrolled to container's top, return 0, 
		// else return scroll position subtracted from containerTop
		var currScrollPos = window.pageYOffset < containerTop ? 0 : window.pageYOffset - containerTop;

		// percent is calculated using basic division
		var percent = Math.min(currScrollPos/containerHeight, 1);

		return percent;
	}

	// draw path based on percent that is scrolled down
	function drawPath(percent) {
		// determines how much of the path is shown
		percentLength = pathLength * percent;

		// modify offset to show percentage of path completed
		path.style.strokeDashoffset = pathLength - percentLength;
	}

	// main function that adds event listeners
	function startSvgPathScroll() {
		if(window.addEventListener) {
			window.addEventListener("scroll", function() {
				drawPath(getPercent(svgContainer));
			}, false);
		}
		else if(window.attachEvent) {
			window.attachEvent("onscroll", function() {
				drawPath(getPercent(svgContainer));
			}, false);
		}
		else {
			console.log("Unsupported event listeners");
		}
	}

	return startSvgPathScroll();
});