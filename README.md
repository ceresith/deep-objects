# deep-objects
Provides functions to get, set or delete deep object properties using dot notation.

## Installation

```bash
$ npm install deep-objects
```

## Usage

```javascript
var o = require('deep-objects');

o.getProperty({ a: { b: ['foo', 'bar'] }}, 'a.b.0');
// 'foo'

o.hasProperty({ a: { b: ['foo', 'bar'] }}, 'a.b.0');
// true
o.hasProperty({ a: { b: ['foo', 'bar'] }}, 'a.c');
// false

o.setProperty({ a: 'foo' }, 'b.c', 'bar');
// { a: 'foo', b: { c: 'bar' }}

o.deleteProperty({ a: 'foo', b: { c: 'bar' }}, 'b.c');
// { a: 'foo', b: {}}
```

## Version

The current version is 1.0.0

## Tests

```bash
$ npm install
$ npm test
```

## License

  [MIT](LICENSE)