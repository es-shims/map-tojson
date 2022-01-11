'use strict';

var RequireObjectCoercible = require('es-abstract/2021/RequireObjectCoercible');
var iterate = require('iterate-value');
var callBound = require('call-bind/callBound');
var $mapSize = callBound('%Map.prototype.size%', true);

var requireMap = require('./requireMap');

module.exports = function toJSON() {
	RequireObjectCoercible(this);
	requireMap();
	$mapSize(this);
	return iterate(this);
};
