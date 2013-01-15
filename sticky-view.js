window.StickyView = window.StickyView || (function(w, d, o) {
	// options:
	// 	root: the element that scrolls
	// 	highlightColor: background color of highlighted element
	
	var stickyEl, // Element that viewport sticks to
		hlSourceEl, // Highlighted element
		hlMarkerEl = d.createElement('div'), // The visual marker element for the highlight
		animationTime = .15 // Time of animations, in seconds
	
	o.rootEl = o.rootEl || d.body
	
	hlMarkerEl.setAttribute('style',
		'display: none;' +
		'pointer-events: none;' +
		'position: absolute;' +
		'border-radius: 3px;' +
		'-webkit-transition: all ' + animationTime + 's;' +
		o.style)
	
	d.body.appendChild(hlMarkerEl)
	
	function getPosition(el) {
		return {
			t: el.offsetTop,
			l: el.offsetLeft,
			w: el.offsetWidth,
			h: el.offsetHeight
		}
	}
	
	function stickToEl() {
		// FIXME make position relative to o.root and
		// not closest relative parent element
		var pos = stickyEl.offsetTop
		o.root.scrollTop = pos
	}
	
	function cancelSticky() {
		w.removeEventListener('resize', stickToEl)
	}
	
	function setElFromPointer(e) {
		if (e.target !== o.root) {
			setEl(e.target)
			cancelPickElement()
			successHighlight()
		}
	}
	
	function setEl(el) {
		stickyEl = el
		w.addEventListener('resize', stickToEl, false)
	}
	
	function setHighlightFromPointer(e) {
		if (e.target !== hlSourceEl && e.target !== o.root) {
			hlSourceEl = e.target
			updateHighlightPosition()
		}
	}
	
	function updateHighlightPosition() {
		var pos = getPosition(hlSourceEl)
		hlMarkerEl.style.display = 'block'
		hlMarkerEl.style.top = pos.t + 'px'
		hlMarkerEl.style.left = pos.l + 'px'
		hlMarkerEl.style.width = pos.w + 'px'
		hlMarkerEl.style.height = pos.h + 'px'
	}
	
	function cancelHighlight() {
		hlMarkerEl.style.opacity = '0'
		setTimeout(function() {
			hlMarkerEl.style.display = 'none'
		}, animationTime * 1000)
	}
	
	function successHighlight() {
		var pos = getPosition(hlSourceEl)
		hlMarkerEl.style.top = pos.t - 20 + 'px'
		hlMarkerEl.style.left = pos.l - 20 + 'px'
		hlMarkerEl.style.width = pos.w + 40 + 'px'
		hlMarkerEl.style.height = pos.h + 40 + 'px'
		setTimeout(function() {
			hlMarkerEl.style.display = 'none'
		}, animationTime * 1000)
	}
	
	function pickElement(e) {
		e.stopPropagation()
		o.root.addEventListener('mousemove', setHighlightFromPointer, false)
		o.root.addEventListener('click', setElFromPointer, false)
		w.addEventListener('keyup', cancelPickElement, false)
		hlMarkerEl.style.opacity = '1'
	}
	
	function cancelPickElement(e) {
		if (typeof e === 'undefined' || e && e.keyCode === 27) {
			o.root.removeEventListener('mousemove', setHighlightFromPointer, false)
			o.root.removeEventListener('click', setElFromPointer, false)
			w.removeEventListener('keyup', cancelPickElement, false)
			cancelHighlight()
		}
	}
	
	return {
		pickElement: pickElement,
		cancelPickElement: cancelPickElement,
		setElement: setEl,
		cancelSticky: cancelSticky
	}
}(window, window.document, {
	root: window.document.body,
	style: 'background: rgba(0, 80, 255, .4); box-shadow: 0 0 10px rgba(0, 80, 255, .4)'
}));