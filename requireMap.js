'use strict';

var GetIntrinsic = require('get-intrinsic');
var $Map = GetIntrinsic('%Map%', true);
var $TypeError = GetIntrinsic('%TypeError%');

module.exports = function requireGlobalMap() {
	if (!$Map) {
		throw new $TypeError('Map.prototype.toJSON requires Map (either native, or polyfilled with es6-shim)');
	}
};
