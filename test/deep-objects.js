var assert = require('chai').assert;
var o = require('../src/deep-objects');

describe('deep-objects', function() {
	describe('#getProperty(object, path)', function() {
		it('should return the property at the given dot-notated path of the given object', function() {
			assert.strictEqual(o.getProperty({ a: 'abc' }, 'a'), 'abc');
			assert.strictEqual(o.getProperty({ a: { b: { a: 'foo' }}}, 'a.b.a'), 'foo');
			assert.strictEqual(o.getProperty({ a: { b: 'bar' }, b: { a: 'foo' }}, 'b.a'), 'foo');

			assert.deepEqual(o.getProperty({ a: { b: { a: 'foo' }}}, 'a.b'), { a: 'foo' });
			assert.deepEqual(o.getProperty({ a: { b: 'bar' }, b: { a: 'foo' }}, 'a'), { b: 'bar' });

			assert.deepEqual(o.getProperty({ '': { '': 'bar' }}, ''), { '': 'bar' });
			assert.strictEqual(o.getProperty({ '': { '': 'bar' }}, '.'), 'bar');

			assert.strictEqual(o.getProperty({ 'hasOwnProperty': false }, 'hasOwnProperty'), false);
			assert.strictEqual(o.getProperty(['ay', 'by'], '0'), 'ay');
		});

		it('should return undefined if the given object does not have a deep property at the given dot-notated path', function() {
			assert.strictEqual(o.getProperty({ a: 'abc' }, 'b'), undefined);
			assert.strictEqual(o.getProperty({ a: { b: { a: 'foo' }}}, 'a.b.b.a'), undefined);
			assert.strictEqual(o.getProperty({ a: { b: { a: 'foo' }}}, 'a.b.b.a.b'), undefined);

			assert.strictEqual(o.getProperty({ a: { b: { a: 'foo' }}}, 'b'), undefined);
			assert.strictEqual(o.getProperty({ a: { b: 'bar' }, b: { a: 'foo' }}, 'a.a'), undefined);
			assert.strictEqual(o.getProperty({ '': { '': 'bar' }}, '..'), undefined);

			assert.strictEqual(o.getProperty({ 'hasOwnProperty': false }, 'hasOwnProperty.false'), undefined);
			assert.strictEqual(o.getProperty(['ay', 'by'], '2'), undefined);
		});

		it('should return undefined if the property at the given dot-notated of of the given object is undefined', function() {
			assert.strictEqual(o.getProperty({ a: undefined }, 'a'), undefined);
		});

		it('should return undefined if no object has been given', function() {
			assert.strictEqual(o.getProperty('abc', 'a'), undefined);
			assert.strictEqual(o.getProperty(true, 'a'), undefined);
			assert.strictEqual(o.getProperty(false, 'a'), undefined);
			assert.strictEqual(o.getProperty(0, 'a'), undefined);
			assert.strictEqual(o.getProperty(null, 'a'), undefined);
			assert.strictEqual(o.getProperty(undefined, 'a'), undefined);
			assert.strictEqual(o.getProperty(function() {}, 'name'), undefined);
		});
	});

	describe('#hasProperty(object, path)', function() {
		it('should return true if the given object has a deep property at the given dot-notated path', function() {
			assert.isTrue(o.hasProperty({ a: 'abc' }, 'a'));
			assert.isTrue(o.hasProperty({ a: { b: { a: 'foo' }}}, 'a.b.a'));
			assert.isTrue(o.hasProperty({ a: { b: 'bar' }, b: { a: undefined }}, 'b.a'));

			assert.isTrue(o.hasProperty({ a: { b: { a: 'foo' }}}, 'a.b'));
			assert.isTrue(o.hasProperty({ a: { b: 'bar' }, b: { a: 'foo' }}, 'a'));

			assert.isTrue(o.hasProperty({ '': { '': 'bar' }}, ''));
			assert.isTrue(o.hasProperty({ '': { '': 'bar' }}, '.'));

			assert.isTrue(o.hasProperty({ 'hasOwnProperty': undefined }, 'hasOwnProperty'));
			assert.isTrue(o.hasProperty(['ay', 'by'], '0'));
		});

		it('should return false if the given object does not have a deep property at the given dot-notated path', function() {
			assert.isFalse(o.hasProperty({ a: 'abc' }, 'b'));
			assert.isFalse(o.hasProperty({ a: { b: { a: 'foo' }}}, 'a.b.b.a'));
			assert.isFalse(o.hasProperty({ a: { b: { a: 'foo' }}}, 'a.b.b.a.b'));

			assert.isFalse(o.hasProperty({ a: { b: { a: 'foo' }}}, 'b'));
			assert.isFalse(o.hasProperty({ a: { b: 'bar' }, b: { a: 'foo' }}, 'a.a'));
			assert.isFalse(o.hasProperty({ '': { '': 'bar' }}, '..'));

			assert.isFalse(o.hasProperty({ 'hasOwnProperty': false }, 'hasOwnProperty.false'));
			assert.isFalse(o.hasProperty(['ay', 'by'], '2'));
		});

		it('should return false if no object has been given', function() {
			assert.isFalse(o.hasProperty('abc', 'toString'));
			assert.isFalse(o.hasProperty(true, 'toString'));
			assert.isFalse(o.hasProperty(false, 'toString'));
			assert.isFalse(o.hasProperty(0, 'toString'));
			assert.isFalse(o.hasProperty(null, 'toString'));
			assert.isFalse(o.hasProperty(undefined, 'toString'));
			assert.isFalse(o.hasProperty(function() {}, 'toString'));
		});
	});

	describe('#setProperty(object, path, value)', function() {
		it('should set the given value at the given dot-notated path of the given object', function() {
			var obj = {};
			o.setProperty(obj, 'a', 'abc');
			assert.deepEqual(obj, { a: 'abc' });
			o.setProperty(obj, 'b.a.a', ['isarray']);
			assert.deepEqual(obj, { a: 'abc', b: { a: { a: ['isarray' ]}}});
			o.setProperty(obj, 'b.b', undefined);
			assert.deepEqual(obj, { a: 'abc', b: { a: { a: ['isarray' ]}, b: undefined}});
			o.setProperty(obj, 'b.c');
			assert.deepEqual(obj, { a: 'abc', b: { a: { a: ['isarray' ]}, b: undefined, c: undefined}});
		});

		it('should return the given object', function() {
			var obj = {};
			assert.strictEqual(o.setProperty(obj, 'a', 'abc'), obj);
			assert.strictEqual(o.setProperty(obj, 'a', 'abc'), obj);
			assert.strictEqual(o.setProperty(obj, 'b.a.a', ['isarray']), obj);
		});

		it('should return the unchanged object if a property of the given object in the given dot-notated path is not of type object', function() {
			var obj = { a: 'somestring' };
			assert.strictEqual(o.setProperty(obj, 'a.b', 'abc'), obj);
			assert.deepEqual(obj, { a: 'somestring' });
			assert.strictEqual(o.setProperty(obj, 'a.b.c.a.b', 'abc'), obj);
			assert.deepEqual(obj, { a: 'somestring' });
		});

		it('should return the unchanged input if no object has been given', function() {
			assert.strictEqual(o.setProperty('abc', 'toString', true), 'abc');
			assert.strictEqual(o.setProperty(true, 'toString', true), true);
			assert.strictEqual(o.setProperty(false, 'toString', true), false);
			assert.strictEqual(o.setProperty(0, 'toString', true), 0);
			assert.strictEqual(o.setProperty(null, 'toString', true), null);
			assert.strictEqual(o.setProperty(undefined, 'toString', true), undefined);
			var f = function() {};
			assert.strictEqual(o.setProperty(f, 'toString', true), f);
		});
	});

	describe('#deleteProperty(object, path)', function() {
		it('should delete the property at the given dot-notated path of the given object', function() {
			var obj = { a: { b: [{ a: 154 }]}, b: { a: { c: 132 }}, c: 54 };
			o.deleteProperty(obj, 'c');
			assert.deepEqual(obj, { a: { b: [{ a: 154 }]}, b: { a: { c: 132 }}});
			o.deleteProperty(obj, 'b.a.c');
			assert.deepEqual(obj, { a: { b: [{ a: 154 }]}, b: { a: {}}});
			o.deleteProperty(obj, 'b');
			assert.deepEqual(obj, { a: { b: [{ a: 154 }]}});
			o.deleteProperty(obj, 'a.b.0.a');
			assert.deepEqual(obj, { a: { b: [{}]}});
			o.deleteProperty(obj, 'a.b');
			assert.deepEqual(obj, { a: {}});
			o.deleteProperty(obj, 'a');
			assert.deepEqual(obj, {});
			var obj2 = { '': { '': '' }};
			o.deleteProperty(obj2, '.');
			assert.deepEqual(obj2, { '': {}});
			o.deleteProperty(obj2, '');
			assert.deepEqual(obj2, {});
		});

		it('should return the given object', function() {
			var obj = { a: { a: ['abc']}};
			assert.strictEqual(o.deleteProperty(obj, 'a.a'), obj);
			assert.strictEqual(o.deleteProperty(obj, 'a'), obj);
			assert.strictEqual(o.deleteProperty(obj, 'a.b'), obj);
		});

		it('should return the unchanged object if the given object does not have a deep property at the given dot-notated path', function() {
			assert.deepEqual(o.deleteProperty({ a: 'abc' }, 'b'), { a: 'abc' });
			assert.deepEqual(o.deleteProperty({ a: { b: { a: 'foo' }}}, 'a.b.b.a'), { a: { b: { a: 'foo' }}});
			assert.deepEqual(o.deleteProperty({ a: { b: { a: 'foo' }}}, 'a.b.b.a.b'), { a: { b: { a: 'foo' }}});

			assert.deepEqual(o.deleteProperty({ a: { b: { a: 'foo' }}}, 'b'), { a: { b: { a: 'foo' }}});
			assert.deepEqual(o.deleteProperty({ a: { b: 'bar' }, b: { a: 'foo' }}, 'a.a'), { a: { b: 'bar' }, b: { a: 'foo' }});
			assert.deepEqual(o.deleteProperty({ '': { '': 'bar' }}, '..'), { '': { '': 'bar' }});

			assert.deepEqual(o.deleteProperty({ 'hasOwnProperty': false }, 'hasOwnProperty.false'), { 'hasOwnProperty': false });
			assert.deepEqual(o.deleteProperty(['ay', 'by'], '2'), ['ay', 'by']);
		});

		it('should return the unchanged input if no object has been given', function() {
			assert.strictEqual(o.deleteProperty('abc', 'toString'), 'abc');
			assert.strictEqual(o.deleteProperty(true, 'toString'), true);
			assert.strictEqual(o.deleteProperty(false, 'toString'), false);
			assert.strictEqual(o.deleteProperty(0, 'toString'), 0);
			assert.strictEqual(o.deleteProperty(null, 'toString'), null);
			assert.strictEqual(o.deleteProperty(undefined, 'toString'), undefined);
			var f = function() {};
			assert.strictEqual(o.deleteProperty(f, 'toString'), f);
		});
	});
});