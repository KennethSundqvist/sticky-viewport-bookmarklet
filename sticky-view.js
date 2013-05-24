;window.StickyView = window.StickyView || (function(o) {
	// options:
	// 	root: The element with a scrollbar that we want to control (default: window.document.body)
	
	// "icons" web font characters
	// 
	// u261D  up hand
	// uE801  check
	// uE800  check empty
	
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
	
	css = '@font-face {font-family:"stickyviewbookmarkleticons"; font-weight:normal; font-style:normal; src:url(data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAwkABAAAAAAEygAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABbAAAABoAAAAcZRIc6EdERUYAAAGIAAAAHwAAACAAMwAGT1MvMgAAAagAAABIAAAAVrxFWTdjbWFwAAAB8AAAAEkAAAFWDjfr4GN2dCAAAAI8AAAAFAAAABwG1f8GZnBnbQAAAlAAAAT5AAAJkYoKeDtnYXNwAAAHTAAAAAgAAAAIAAAAEGdseWYAAAdUAAACygAAA8Q8tTE9aGVhZAAACiAAAAAzAAAANv5C8VZoaGVhAAAKVAAAAB8AAAAkB0gDWWhtdHgAAAp0AAAAGAAAABgPzv/8bG9jYQAACowAAAAOAAAADgK2AaBtYXhwAAAKnAAAACAAAAAgARcKJG5hbWUAAAq8AAAA3QAAAW4NN4nUcG9zdAAAC5wAAAAvAAAASLaKUqdwcmVwAAALzAAAAFYAAABWkqGa/3icY2BgYGQAgpOd+YYg+uyRsNswGgBJQQd4AAB4nGNgZGBg4ANiCQYQYGJgZGBmYAWSLGAeAwAEmwA6AHicY2Bk7mCcwMDKwMHUxbSHgYGhB0IzPmAwZGRiYGBiYGVmgAMBBgc4OyDNNYXBQU32BSNz0P8shijmQIZpQGFGkBwA9EMLiHicY2BgYGaAYBkGRgYQCADyGMF8FgYTIM0BhEwgCTXZF4z//0NZDCDWzedADkQXCxCzgsxhZIMJAWmQPiYGVMDIMOwBAEDjCQwAAAB4nGNgQANGDEbMgf+zQBgAEcYD33icnVXZdtNWFJU8ZHASOmSgoA7X3DhQ68qEKRgwaSrFdiEdHAitBB2kDHTkncc+62uOQrtWH/m07n09JLR0rbYsls++R1tn2DrnRhwjKn0aiGvUoZKXA6msPZZK90lc13Uvj5UMBnFdthJPSZuonSRKat3sUC7xWOsqWSdYJ+PlIFZPVZ5noAziFB5lSUQbRBuplyZJ4onjJ4kWZxAfJUkgJaMQp9LIUEI1GsRS1aFM6dCr1xNx00DKRqMedVhU90PFJ8c1p9SsA0YqVznCFevVRr4bpwMve5DEOsGzrYcxHnisfpQqkIqR6cg/dkpOlIaBVHHUoVbi6DCTX/eRTCrNQKaMYkWl7oG43f102xYxPXQ6vi5KlUaqurnOKJrt0fGogygP2cbppNzQ2fbw5RlTVKtdcbPtQGYNXErJbHSfRAAdJlLj6QFONZwCqRn1R8XZ588BEslclKo8VTKHegOZMzt7cTHtbiersnCknwcyb3Z2452HQ6dXh3/R+hdM4cxHj+Jifj5C+lBqfiJOJKVGWMzyp4YfcVcgQrkxiAsXyuBThDl0RdrZZl3jtTH2hs/5SqlhPQna6KP4fgr9TiQrHGdRo/VInM1j13Wt3GdQS7W7Fzsyr0OVIu7vCwuuM+eEYZ4WC1VfnvneBTT/Bohn/EDeNIVL+5YpSrRvm6JMu2iKCu0SVKVdNsUU7YoppmnPmmKG9h1TzNKeMzLj/8vc55H7HN7xkJv2XeSmfQ+5ad9HbtoPkJtWITdtHblpLyA3rUZu2lWjOnYEGgZpF1IVQdA0svph3Fab9UDWjDR8aWDyLmLI+upER521tcofxX914gsHcmmip7siF5viLq/bFj483e6rj5pG3bDV+MaR8jAeRnocmtBZ+c3hv+1N3S6a7jKqMugBFUwKwABl7UAC0zrbCaT1mqf48gdgXIZ4zkpDtVSfO4am7+V5X/exOfG+x+3GLrdcd3kJWdYNcmP28N9SZKrrH+UtrVQnR6wrJ49VaxhDKrwour6SlHu0tRu/KKmy8l6U1srnk5CbPYMbQlu27mGwI0xpyiUeXlOlKD3UUo6yQyxvKco84JSLC1qGxLgOdQ9qa8TpoXoYGwshhqG0vRBwSCldFd+0ynfxHqtr2Oj4xRXh6XpyEhGf4ir7UfBU10b96A7avGbdMoMpVaqn+4xPsa/b9lFZaaSOsxe3VAfXNOsaORXTT+Rr4HRvOGjdAz1UfDRBI1U1x+jGKGM0ljXl3wR0MVZ+w2jVYvs93E+dpFWsuUuY7JsT9+C0u/0q+7WcW0bW/dcGvW3kip8jMb8tCvw7B2K3ZA3UO5OBGAvIWdAYxhYmdxiug23EbfY/Jqf/34aFRXJXOxq7eerD1ZNRJXfZ8rjLTXZZ16M2R9VOGvsIjS0PN+bY4XIstsRgQbb+wf8x7gF3aVEC4NDIZZiI2nShnurh6h6rsW04VxIBds2x43QAegAuQd8cu9bzCYD13CPnLsB9cgh2yCH4lByCz8i5BfA5OQRfkEMwIIdgl5w7AA/IIXhIDsEeOQSPyNkE+JIcgq/IIYjJIUjIuQ3wmByCJ+QQfE0OwTdGrk5k/pYH2QD6zqKbQKmdGhzaOGRGrk3Y+zxY9oFFZB9aROqRkesT6lMeLPV7i0j9wSJSfzRyY0L9iQdL/dkiUn+xiNRnxpeZIymvDp7zjg7+BJfqrV4AAAAAAQAB//8AD3icpZNNTxNRFIbPuffOvUNnpl8M0wr9YKbtDBYspJ0pAgKVDyGgfISGABWEhaSwMDHxP7jThTtcGP4BLly48i/gzp/hVmOKd1pJTFy6OSf3nrzvZN77HCAANz/pB6rBOCzDt0+TyDgurF9FtvYaD0AAAUHagIQTPAbOCGenwFTC1FNQKVHpKQAQBNICqih0EyhVmqBQZXVo/UqTHpPSA0FgGzgy5Kwt1dhTY1dNEDngv/L/+/r+fkNLmam6F1TdWl96NEj49ZRdTeUwhrzgeG7BdvhAwrRqdrU+i/481mvVlJVFk3u24072hzfVPHaLZQrkzji6R4t4XcipTAxxQaihdyZKvl/C65KvFLmgTDta7EwsHONbY9ZwjXd4JuusYXSmZf9uXOC1nEVZUsqR+qWe+o2QWsL0j3Im/bVkVCpCaddDSqVS/iW9+XVzTnfpNtTgBM7gVeNlDBl9jKAqKGAVdXHi14BxTVnYRhUfgqZzXeNtmWGfSvpkQqACVVvAQOhMtKSnroHegkgEdwAxsgicKzugKJqy9OzwYH+3uflkfW1leX5uKuH0Fx1jYFSGKFMKwiqjslLhqW6lTMHD4IQMzgv8iuK5XoUFMn5L5h2Gagf+HAZ+wREVdIRbcLgI/LClEk6FyD4AZg7rvsvXlly7OT3TLOR1/f7oxh56djnbeZ8bQR6JxNU43s3rFadorm/c0YoH0WF8XiwexuJ9I+Vkxo06kXI2M4bacK6SLjlkyspYVgaPHh3oX6ebzZkj0k9sPN5cO386fCkty9lLrkf1qBrFoiksc7A4gEbJUK2tuOclkyPnL+6d0YQZyenq52x5LNP5EjfjVa/zOmeS9GBaro6kT+7PD5qU+xODPNiNXPhWBGgrBJtsAiFhugRXAj+osf5bEC2R+ENaD0F53UMyRKxLQgjSag+uHioXfw1kuyXPL/0GxBaM+QAAeJxjYGRgYADiOW0z2eL5bb4ycDO/AIownD0SdhtG///zP4t5PnMgkMvBwAQSBQB+Tg5BAHicY2BkYGAO/J/FEMX84v8fIHs+A1AEBbABAI96BagAA+gAAAAAAAABTQAAA6AAAANZ//wDoAAAAAAAAAAAAAAA1AGgAeIAAAABAAAABgBqAAMAAAAAAAIAGgAnAG4AAACFCZEAAAAAeJxtjjFuwkAQRZ/BJkqIUqRIvaSMZMveQEOZggOkoEdoZVlCXmmBe6SiouIYOUAOkBPle1kpRbLSaN4f/Zm/wD0nMoaXUUhdecQNz4nHzOgT5/KcExdM+Uw8kfqWM8tvNbmLWwOPeOAx8Zg3XhLn8nwkLnjiknii+RcdW7wy99Btfa/2jqPlyI4NQdK1x91GsIq+Q+xBDofBUlGrL1W/l67aMqdkobLyNLzqhO8PKx9aZ2xVm6WJiep2Xi5KWzey/P3PWklBuotzo0tDJmsX9p3vTVPV/2z9AJ4wMncAAAB4nGNgYsAP2ICYkYGJkYmRmZGFNTkjNTmbvbRANyMxL4UbzNNNzS0oqQQAdvsJNABLuADIUlixAQGOWbkIAAgAYyCwASNEsAMjcLIEKAlFUkSyCgIHKrEGAUSxJAGIUViwQIhYsQYDRLEmAYhRWLgEAIhYsQYBRFlZWVm4Af+FsASNsQUARAAA) format("woff");}' +
		'.sv_-gui {position:fixed; top:5px; left:5px; z-index:999998; color:#fff; background:rgba(0,0,0,.7); border-radius:5px; box-shadow: 0 0 4px rgba(0, 0, 0, .4);}' +
		'.sv_-gui * {font-weight:normal; text-transform:none; text-shadow:none; font: 12px/1 Verdana,Arial,sans-serif;}' +
		'.sv_-hl {pointer-events:none; position:absolute; z-index:999999; opacity:0; border-radius:3px;}' +
		'.sv_-marker, .sv_-btn {' + prefixCss('webkit,o','transition:all .5s;') + '}' +
		'.sv_-btn {width:1.8em; padding:6px 8px; cursor:pointer; font:20px/1 stickyviewbookmarkleticons; text-align:center;}' +
		'.sv_-marker {background: hsla(60, 100%, 50%, .4); box-shadow: 0 0 10px hsla(60, 100%, 50%, .2);}' +
		'.sv_-picker {' + prefixCss('webkit,o','transition:all .3s;') + 'background: hsla(199, 100%, 55%, .4); box-shadow: 0 0 10px hsla(199, 100%, 55%, .4);}' +
		'.sv_-btnPick.sv_-active {color:hsl(199, 100%, 63%);}' +
		'.sv_-btnSticky {padding:6px 6px 6px 10px;}' +
		'.sv_-btnSticky.sv_-active {color:#ff8;}' +
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
		'<div class="sv_-btn sv_-btnSticky sv_-hide" title="Toggle viewport stickyness">\uE800</div>'
	
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
			guiBtnToggleStickyEl.innerHTML = '\uE801'
			guiBtnToggleStickyEl.style.display = 'block'
			guiBtnToggleStickyEl.className += ' sv_-active'
			flashMarkerEl()
		}
	}
	
	function disableSticky() {
		if (sticky) {
			sticky = false
			w.removeEventListener('resize', stickToEl, false)
			guiBtnToggleStickyEl.innerHTML = '\uE800'
			guiBtnToggleStickyEl.className = guiBtnToggleStickyEl.className.replace(' sv_-active','')
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