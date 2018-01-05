webpackJsonp([70444547971356],{

/***/ 441:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/edge-art-render.7e0c825b.png";

/***/ }),

/***/ 442:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/edge-art-video.058d67f5.png";

/***/ }),

/***/ 443:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/header.35e25484.png";

/***/ }),

/***/ 444:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/internals.a3857584.jpg";

/***/ }),

/***/ 445:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/prototype.8e20d2c0.jpg";

/***/ }),

/***/ 261:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/sell-sheet.a8540be9.pdf";

/***/ }),

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(1);
	const utils_1 = __webpack_require__(166);
	const styles = __webpack_require__(251);
	const PROJECT_NAMES = ["Mapping Musical Genres", "Branding the Contemporary Fringe", "You Are the Product", "Electronic Synthesis Visualizer", "Tweet Topic Correlations Between U.S. Counties", "Buzz, Your Smart Doorman", "Losing My Edge", "PennApps hackathon", "Nostrand", "Levine", "Creative Process Book"];
	const SectionLink = ({ name }) => React.createElement("li", null, React.createElement("a", { href: `#${utils_1.slugify(name)}` }, name));
	const ProjectHeading = ({ index }) => {
	    const name = PROJECT_NAMES[index];
	    return React.createElement("h3", { id: utils_1.slugify(name) }, PROJECT_NAMES[index], " ", React.createElement("span", { className: styles.tocLink }, React.createElement("a", { href: "#toc" }, "\u2191 top")));
	};
	const ProjectsIndexPage = () => React.createElement("div", { className: styles.projects }, React.createElement("h2", { id: "toc" }, "creative projects"), React.createElement("p", null, "Below, you'll find my work in information visualization, typography, graphic design, physical computing, branding, and various experiments."), React.createElement("p", null, React.createElement("ul", null, PROJECT_NAMES.map(n => React.createElement(SectionLink, { name: n })))), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 0 }), React.createElement("p", null, React.createElement("img", { src: __webpack_require__(452) }), React.createElement("img", { src: __webpack_require__(453) }), React.createElement("a", { className: styles.imageLink, href: __webpack_require__(455) }, React.createElement("img", { src: __webpack_require__(454) }))), React.createElement("p", null, React.createElement("a", { href: __webpack_require__(263) }, "60\" \u00D7 40\" print"), " ", "\u2014 Spring 2014"), React.createElement("p", null, "Multi-dimensional graph-based visualization representing the development of and influences between major musical genres from 1940\u20142000 (built using data from", " ", React.createElement("a", { href: "http://the.echonest.com/" }, "The Echo Nest"), " APIs).")), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 1 }), React.createElement("p", null, React.createElement("img", { src: __webpack_require__(441) }), React.createElement("img", { src: __webpack_require__(442) })), React.createElement("p", null, React.createElement("a", { href: "http://www.adidahiya.com/design/edge" }, "Interactive application"), " \u2014 Fall 2013"), React.createElement("p", null, "An experimental project which attempts to brand the contemporary fringe of art & design through a 2D visualization which reacts to user input via webcam.", " ", React.createElement("a", { href: "http://vimeo.com/adidahiya/edge" }, "Demo video on Vimeo"), ".")), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 2 }), React.createElement("p", null, React.createElement("img", { src: __webpack_require__(464) }), React.createElement("img", { src: __webpack_require__(463) })), React.createElement("p", null, React.createElement("a", { href: "http://www.adidahiya.com/design/typog" }, "Website"), " \u2014 Fall 2013"), React.createElement("p", null, "A typography-driven project which takes a critical look at the economics of popular free web services\u2013such as Google, Facebook, and Twitter\u2013which invert the traditional product consumption relationship.")), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 3 }), React.createElement("p", null, React.createElement("img", { src: __webpack_require__(460) })), React.createElement("p", null, React.createElement("a", { href: "http://www.adidahiya.com/synth-vis" }, "Interactive application"), " \u2014 Spring 2014"), React.createElement("p", null, "A simple browser-based synthesizer that visualizes subtractive synthesis over time. Users can play notes using their keyboard and see ADSR envelopes move across the isometric 3D canvas.")), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 4 }), React.createElement("p", null, React.createElement("img", { src: __webpack_require__(461) })), React.createElement("p", null, React.createElement("a", { href: "http://www.adidahiya.com/wwbp-counties" }, "Interactive application"), " \u2014 Spring 2014"), React.createElement("p", null, "A force-directed graph visualization which draws attention to particularly unique correlations of topics tweeted in different U.S. counties. Data source: Penn's", " ", React.createElement("a", { href: "http://wwbp.org/" }, "World Well-Being Project"), ".")), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 5 }), React.createElement("p", null, React.createElement("img", { src: __webpack_require__(443) }), React.createElement("img", { src: __webpack_require__(445) }), React.createElement("img", { src: __webpack_require__(444) })), React.createElement("p", null, React.createElement("a", { href: __webpack_require__(261) }, "Concept, prototype & marketing materials"), " ", "\u2014 Spring 2014"), React.createElement("p", null, "A \u201Csmart\u201D doorbell which sends you an SMS when a visitor arrives.")), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 6 }), React.createElement("p", null, React.createElement("img", { src: __webpack_require__(450) }), React.createElement("img", { src: __webpack_require__(451) })), React.createElement("p", null, React.createElement("a", { href: __webpack_require__(262) }, "5\" \u00D7 7\" letterpress print"), " ", "\u2014 Fall 2012"), React.createElement("p", null, "A graphical interpretation of a text using only typography. I used the lyrics from the LCD Soundsystem song ", React.createElement("em", null, "Losing My Edge"), ".")), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 7 }), React.createElement("p", null, React.createElement("img", { src: __webpack_require__(457) }), React.createElement("img", { src: __webpack_require__(458) }), React.createElement("img", { src: __webpack_require__(456) })), React.createElement("p", null, React.createElement("a", { href: "http://2014s.pennapps.com/" }, "Website"), " \u2014 Fall 2013"), React.createElement("p", null, "Logo design, website, branding, and creative direction for one of the largest student hackathons in the U.S.")), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 8 }), React.createElement("p", null, React.createElement("img", { src: __webpack_require__(462) })), React.createElement("p", null, React.createElement("a", { href: __webpack_require__(265) }, "12\" vinyl cover art"), " \u2014 Fall 2012"), React.createElement("p", null, "A vinyl cover designed to visually evoke the sounds of the song ", React.createElement("em", null, "Nostrand"), " by Ratatat.")), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 9 }), React.createElement("p", null, React.createElement("a", { href: __webpack_require__(446) }, React.createElement("img", { src: __webpack_require__(448) })), React.createElement("a", { href: __webpack_require__(447) }, React.createElement("img", { src: __webpack_require__(449) }))), React.createElement("p", null, "Custom typeface & sample sheet \u2014 Fall 2012"), React.createElement("p", null, "A custom typeface designed from a photograph I took of a building on UPenn's campus.")), React.createElement("hr", null), React.createElement("section", null, React.createElement(ProjectHeading, { index: 10 }), React.createElement("p", null, React.createElement("img", { src: __webpack_require__(459) })), React.createElement("p", null, React.createElement("a", { href: __webpack_require__(264) }, "Booklet"), " \u2014 Fall 2012"), React.createElement("p", null, "A process book containing sketches and concepts for some early graphic design projects. Images are compressed to reduce file size (larger version available upon request).")));
	exports.default = ProjectsIndexPage;

/***/ }),

/***/ 446:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/full-1.d011e7dc.png";

/***/ }),

/***/ 447:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/full-2.24975e19.png";

/***/ }),

/***/ 448:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/preview-1.3409e891.png";

/***/ }),

/***/ 449:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/preview-2.468687b8.png";

/***/ }),

/***/ 262:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/losing-my-edge.8f9713a6.pdf";

/***/ }),

/***/ 450:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/photo.e0a6541c.jpg";

/***/ }),

/***/ 451:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/preview.1ea31142.png";

/***/ }),

/***/ 452:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/clip-1.fdac310a.png";

/***/ }),

/***/ 453:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/clip-2.82806e81.png";

/***/ }),

/***/ 454:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/poster-photo-small.f6fa63cb.jpg";

/***/ }),

/***/ 455:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/poster-photo.9f444063.jpg";

/***/ }),

/***/ 263:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/poster.bc9b6632.pdf";

/***/ }),

/***/ 456:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/logo.b0faca74.png";

/***/ }),

/***/ 457:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/website-2014s.4a106543.png";

/***/ }),

/***/ 458:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/website.6357f70d.png";

/***/ }),

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/preview.c5a0fe07.png";

/***/ }),

/***/ 264:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/process-book.f269fcc7.pdf";

/***/ }),

/***/ 251:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"projects":"src-pages-projects----projects-module---projects---1ZYwu","imageLink":"src-pages-projects----projects-module---imageLink---27O6_","tocLink":"src-pages-projects----projects-module---tocLink---1X_sj"};

/***/ }),

/***/ 460:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/synth-vis.9123b412.png";

/***/ }),

/***/ 461:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/wwbp-counties.7072c22d.png";

/***/ }),

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/preview.87814dd0.png";

/***/ }),

/***/ 265:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/vinyl-sleeve.8dac464c.pdf";

/***/ }),

/***/ 463:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/doc-6.347c1642.jpg";

/***/ }),

/***/ 464:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/process.badfe1e7.jpg";

/***/ }),

/***/ 166:
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	function slugify(text) {
	    return text.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
	}
	exports.slugify = slugify;

/***/ })

});
//# sourceMappingURL=component---src-pages-projects-index-tsx-585bcec934b58596ab3d.js.map