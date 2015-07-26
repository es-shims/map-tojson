'use strict';

var test = require('tape');
var defineProperties = require('define-properties');
var bind = require('function-bind');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var isCallable = require('es-abstract/es7').IsCallable;
var functionsHaveNames = function f() {}.name === 'f';
var hasMaps = typeof Map !== 'undefined' && isCallable(Map);

var toJSON = require('../');

test('no Maps', { skip: hasMaps }, function (t) {
	t.throws(toJSON.shim, TypeError, 'shim method throws when Map doesn’t exist');
	t.end();
});

test('shimmed', { skip: !hasMaps }, function (t) {
	toJSON.shim();
	t.equal(Map.prototype.toJSON.length, 0, 'Map#toJSON has the right arity');
	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(Map.prototype.toJSON.name, 'toJSON', 'Map#toJSON has name "toJSON"');
		st.end();
	});

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(Map.prototype, 'toJSON'), 'Map#toJSON is not enumerable');
		et.end();
	});

	var supportsStrictMode = (function () { return typeof this === 'undefined'; }());

	t.test('bad array/this value', { skip: !supportsStrictMode }, function (st) {
		st.throws(function () { return toJSON(undefined, 'a'); }, TypeError, 'undefined is not an object');
		st.throws(function () { return toJSON(null, 'a'); }, TypeError, 'null is not an object');
		st.end();
	});

	require('./tests')(bind.call(Function.call, Map.prototype.toJSON), t);

	t.end();
});
