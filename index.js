'use strict';

var ES = require('es-abstract/es7');
var define = require('define-properties');
var isString = require('is-string');

var hasMaps = typeof Map !== 'undefined' && ES.IsCallable(Map);
var hasSets = typeof Set !== 'undefined' && ES.IsCallable(Set);

var mapEntries;
if (hasMaps) { mapEntries = Map.prototype.entries; }
var slice = Array.prototype.slice;
var split = String.prototype.split;

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
		return Function('map', 'receive', 'for (var entry of map) { receive(entry); }');
	} catch (e) {
		/* for..of seems to not be supported */
	}
	return iterateWithWhile;
}());

var isMap = function isMap(map) {
	try {
		return typeof Map.prototype.has.call(map) === 'boolean';
	} catch (e) {
		return false;
	}
};

var isSet = function isSet(set) {
	try {
		return hasSets && typeof Set.prototype.has.call(set) === 'boolean';
	} catch (e) {
		return false;
	}
};

var requireMap = function requireMap() {
	if (!hasMaps) {
		throw new TypeError('Map.prototype.toJSON requires Map (either native, or polyfilled with es6-shim)');
	}
};

var mapArrayToEntry = function mapArrayToEntry(v, i) { return [i, v]; };

var mapToJSONshim = function toJSON() {
	ES.RequireObjectCoercible(this);
	var entries = [];
	if (Array.isArray(this)) {
		entries = slice.call(this).map(mapArrayToEntry);
	} else if (isString(this)) {
		entries = split.call(this, '').map(mapArrayToEntry);
	} else if (hasMaps && isMap(this)) {
		iterate(this, Array.prototype.push.bind(entries));
	} else if (hasSets && isSet(this)) {
		Set.prototype.forEach.call(this, function (value) {
			entries.push([value, value]);
		});
	} else if (ES.IsCallable(Array.from)) {
		entries = Array.from(this);
	} else {
		requireMap();
	}
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
