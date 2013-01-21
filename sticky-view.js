;window.StickyView = window.StickyView || (function(o) {
	// options:
	// 	root: The element with a scrollbar that we want to control (default: window.document.body)
	// 	markerStyles: CSS styles for the marker element
	// 	pickerStyles: CSS styles for the picker element
	// 	showMarker: Show the marker element when a sticky element is selected
	// 	animationTime: Duration of animations for the marker and picker elements, Float, in seconds (default: .15s)
	
	var w = window,
		d = window.document,
		stickyEl, // Element that viewport sticks to
		pickerTargetEl, // Element that is under the cursor when the picker is active
		markerEls = [d.createElement('div'), d.createElement('div')], // Visual elements for the marker highlight
		pickerEl = d.createElement('div'), // Visual element for the picker highlight
		hlSharedStyles = 'display: none;' + // Highlight elements shared styles
			'pointer-events: none;' +
			'position: absolute;' +
			'border-radius: 3px;' +
			'-webkit-transition: opacity ' + o.animationTime + 's;',
		activeMarker = 0, // Increased each time the markers are updated. markerEls[activeMarker % markerEls.length] gets the current marker
		hidingElTimers = [] // setTimeouts for hiding elements
	
	o.rootEl = o.rootEl || d.body
	o.animationTime = o.animationTime || .15
	
	markerEls[0].setAttribute('style', hlSharedStyles + o.markerStyles)
	markerEls[1].setAttribute('style', hlSharedStyles + o.markerStyles)
	
	pickerEl.setAttribute('style',
		hlSharedStyles +
		'-webkit-transition: all ' + o.animationTime + 's;' +
		o.pickerStyles)
	
	d.body.appendChild(markerEls[0])
	d.body.appendChild(markerEls[1])
	d.body.appendChild(pickerEl)
	
	/*
		Picking
	*/
	
	function pickSticky(e) {
		e.stopPropagation()
		startEventHandlers()
		setElementPosition(pickerEl, e.target)
		showHighlightEl(pickerEl)
	}
	
	function cancelPickSticky(e) {
		if (typeof e === 'undefined' || e && e.keyCode === 27) {
			stopEventHandlers()
			hideHighlightEl(pickerEl)
		}
	}
	
	function startEventHandlers() {
		o.root.addEventListener('mousemove', setHighlightFromPointer, false)
		o.root.addEventListener('click', setStickyFromPointer, false)
		w.addEventListener('keyup', cancelPickSticky, false)
	}
	
	function stopEventHandlers() {
		o.root.removeEventListener('mousemove', setHighlightFromPointer, false)
		o.root.removeEventListener('click', setStickyFromPointer, false)
		w.removeEventListener('keyup', cancelPickSticky, false)
	}
	
	/*
		Sticky
	*/
	
	function setSticky(el) {
		stickyEl = el
		w.addEventListener('resize', stickToEl, false)
		if (o.showMarker) updateMarkerEl()
	}
	
	function cancelSticky() {
		w.removeEventListener('resize', stickToEl)
		hideHighlightEl(markerEls[activeMarker % 2])
	}
	
	function setStickyFromPointer(e) {
		if (e.target !== o.root) {
			setSticky(e.target)
			stopEventHandlers()
			var pos = getElementPosition(pickerTargetEl)
			pickerEl.style.top = pos.t - 20 + 'px'
			pickerEl.style.left = pos.l - 20 + 'px'
			pickerEl.style.width = pos.w + 40 + 'px'
			pickerEl.style.height = pos.h + 40 + 'px'
			hideHighlightEl(pickerEl)
		}
	}
	
	function stickToEl() {
		// FIXME make position relative to o.root and
		// not closest relative parent element
		var pos = stickyEl.offsetTop
		o.root.scrollTop = pos
		if (o.showMarker) setElementPosition(markerEls[activeMarker % 2], stickyEl)
	}
	
	/*
		Highlights
	*/
	
	function showHighlightEl(el) {
		clearTimeout(hidingElTimers[el])
		el.style.display = 'block'
		el.style.opacity = '1'
	}
	
	function hideHighlightEl(el) {
		el.style.opacity = '0'
		hidingElTimers[el] = setTimeout(function() {
			el.style.display = 'none'
		}, o.animationTime * 1000)
	}
	
	function setHighlightFromPointer(e) {
		if (e.target !== pickerTargetEl && e.target !== o.root) {
			pickerTargetEl = e.target
			setElementPosition(pickerEl, pickerTargetEl)
		}
	}
	
	function updateMarkerEl() {
		hideHighlightEl(markerEls[activeMarker % 2])
		activeMarker++
		setElementPosition(markerEls[activeMarker % 2], stickyEl)
		showHighlightEl(markerEls[activeMarker % 2])
	}
	
	function getElementPosition(el) {
		return {
			t: el.offsetTop,
			l: el.offsetLeft,
			w: el.offsetWidth,
			h: el.offsetHeight
		}
	}
	
	function setElementPosition(positionedEl, destinationEl) {
		var pos = getElementPosition(destinationEl)
		positionedEl.style.top = pos.t + 'px'
		positionedEl.style.left = pos.l + 'px'
		positionedEl.style.width = pos.w + 'px'
		positionedEl.style.height = pos.h + 'px'
	}
	
	/*
		Public
	*/
	
	return {
		pickSticky: pickSticky,
		cancelPickSticky: cancelPickSticky,
		setSticky: setSticky,
		cancelSticky: cancelSticky
	}
}({
	root: window.document.body,
	markerStyles: 'background: rgba(255, 230, 0, .2); box-shadow: 0 0 10px rgba(255, 230, 0, .2);',
	pickerStyles: 'background: rgba(0, 80, 255, .4); box-shadow: 0 0 10px rgba(0, 80, 255, .4);',
	showMarker: true
}));