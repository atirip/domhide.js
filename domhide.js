/* jshint laxcomma:true, laxbreak: true, asi:true */

/* @preserve
 * MIT Licensed
 * Copyright (c) 2012, Priit Pirita, atirip@yahoo.com
 * https://github.com/atirip/domhide.js
 */

(function() {

	// deep means replacing node innards with <!-- innerHTML -->
	var	deep = true
	,	escapeContent = true
	,	window = this

	,	exports
	,	module = 'domhide'

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
			,	comment
			,	rect
	
			if ( dp = (undefined === dp ? deep : dp) ) {
				style = getStyle ? getStyle(node, null) : null
				dp = 'inline' != (style ? style.getPropertyValue('display') : node.currentStyle.display)
			}

			if ( dp ) {
				if ( !getAttr(node, attrPref) ) {
					width = -1 !== node.style.cssText.indexOf('width') ? 0 : (style ? style.getPropertyValue('width') : node.currentStyle.width)
					height = -1 !== node.style.cssText.indexOf('height') ? 0 : (style ? style.getPropertyValue('height') : node.currentStyle.height)

					// if anything but pixels
					if ( (width && !~width.indexOf('px')) || (height && !~height.indexOf('px')) ) {
						rect = node.getBoundingClientRect()
						width && (width = (rect.right - rect.left) + 'px')
						height && (height = (rect.bottom - rect.top) + 'px')
					}
					setAttr( node, attrPref, width + ',' + height )
					width && (node.style.width = width)
					height && (node.style.height = height)
					// of all tests so far, this one is the fastest
					comment = doc.createComment( (undefined === e ? escapeContent : e) ? esc(node.innerHTML) : node.innerHTML )
					node.innerHTML = ''
					node.appendChild( comment )
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

	,	removeAttribute = function(node) {
			removeAttr(node, attrPref)
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
	exports = {
		removeData: removeAttribute,
		hiddenNode: hiddenNode,
		hideNode: hideNode,
		revealNode: revealNode
	}

	if (typeof define === 'function' && define.amd) {
		define(module, function() {
			return exports
		})
	} else {
		this[module] = exports
	}

}).call(this);
