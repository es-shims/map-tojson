'use strict';

var define = require('define-properties');

var requireMap = require('./requireMap');
var polyfill = require('./polyfill')();

module.exports = function shimMapPrototypeToJSON() {
	requireMap();
	define(Map.prototype, {
		toJSON: polyfill
	}, {
		toJSON: Map.prototype.toJSON !== polyfill
	});
	return Map.prototype.toJSON;
};
