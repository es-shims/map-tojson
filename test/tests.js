'use strict';

var GetIntrinsic = require('es-abstract/GetIntrinsic');
var $Map = GetIntrinsic('%Map%', true);
var $Set = GetIntrinsic('%Set%', true);

module.exports = function (toJSON, t) {
	t.test('Sets', { skip: !$Set }, function (st) {
		var set = new $Set(); // Some engines’ native Sets can’t take an iterable
		set.add(1);
		set.add(2);
		st['throws'](function () { return toJSON(set); }, TypeError, 'Sets do not have a [[MapData]] internal slot');
		st.end();
	});

	t.test('Maps', { skip: !$Map }, function (st) {
		var entries = [[1, 2], [3, 4]];
		var map = new $Map(); // Some engines’ native Maps can’t take an iterable
		entries.forEach(function (entry) { map.set(entry[0], entry[1]); });
		st.deepEqual(toJSON(new $Map()), [], 'empty Map toJSONs to an empty Array');
		st.deepEqual(toJSON(map), entries, '`new Map(entries)` toJSONs to an Array of entries');
		st.end();
	});

	t.test('non-Maps', function (st) {
		st['throws'](function () { return toJSON([]); }, TypeError, 'Arrays do not have a [[MapData]] internal slot');
		st['throws'](function () { return toJSON({}); }, TypeError, 'Objects do not have a [[MapData]] internal slot');
		st['throws'](function () { return toJSON(''); }, TypeError, 'Strings do not have a [[MapData]] internal slot');
		st.end();
	});
};
