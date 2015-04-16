var isCallable = require('es-abstract/es7').IsCallable;
var hasSets = typeof Set !== 'undefined' && isCallable(Set);
var hasMaps = typeof Map !== 'undefined' && isCallable(Map);

module.exports = function (toJSON, t) {
	var sparseish = { length: 5, 0: 'a', 1: 'b' };
	var overfullarrayish = { length: 2, 0: 'a', 1: 'b', 2: 'c' };
	var arr = [1, 2, 3];
	var arrEntries = [[0, 1], [1, 2], [2, 3]];

	t.test('Sets', { skip: !hasSets }, function (st) {
		var set = new Set(); // Some engines’ native Sets can’t take an iterable
		arr.forEach(function (v) { set.add(v); });
		st.deepEqual(toJSON(set), arrEntries, '`new Set(iterable)` toJSONs to Array of entries');
		st.deepEqual(toJSON(new Set()), [], 'empty Set toJSONs to empty Array');
		st.end();
	});

	t.test('Maps', { skip: !hasMaps }, function (st) {
		var entries = [[1, 2], [3, 4]];
		var map = new Map(); // Some engines’ native Maps can’t take an iterable
		entries.forEach(function (entry) { map.set(entry[0], entry[1]); });
		st.deepEqual(toJSON(new Map()), [], 'empty Map toJSONs to an empty Array');
		st.deepEqual(toJSON(map), entries, '`new Map(entries)` toJSONs to an Array of entries');
		st.end();
	});

	t.test('Arrays', function (st) {
		st.deepEqual(toJSON([]), [], 'an empty Array toJSONs to an empty Array');
		st.deepEqual(toJSON(arr), arrEntries, 'Array toJSONs to a similar Array');
		st.end();
	});

	t.skip('array-likes', function (st) {
		// skipped for now. currently throws.
		st.deepEqual(
			toJSON(sparseish),
			[[0, 'a'], [1, 'b'], [2, undefined], [3, undefined], [4, undefined]],
			'sparse array-like toJSONs to dense Array'
		);
		st.deepEqual(
			toJSON(overfullarrayish),
			[[0, 'a'], [1, 'b']],
			'array-like with extra properties toJSONs to properly lengthed Array'
		);
		st.end();
	});

	t.test('Strings', function (st) {
		st.deepEqual(toJSON(''), [], 'empty string toJSONs to an empty Array');
		st.deepEqual(toJSON('abc'), [[0, 'a'], [1, 'b'], [2, 'c']], 'string toJSONs to an Array of entries of [index, character]');
		st.end();
	});
};
