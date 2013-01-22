;window.StickyView = window.StickyView || (function(o) {
	// options:
	// 	root: The element with a scrollbar that we want to control (default: window.document.body)
	// 	markerStyles: CSS styles for the marker element
	// 	pickerStyles: CSS styles for the picker element
	// 	showMarker: Show the marker element when a sticky element is selected
	// 	animationTime: Duration of animations for the marker and picker elements, Float, in seconds (default: .15s)
	
	o.animationTime = o.animationTime || .15
	
	var w = window,
		d = window.document,
		stickyEl, // Element that viewport sticks to
		pickerTargetEl, // Element that is under the cursor when the picker is active
		markerEls = [d.createElement('div'), d.createElement('div')], // Visual elements for the marker highlight
		pickerEl = d.createElement('div'), // Visual element for the picker highlight
		guiEl = d.createElement('div'), // GUI container element
		guiBtnPickEl = d.createElement('div'), // GUI button to initiate picker
		guiBtnUnsetEl = d.createElement('div'), // GUI button to cancel sticky
		hlSharedStyles = 'display: none;' + // Highlight elements shared styles
			'pointer-events: none;' +
			'position: absolute;' +
			'opacity: 0;' +
			'border-radius: 3px;' +
			'-webkit-transition: opacity ' + o.animationTime + 's;',
		guiBtnStyles = 'float: left; padding: 6px 8px; cursor: pointer;', // GUI buttons shared styles
		activeMarker = 0, // Increased each time the markers are updated. markerEls[activeMarker % markerEls.length] gets the current marker
		hidingElTimers = [] // setTimeouts for hiding elements
	
	o.rootEl = o.rootEl || d.body
	
	markerEls[0].setAttribute('style', hlSharedStyles + o.markerStyles)
	markerEls[1].setAttribute('style', hlSharedStyles + o.markerStyles)
	
	pickerEl.setAttribute('style',
		hlSharedStyles +
		'-webkit-transition: all ' + o.animationTime + 's;' +
		o.pickerStyles)
	
	guiEl.setAttribute('style',
		'position: fixed;' +
		'top: 10px; left: 10px;' +
		'color: #fff; background: rgba(0, 0, 0, .7);' +
		'border-radius: 5px;' +
		'-webkit-box-shadow: 0 0 4px rgba(0, 0, 0, .4);' +
		'font: 12px/1 Verdana, Arial, sans-serif;')
	
	guiBtnPickEl.innerHTML = 'Pick'
	guiBtnPickEl.setAttribute('style', guiBtnStyles)
	guiBtnPickEl.addEventListener('click', pickSticky, false)
	guiEl.appendChild(guiBtnPickEl)
	
	guiBtnUnsetEl.innerHTML = '&times;'
	guiBtnUnsetEl.setAttribute('style', guiBtnStyles + 'display: none; border-left: 1px solid #aaa; font-weight: bold;')
	guiBtnUnsetEl.addEventListener('click', cancelSticky, false)
	guiEl.appendChild(guiBtnUnsetEl)
	
	d.body.appendChild(markerEls[0])
	d.body.appendChild(markerEls[1])
	d.body.appendChild(pickerEl)
	d.body.appendChild(guiEl)
	
	/*
		Picking
	*/
	
	function pickSticky(e) {
		if (e) {
			e.stopPropagation()
			setElementPosition(pickerEl, e.target)
		}
		startEventHandlers()
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
		guiBtnUnsetEl.style.display = 'block'
		if (o.showMarker) updateMarkerEl()
	}
	
	function cancelSticky() {
		w.removeEventListener('resize', stickToEl)
		hideHighlightEl(markerEls[activeMarker % 2])
		guiBtnUnsetEl.style.display = 'none'
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
		o.root.scrollTop = getElementPosition(stickyEl).t
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
		var pos = {
			t: 0,
			l: 0,
			w: el.offsetWidth,
			h: el.offsetHeight
		}
		
		while (el && !isNaN(el.offsetTop)) {
			pos.t += el.offsetTop
			pos.l += el.offsetLeft
			el = el.offsetParent
		}
		
		return pos
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