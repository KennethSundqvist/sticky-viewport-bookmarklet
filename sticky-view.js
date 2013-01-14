window.StickyView = window.StickyView || (function(w, o) {
	// options:
	// 	root: the element that scrolls
	// 	highlightColor: background color of highlighted element
	
	var stickyEl, // Element that viewport sticks to
		hlEl, // Highlighted element
		prevStyle // Previous style of highlighted element
	
	o.rootEl = o.rootEl || w.document.body

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
		}
	}
	
	function setEl(el) {
		stickyEl = el
		w.addEventListener('resize', stickToEl, false)
	}
	
	function setHighlightFromPointer(e) {
		if (e.target !== hlEl) {
			if (hlEl) {
				clearHighlight()
			}
			if (e.target !== o.root) {
				hlEl = e.target
				prevStyle = hlEl.getAttribute('style')
				hlEl.style.backgroundColor = o.highlightColor
			}
		}
	}
	
	function clearHighlight() {
		prevStyle === null ? hlEl.removeAttribute('style') : hlEl.setAttribute('style', prevStyle)
	}
	
	function pickElement(e) {
		e.stopPropagation()
		o.root.addEventListener('mousemove', setHighlightFromPointer, false)
		o.root.addEventListener('click', setElFromPointer, false)
		w.addEventListener('keyup', cancelPickElement, false)
	}
	
	function cancelPickElement(e) {
		if (typeof e === 'undefined' || e && e.keyCode === 27) {
			o.root.removeEventListener('mousemove', setHighlightFromPointer, false)
			o.root.removeEventListener('click', setElFromPointer, false)
			w.removeEventListener('keyup', cancelPickElement, false)
			clearHighlight()
		}
	}
	
	return {
		pickElement: pickElement,
		cancelPickElement: cancelPickElement,
		setElement: setEl,
		cancelSticky: cancelSticky
	}
}(window, {
	root: window.document.body,
	highlightColor: '#ffa'
}));