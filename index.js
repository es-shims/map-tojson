'use strict';

var ES = require('es-abstract/es7');
var define = require('define-properties');

var hasMaps = typeof Map !== 'undefined' && ES.IsCallable(Map);

var mapEntries;
if (hasMaps) { mapEntries = Map.prototype.entries; }

// polyfilled Maps with es6-shim might exist without for..of
var iterateWithWhile = function (map, receive) {
	var entries = mapEntries.call(map);
	var next;
	do {
		next = entries.next();
	} while (!next.done && receive(next.value));
};

var iterate = (function () {
	try {
		// Safari 8's native Map can't be iterated except with for..of
		return Function('mapEntries', 'map', 'receive', 'for (var entry of mapEntries.call(map)) { receive(entry); }').bind(null, mapEntries);
	} catch (e) {
		/* for..of seems to not be supported */
	}
	return iterateWithWhile;
}());

var requireMap = function requireMap() {
	if (!hasMaps) {
		throw new TypeError('Map.prototype.toJSON requires Map (either native, or polyfilled with es6-shim)');
	}
};

var mapToJSONshim = function toJSON() {
	ES.RequireObjectCoercible(this);
	requireMap();
	var entries = [];
	iterate(this, Array.prototype.push.bind(entries));
	return entries;
};

var boundMapToJSON = function mapToJSON(map) {
	ES.RequireObjectCoercible(map);
	return mapToJSONshim.call(map);
};
define(boundMapToJSON, {
	method: mapToJSONshim,
	shim: function shimMapPrototypeToJSON() {
		requireMap();
		define(Map.prototype, {
			toJSON: mapToJSONshim
		});
		return Map.prototype.toJSON;
	}
});
module.exports = boundMapToJSON;
