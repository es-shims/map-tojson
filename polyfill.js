'use strict';

var GetIntrinsic = require('es-abstract/GetIntrinsic');
var $Map = GetIntrinsic('%Map%', true);

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	if (!$Map || !$Map.prototype.toJSON) {
		return implementation;
	}
	return $Map.prototype.toJSON;
};
