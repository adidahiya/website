webpackJsonp([221374088121123],{

/***/ 129:
/***/ (function(module, exports) {

	/**
	 * Copyright 2015, Yahoo! Inc.
	 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	 */
	'use strict';
	
	var REACT_STATICS = {
	    childContextTypes: true,
	    contextTypes: true,
	    defaultProps: true,
	    displayName: true,
	    getDefaultProps: true,
	    mixins: true,
	    propTypes: true,
	    type: true
	};
	
	var KNOWN_STATICS = {
	  name: true,
	  length: true,
	  prototype: true,
	  caller: true,
	  callee: true,
	  arguments: true,
	  arity: true
	};
	
	var defineProperty = Object.defineProperty;
	var getOwnPropertyNames = Object.getOwnPropertyNames;
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var getPrototypeOf = Object.getPrototypeOf;
	var objectPrototype = getPrototypeOf && getPrototypeOf(Object);
	
	module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
	    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
	
	        if (objectPrototype) {
	            var inheritedComponent = getPrototypeOf(sourceComponent);
	            if (inheritedComponent && inheritedComponent !== objectPrototype) {
	                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
	            }
	        }
	
	        var keys = getOwnPropertyNames(sourceComponent);
	
	        if (getOwnPropertySymbols) {
	            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
	        }
	
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
	                var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
	                try { // Avoid failures from read-only properties
	                    defineProperty(targetComponent, key, descriptor);
	                } catch (e) {}
	            }
	        }
	
	        return targetComponent;
	    }
	
	    return targetComponent;
	};


/***/ }),

/***/ 439:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/profile.9c2efcf1.jpg";

/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	const gatsby_link_1 = __webpack_require__(121);
	const React = __webpack_require__(1);
	const profileImage = __webpack_require__(439);
	const IndexPage = () => React.createElement("div", null, React.createElement("img", { src: profileImage, alt: "profile", width: "240px", style: { height: 240, width: 240 } }), React.createElement("h3", { style: { marginTop: 0 } }, "portfolio"), React.createElement("p", null, React.createElement(gatsby_link_1.default, { to: "/projects/" }, "creative projects"), React.createElement("br", null), React.createElement(gatsby_link_1.default, { to: "/photos/" }, "selected photographs")), React.createElement("h3", null, "links"), React.createElement("p", null, React.createElement("a", { href: "https://www.github.com/adidahiya" }, "github"), React.createElement("br", null), React.createElement("a", { href: "https://www.flickr.com/photos/adidas006" }, "flickr"), React.createElement("br", null), React.createElement("a", { href: "https://www.last.fm/user/adidas006" }, "last.fm"), React.createElement("br", null), React.createElement("a", { href: "https://soundcloud.com/adi-dahiya" }, "soundcloud"), React.createElement("br", null), React.createElement("a", { href: "https://twitter.com/adi_dahiya" }, "twitter"), React.createElement("br", null), React.createElement("a", { href: "https://instagram.com/adidahiya" }, "instagram")));
	exports.default = IndexPage;

/***/ })

});
//# sourceMappingURL=component---src-pages-index-tsx-2bcd68aaf28d2a704a71.js.map