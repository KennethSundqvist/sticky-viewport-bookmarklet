/*eslint-env browser */
/*globals
 	webkitRequestAnimationFrame
	mozRequestAnimationFrame
	msRequestAnimationFrame
	webkitCancelAnimationFrame
	mozCancelAnimationFrame
	msCancelAnimationFrame
*/

(function() {
	var win = window

	var namespace = '_SVB_'
	var state = win[namespace] = win[namespace] || {
		initialized: false,
		picking: false,
		sticky: false,
		highlighting: false
	}

	if (state.picking) {
		// An existing instance is currently picking an element so let it continue
		// doing that and just abort.
		return
	} else if (state.initialized) {
		// An instance exists so use it to repick an element and abort this one.
		state.pickElement()
		return
	}

	var doc = win.document
	var bodyEl = doc.body
	var highlightEl = doc.createElement('div')
	var highlightElStyle = highlightEl.style
	var cancelButtonEl = doc.createElement('button')
	var stickyEl
	var mostRecentTargetEl
	var rAF = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || msRequestAnimationFrame
	var cAF = cancelAnimationFrame || webkitCancelAnimationFrame || mozCancelAnimationFrame || msCancelAnimationFrame
	var throttledHighlightPositioning
	var throttledCenterViewport
	var transitionDurationMs = 350
	var escKeyCode = 27
	var altKeyCode = 18

	var sharedStyles = 'z-index:999999999;' +
		'position:fixed;' +
		'-webkit-transform:translate3d(0,0,0);' +
		'-moz-transform:translate3d(0,0,0);' +
		'transform:translate3d(0,0,0);' +
		'cursor:pointer;' +
		'border-radius:3px;'

	highlightEl.setAttribute('style',
		'-webkit-transition:all ' + (transitionDurationMs / 1000) + 's ease-out;' +
		'transition:all ' + (transitionDurationMs / 1000) + 's ease-out;' +
		'display:none;' +
		'pointer-events:none;' +
		'opacity:0;' +
		'background:hsla(199,100%,55%,.4);' +
		'border:1px solid hsla(199,100%,55%,.6);' +
		'box-shadow:0 0 6px hsla(199,100%,55%,.4),inset 0 0 15px hsla(199,100%,55%,.14);' +
		sharedStyles
	)

	cancelButtonEl.setAttribute('style',
		'top:15px;' +
		'left:15px;' +
		'color:#fee;' +
		'background:hsl(199,100%,55%);' +
		'border:1px solid hsl(199,85%,35%);' +
		'box-shadow:0 1px 5px hsla(199,100%,20%,.4),inset 0 -1px 3px 1px rgba(0,0,0,.15);' +
		'text-shadow:0 1px 2px rgba(0,0,0,.2);' +
		sharedStyles
	)

	function manageEventListener(shouldAdd, element, type, callback) {
		element[(shouldAdd ? 'add' : 'remove') + 'EventListener'](type, callback, false)
	}

	function nextFrame(callback) {
		return rAF ?
			rAF(callback) :
			setTimeout(callback, 1000 / 60)
	}

	function cancelFrame(id) {
		cAF ?
			cAF(id) :
			clearTimeout(id)
	}

	/*
		Initialize.
	*/

	manageEventListener(1, cancelButtonEl, 'click', onCancelButtonClick)

	pickElement()

	// This must be set last in the initialization.
	state.initialized = true

	/*
		Event handlers.
	*/

	function onCancelButtonClick(event) {
		event.stopPropagation()

		if (state.picking) {
			cancelPickElement()
		} else if (state.sticky) {
			stopStickingToElement()
		}
	}

	function onKeydown(event) {
		if (state.picking && event.keyCode === altKeyCode) {
			enableHighlightClicking()
		}
	}

	function onKeyup(event) {
		if (state.picking && event.keyCode === escKeyCode) {
			cancelPickElement()
		} else if (event.keyCode === altKeyCode) {
			disableHighlightClicking()
		}
	}

	function onResize() {
		if (throttledCenterViewport) {
			cancelFrame(throttledCenterViewport)
		}

		throttledCenterViewport = nextFrame(centerViewportOnStickyElement)
	}

	/*
		Picking an element to be sticky.
	*/

	// Set it on the state so it can be reused if the bookmarklet is run multiple
	// times on the same page.
	state.pickElement = pickElement

	function pickElement() {
		state.picking = true

		cancelButtonEl.textContent = 'Cancel picking'

		bodyEl.appendChild(highlightEl)
		bodyEl.appendChild(cancelButtonEl)

		manageEventListener(1, bodyEl, 'mousemove', setHighlightEl)
		manageEventListener(1, bodyEl, 'click', startStickingToElement)
		manageEventListener(1, win, 'keydown', onKeydown)
		manageEventListener(1, win, 'keyup', onKeyup)
	}

	function cancelPickElement() {
		state.picking = false

		removePickStickyEventListeners()
		removeHighlightEl()

		if (state.sticky) {
			cancelButtonEl.textContent = 'Unsticky'
		} else {
			bodyEl.removeChild(cancelButtonEl)
		}
	}

	function removePickStickyEventListeners() {
		manageEventListener(0, bodyEl, 'mousemove', setHighlightEl)
		manageEventListener(0, bodyEl, 'click', startStickingToElement)
		manageEventListener(0, win, 'keydown', onKeydown)
		manageEventListener(0, win, 'keyup', onKeyup)
	}

	/*
		Sticking an element in the center of the viewport.
	*/

	function startStickingToElement(event) {
		var targetEl = event.target

		event.preventDefault()
		event.stopImmediatePropagation()

		if (targetEl !== bodyEl) {
			state.picking = false

			if (!state.sticky) {
				state.sticky = true
				manageEventListener(1, win, 'resize', onResize)
			}

			if (targetEl === highlightEl) {
				stickyEl = mostRecentTargetEl
			} else {
				stickyEl = targetEl
			}

			removePickStickyEventListeners()
			disableHighlightClicking()
			removeHighlightEl()
			cancelButtonEl.textContent = 'Unsticky'
		}
	}

	function stopStickingToElement() {
		state.sticky = false
		stickyEl = null
		manageEventListener(0, win, 'resize', onResize)
		bodyEl.removeChild(cancelButtonEl)
	}

	function centerViewportOnStickyElement() {
		var el = stickyEl
		var elToCenter = stickyEl
		var elTop
		var elHeight
		var parent
		var parentHeight
		var currScroll
		var testScroll

		if (win.getComputedStyle(el).position === 'fixed') {
			elTop = el.offsetTop + bodyEl.scrollTop
			elHeight = el.offsetHeight
			bodyEl.scrollTop = Math.round(elTop - ((win.innerHeight - elHeight) / 2))
		} else {
			while (el && el !== bodyEl && (parent = el.parentElement)) {
				parentHeight = parent === bodyEl ? win.innerHeight : parent.clientHeight

				// Filter out most elements.
				if (parentHeight < parent.scrollHeight) {
					// Filter out some false positives.
					//
					// Element.scrollHeight includes the overflowing margins of children
					// so we have to check if the element actually scrolls or it's just
					// these overflowing margins.
					currScroll = parent.scrollTop
					testScroll = currScroll + (currScroll > 0 ? -1 : 1)
					parent.scrollTop = testScroll

					if (parent.scrollTop === testScroll) {
						// Scroll to 0 so we can get the top position inside the scrollable
						// parent using offsetTop.
						parent.scrollTop = 0

						elTop = getElementTopPos(elToCenter) - getElementTopPos(parent)
						elHeight = elToCenter.offsetHeight

						parent.scrollTop = elTop + (elHeight / 2) - (parentHeight / 2)

						elToCenter = parent
					}
				}

				el = parent
			}
		}

		throttledCenterViewport = null
	}

	function getElementTopPos(el) {
		var top = 0
		while (el) {
			top += el.offsetTop
			el = el.offsetParent
		}
		return top
	}

	/*
		A highlight element shows the user which element will be stickied.
	*/

	function removeHighlightEl() {
		setElementPosition(highlightEl, highlightEl, {
			top: -20,
			left: -20,
			width: 40,
			height: 40
		})
		setHighlightElOpacity('0')
		// Just use a timeout instead of having to detect 'transitionend' event
		// support and having a timeout as fallback anyway.
		setTimeout(function removeHighlightElAfterFadeOut() {
			bodyEl.removeChild(highlightEl)
			highlightElStyle.display = 'none'
			state.highlighting = false
		}, transitionDurationMs)
	}

	function setHighlightEl(event) {
		var targetEl = event.target

		if (
			targetEl !== mostRecentTargetEl &&
			targetEl !== bodyEl &&
			targetEl !== highlightEl &&
			targetEl !== cancelButtonEl
		) {
			mostRecentTargetEl = targetEl

			if (throttledHighlightPositioning) {
				cancelFrame(throttledHighlightPositioning)
			}

			throttledHighlightPositioning = nextFrame(setHighlightElPosition)
		}
	}

	function setHighlightElPosition() {
		setElementPosition(highlightEl, mostRecentTargetEl, {})

		// Show the element here after we have positioned it.
		if (!state.highlighting) {
			state.highlighting = true

			highlightElStyle.display = 'block'
			// Must be done in the next frame or else the opacity won't transition.
			nextFrame(setHighlightElOpacity)
		}

		throttledHighlightPositioning = null
	}

	// Allows the user to pick an element that has a click handler by clicking
	// on the highlight element after the target has been highlighted.
	function enableHighlightClicking() {
		highlightElStyle.pointerEvents = ''
		setHighlightElOpacity('1')
	}

	// Allows the user to highlight new elements that are under the current
	// highlight without having to move the highlight out of the way first.
	// Without this it would be really hard to target small elements within large
	// ones.
	function disableHighlightClicking() {
		highlightElStyle.pointerEvents = 'none'
		setHighlightElOpacity()
	}

	function setHighlightElOpacity(value) {
		highlightElStyle.opacity = typeof value === 'string' ? value : '0.5'
	}

	function setElementPosition(elToPosition, destinationEl, offsets) {
		var pos = destinationEl.getBoundingClientRect()
		var style = elToPosition.style

		style.top = pos.top + (offsets.top || 0) + 'px'
		style.left = pos.left + (offsets.left || 0) + 'px'
		style.width = pos.width + (offsets.width || 0) + 'px'
		style.height = pos.height + (offsets.height || 0) + 'px'
	}
}())
