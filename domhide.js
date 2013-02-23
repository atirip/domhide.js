/* jshint laxcomma:true, laxbreak: true, asi:true */

/* @preserve
 * MIT Licensed
 * Copyright (c) 2012, Priit Pirita, atirip@yahoo.com
 * https://github.com/atirip/domhide.js
 */

(function(window, APP) {
	// deep means replacing node innards with <!-- innerHTML -->
	var	deep = true
	,	escapeContent = true
	,	esc = window.escape
	,	unesc = window.unescape
	,	doc = window.document
	,	div = doc.createElement('div')
	,	attrPref = 'data-domhide'
	,	getStyle = window.getComputedStyle
	,	setAttr
	,	getAttr
	,	removeAttr = function(node, name) {
			node.removeAttribute(name)
		}

		// this returns if node is deep hidden -> has no children
	,	hiddenNode = function(node) {
			return !!getAttr(node, attrPref)
		}

	,	hideNode = function(node, dp, e) {
			var width
			,	height
			,	style
			,	rect
	
			if ( dp = (undefined === dp ? deep : dp) ) {
				style = getStyle ? getStyle(node, null) : null
				dp = 'inline' != (style ? style.getPropertyValue('display') : node.currentStyle.display)
			}

			if ( dp ) {
				if ( !getAttr(node, attrPref) ) {
					// check if needed props are set inline
					width = -1 !== node.style.cssText.indexOf('width') ? 0 : (style ? style.getPropertyValue('width') : node.currentStyle.width)
					height = -1 !== node.style.cssText.indexOf('height') ? 0 : (style ? style.getPropertyValue('height') : node.currentStyle.height)

					// if IE returns anything but pixels
					if ( !style && ( !~width.indexOf('px') || !~height.indexOf('px') ) ) {
						rect = node.getBoundingClientRect()
						width = (rect.right - rect.left) + 'px'
						height = (rect.bottom - rect.top) + 'px'
					}

					setAttr( node, attrPref, width + ',' + height )
					width && (node.style.width = width)
					height && (node.style.height = height)
					// of all tests so far, this one is the fastest
					node.innerHTML = '<!--' + ( (undefined === e ? escapeContent : e) ? esc(node.innerHTML) : node.innerHTML ) + '-->'
				}
			} else {
				if( 'hidden' !== node.style.visibility ) {
					node.style.visibility = 'hidden'
					node.offsetHeight
				}
			}
		}

	,	revealNode = function(node, dp, e) {
			var attr
	
			if ( dp = (undefined === dp ? deep : dp) ) {
				dp = ( attr = getAttr(node, attrPref) )
			}
	
			if ( dp ) {
				removeAttr(node, attrPref)
				if ( 2 === (attr = attr.split(",")).length ) {
					// of all tests so far, this one is the fastest
					node.innerHTML = (undefined === e ? escapeContent : e) ? unesc(node.firstChild.nodeValue) : node.firstChild.nodeValue;
					0 !== +attr[0] && (node.style.width = '')
					0 !== +attr[1] && (node.style.height = '')
				}
			} else {
				if( 'hidden' === node.style.visibility ) {
					node.style.visibility = ''
					node.offsetHeight
				}
			}
		}

	// cross-browser set/get attribute
	div.setAttribute("data-test", "t")
	if ( div.getAttribute("data-test") !== "t" ) {
		// lifted from jQuery for IE<8
		setAttr = function( elem, name, value ) {
			var ret = elem.getAttributeNode( name )
			if ( !ret ) {
				ret = doc.createAttribute( name )
				elem.setAttributeNode( ret )
			}
			ret.nodeValue = value + ""
		};
		getAttr = function( elem, name ) {
			var ret = elem.getAttributeNode( name )
			return ret.nodeValue
		};
	} else {
		setAttr = function( node, name, val ) {
			node.setAttribute(name, val)
		};
		getAttr = function( node, name ) {
			return node.getAttribute(name)
		};
	}
	
	// export
	APP['hiddenNode'] = hiddenNode
	APP.hideNode = hideNode
	APP.revealNode = revealNode


})(window, (window.atirip || (window.atirip = {}) ));
