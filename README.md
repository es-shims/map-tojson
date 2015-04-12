# map-tojson <sup>[![Version Badge][2]][1]</sup>

[![Build Status][3]][4]
[![dependency status][5]][6]
[![dev dependency status][7]][8]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][11]][1]

[![browser support][9]][10]

ES7 Proposal: Map#toJSON https://github.com/DavidBruant/Map-Set.prototype.toJSON

This polyfill is spec-compliant (based on the spec so far).
It will work in every engine in which Map exists natively, or where it is polyfilled with the (es6-shim)[es6-shim-url]

## Example

```js
var mapToJSON = require('map-tojson');
var assert = require('assert');
var items = ['a', 'b', 'c'];
var entries = [[1, 2], [3, 4]];

assert.deepEqual(mapToJSON(new Set()), []);
assert.deepEqual(mapToJSON(new Set(items)), items);
assert.deepEqual(mapToJSON(new Map()), []);
assert.deepEqual(mapToJSON(new Map(entries)), entries);
assert.deepEqual(mapToJSON(''), []);
assert.deepEqual(mapToJSON('abc'), ['a', 'b', 'c']);
assert.deepEqual(mapToJSON([]), []);
assert.deepEqual(mapToJSON(items), items);
assert.deepEqual(mapToJSON(entries), entries);

mapToJSON.shim();
assert.deepEqual(new Map(entries).toJSON(), entries);
assert.deepEqual(new Map().toJSON(), []);

```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[1]: https://npmjs.org/package/map-tojson
[2]: http://vb.teelaun.ch/ljharb/map-tojson.svg
[3]: https://travis-ci.org/ljharb/map-tojson.svg
[4]: https://travis-ci.org/ljharb/map-tojson
[5]: https://david-dm.org/ljharb/map-tojson.svg
[6]: https://david-dm.org/ljharb/map-tojson
[7]: https://david-dm.org/ljharb/map-tojson/dev-status.svg
[8]: https://david-dm.org/ljharb/map-tojson#info=devDependencies
[9]: https://ci.testling.com/ljharb/map-tojson.png
[10]: https://ci.testling.com/ljharb/map-tojson
[11]: https://nodei.co/npm/map-tojson.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/map-tojson.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/map-tojson.svg
[downloads-url]: http://npm-stat.com/charts.html?package=map-tojson
[es6-shim-url]: https://github.com/es-shims/es6-shim
