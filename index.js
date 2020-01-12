'use strict';

var IsCallable = require('es-abstract/2019/IsCallable');
var RequireObjectCoercible = require('es-abstract/2019/RequireObjectCoercible');
var define = require('define-properties');
var iterate = require('iterate-value');
var callBound = require('es-abstract/helpers/callBound');
var $mapSize = callBound('%Map.prototype.size%', true);

var hasMaps = typeof Map !== 'undefined' && IsCallable(Map);

var requireMap = function requireGlobalMap() {
	if (!hasMaps) {
		throw new TypeError('Map.prototype.toJSON requires Map (either native, or polyfilled with es6-shim)');
	}
};

var mapToJSONshim = function toJSON() {
	RequireObjectCoercible(this);
	requireMap();
	$mapSize(this);
	return iterate(this);
};

var boundMapToJSON = function mapToJSON(map) {
	RequireObjectCoercible(map);
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
