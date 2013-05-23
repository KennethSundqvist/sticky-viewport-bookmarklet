;window.StickyView = window.StickyView || (function(o) {
	// options:
	// 	root: The element with a scrollbar that we want to control (default: window.document.body)
	
    // "icons" web font characters
    // 
    // u+2715  x
// u+2699  cog
    // u+261D  up hand
	
	var version = 'pre-alpha',
		w = window,
		d = w.document,
		sticky = false, // If the viewport should stick when resizing
		stickyEl, // Element that viewport sticks to
		pickerTargetEl, // Element that is under the cursor when the picker is active
		markerEl = d.createElement('div'), // Visual element for the marker highlight
		pickerEl = d.createElement('div'), // Visual element for the picker highlight
		guiEl = d.createElement('div'), // GUI container element
		guiBtnPickEl, // GUI button to initiate picker
		guiBtnToggleStickyEl, // GUI button to toggle viewport stickyness
		styleEl = d.createElement('style'), // For the CSS
		css
	
	o.rootEl = o.rootEl || d.body
	
	//
	// Set up CSS
	//
	
	function prefixCss(prefixes, css) {
		var prefixedCss = ''
		prefixes.split(',').forEach(function(prefix) {
			prefixedCss += '-' + prefix + '-' + css
		})
		return prefixedCss + css
	}
	
	css = '@font-face {font-family:"icons"; font-weight:normal; font-style:normal; src:url(data:application/x-font-woff;charset=utf-8;base64,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) format("woff");}' +
		'.sv_-gui {position:fixed; top:5px; left:5px; z-index:999998; color:#fff; background:rgba(0,0,0,.7); border-radius:5px; box-shadow: 0 0 4px rgba(0, 0, 0, .4); text-align:center;}' +
		'.sv_-gui * {font-weight:normal; text-transform:none; text-shadow:none; font: 12px/1 Verdana,Arial,sans-serif;}' +
		'.sv_-hl {pointer-events:none; position:absolute; z-index:999999; opacity:0; border-radius:3px;}' +
		'.sv_-marker, .sv_-btn {' + prefixCss('webkit,o','transition:all .5s;') + '}' +
		'.sv_-btn {padding:6px 8px; cursor:pointer; font:20px/1 icons;}' +
		'.sv_-marker {background: hsla(60, 100%, 50%, .4); box-shadow: 0 0 10px hsla(60, 100%, 50%, .2);}' +
		'.sv_-picker {' + prefixCss('webkit,o','transition:all .3s;') + 'background: hsla(199, 100%, 55%, .4); box-shadow: 0 0 10px hsla(199, 100%, 55%, .4);}' +
		'.sv_-btnPick.sv_-active {color:hsl(199, 100%, 63%);}' +
		'.sv_-btnSticky.sv_-active {opacity:.4;}' +
		'.sv_-hide {display:none}'
		
	styleEl.type = 'text/css'
	if (styleEl.styleSheet) {
		styleEl.styleSheet.cssText = css;
	} else {
		styleEl.appendChild(d.createTextNode(css))
	}
	
	d.head.appendChild(styleEl)
	
	//
	// Set up HTML
	//
	
	guiEl.className = 'sv_-gui'
	guiEl.innerHTML = '<div class="sv_-btn sv_-btnPick" title="Pick an element and stick the viewport to it">\u261D</div>' +
      '<div class="sv_-btn sv_-btnSticky sv_-hide" title="Toggle viewport stickyness">\u2715</div>'
	
	guiBtnPickEl = guiEl.querySelector('.sv_-btnPick')
	guiBtnPickEl.addEventListener('click', pickSticky, false)
	
	guiBtnToggleStickyEl = guiEl.querySelector('.sv_-btnSticky')
	guiBtnToggleStickyEl.addEventListener('click', toggleSticky, false)
	
	markerEl.className = 'sv_-marker sv_-hl'
	pickerEl.className = 'sv_-picker sv_-hl'
	
	d.body.appendChild(guiEl)
	d.body.appendChild(markerEl)
	d.body.appendChild(pickerEl)
	
	//
	// Picking
	//
	
	function pickSticky(e) {
		if (e) {
			e.stopPropagation()
			setElementPosition(pickerEl, e.target)
		}
		startEventHandlers()
		showHighlightEl(pickerEl)
		guiBtnPickEl.className += ' sv_-active'
	}
	
	function cancelPickSticky(e) {
		if (typeof e === 'undefined' || e && e.keyCode === 27) {
			stopEventHandlers()
			hideHighlightEl(pickerEl)
			guiBtnPickEl.className = guiBtnPickEl.className.replace(' sv_-active','')
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
	
	//
	// Sticky
	//
	
	function setSticky(el) {
		stickyEl = el
		enableSticky()
	}
	
	function toggleSticky() {
		if (sticky) disableSticky()
		else if (stickyEl) enableSticky()
	}
	
	function enableSticky() {
		if (stickyEl) {
			if (!sticky) w.addEventListener('resize', stickToEl, false)
			sticky = true
			guiBtnToggleStickyEl.style.display = 'block'
			guiBtnToggleStickyEl.className = guiBtnToggleStickyEl.className.replace(' sv_-active','')
			flashMarkerEl()
		}
	}
	
	function disableSticky() {
		if (sticky) {
			sticky = false
			w.removeEventListener('resize', stickToEl, false)
			guiBtnToggleStickyEl.className += ' sv_-active'
		}
	}
	
	function setStickyFromPointer(e) {
		e.preventDefault()
		e.stopPropagation()
		if (e.target !== o.root) {
			setSticky(e.target)
			stopEventHandlers()
			hideHighlightEl(pickerEl)
			guiBtnPickEl.className = guiBtnPickEl.className.replace(' sv_-active','')
		}
	}
	
	function stickToEl() {
		var stickyElPos = getElementPosition(stickyEl)
		o.root.scrollTop = Math.round(stickyElPos.t - ((w.innerHeight - stickyElPos.h) / 2))
	}
	
	//
	// Highlights
	//
	
	function showHighlightEl(el) {
        el.style.display = 'block'
		setTimeout(function() {
		  el.style.opacity = '1'
		}, 0)
	}
	
	function hideHighlightEl(el) {
        setElementPosition(el, el, {t: -20, l: -20, w: 40, h: 40})
		el.style.opacity = '0'
		setTimeout(function() {
		  el.style.display = 'none'
		}, 520) // Longest CSS animation for hiding is 500 ms
	}
	
	function setHighlightFromPointer(e) {
		if (e.target !== pickerTargetEl && e.target !== o.root) {
			pickerTargetEl = e.target
			setElementPosition(pickerEl, pickerTargetEl)
		}
	}
	
	function flashMarkerEl() {
		setElementPosition(markerEl, stickyEl)
		showHighlightEl(markerEl)
		setTimeout(function() {
		  hideHighlightEl(markerEl)
		}, 1000)
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
	
	function setElementPosition(positionedEl, destinationEl, offsets) {
		var pos = getElementPosition(destinationEl)
		offsets = offsets || {}
		positionedEl.style.top = pos.t + (offsets.t || 0) + 'px'
		positionedEl.style.left = pos.l + (offsets.l || 0) + 'px'
		positionedEl.style.width = pos.w + (offsets.w || 0) + 'px'
		positionedEl.style.height = pos.h + (offsets.h || 0) + 'px'
	}
	
	//
	// Public
	//
	
	return {
		pickSticky: pickSticky,
		cancelPickSticky: cancelPickSticky,
		setSticky: setSticky,
		toggleSticky: toggleSticky,
		enableSticky: enableSticky,
		disableSticky: disableSticky,
		getVersion: function() { return version }
	}
}({root: window.document.body}));