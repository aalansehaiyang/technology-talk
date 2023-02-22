'use strict';

var GetIntrinsic = require('get-intrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('call-bind/callBound');

var $byteLength = callBound('%ArrayBuffer.prototype.byteLength%', true)
	|| function byteLength(ab) { return ab.byteLength; }; // in node < 0.11, byteLength is an own nonconfigurable property

var isArrayBuffer = require('is-array-buffer');

var availableTypedArrays = require('available-typed-arrays')();

// https://262.ecma-international.org/6.0/#sec-isdetachedbuffer

module.exports = function IsDetachedBuffer(arrayBuffer) {
	if (!isArrayBuffer(arrayBuffer)) {
		throw new $TypeError('Assertion failed: `arrayBuffer` must be an Object with an [[ArrayBufferData]] internal slot');
	}
	if ($byteLength(arrayBuffer) === 0) {
		try {
			new global[availableTypedArrays[0]](arrayBuffer); // eslint-disable-line no-new
		} catch (error) {
			return error.name === 'TypeError';
		}
	}
	return false;
};
