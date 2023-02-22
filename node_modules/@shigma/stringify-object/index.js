'use strict';
const isRegexp = require('is-regexp');
const isObj = require('is-obj');
const getOwnEnumPropSymbols = require('get-own-enumerable-property-symbols').default;

module.exports = (input, options, pad) => {
	const seen = [];

	return (function stringify(input, options = {}, pad = '') {
		options.indent = options.indent || '\t';

		let tokens;

		if (options.inlineCharacterLimit === undefined) {
			tokens = {
				newLine: '\n',
				newLineOrSpace: '\n',
				pad,
				indent: pad + options.indent
			};
		} else {
			tokens = {
				newLine: '@@__STRINGIFY_OBJECT_NEW_LINE__@@',
				newLineOrSpace: '@@__STRINGIFY_OBJECT_NEW_LINE_OR_SPACE__@@',
				pad: '@@__STRINGIFY_OBJECT_PAD__@@',
				indent: '@@__STRINGIFY_OBJECT_INDENT__@@'
			};
		}

		const expandWhiteSpace = string => {
			if (options.inlineCharacterLimit === undefined) {
				return string;
			}

			const oneLined = string
				.replace(new RegExp(tokens.newLine, 'g'), '')
				.replace(new RegExp(tokens.newLineOrSpace, 'g'), ' ')
				.replace(new RegExp(tokens.pad + '|' + tokens.indent, 'g'), '');

			if (oneLined.length <= options.inlineCharacterLimit) {
				return oneLined;
			}

			return string
				.replace(new RegExp(tokens.newLine + '|' + tokens.newLineOrSpace, 'g'), '\n')
				.replace(new RegExp(tokens.pad, 'g'), pad)
				.replace(new RegExp(tokens.indent, 'g'), pad + options.indent);
		};

		if (seen.indexOf(input) !== -1) {
			return '"[Circular]"';
		}

		if (typeof input === 'function') {
			let output = String(input);
			if (!/^(function\b|\()/.test(output)) {
				output = output.replace(/^[^(]+/, 'function');
			}
			return output;
		}

		if (input === null ||
			input === undefined ||
			typeof input === 'number' ||
			typeof input === 'boolean' ||
			typeof input === 'symbol' ||
			isRegexp(input)
		) {
			return String(input);
		}

		if (input instanceof Date) {
			return `new Date('${input.toISOString()}')`;
		}

		if (Array.isArray(input)) {
			if (input.length === 0) {
				return '[]';
			}

			seen.push(input);

			const ret = '[' + tokens.newLine + input.map((el, i) => {
				const eol = input.length - 1 === i ? tokens.newLine : ',' + tokens.newLineOrSpace;

				let value = stringify(el, options, pad + options.indent);
				if (options.transform) {
					value = options.transform(input, i, value);
				}

				return tokens.indent + value + eol;
			}).join('') + tokens.pad + ']';

			seen.pop();

			return expandWhiteSpace(ret);
		}

		if (isObj(input)) {
			let objKeys = Object.keys(input).concat(getOwnEnumPropSymbols(input));

			if (options.filter) {
				objKeys = objKeys.filter(el => options.filter(input, el));
			}

			if (objKeys.length === 0) {
				return '{}';
			}

			seen.push(input);

			const ret = '{' + tokens.newLine + objKeys.map((el, i) => {
				const eol = objKeys.length - 1 === i ? tokens.newLine : ',' + tokens.newLineOrSpace;
				const isSymbol = typeof el === 'symbol';
				const isClassic = !isSymbol && /^[a-z$_][a-z$_0-9]*$/i.test(el);
				const key = isSymbol || isClassic ? el : stringify(el, options);

				let value = stringify(input[el], options, pad + options.indent);
				if (options.transform) {
					value = options.transform(input, el, value);
				}

				return tokens.indent + String(key) + ': ' + value + eol;
			}).join('') + tokens.pad + '}';

			seen.pop();

			return expandWhiteSpace(ret);
		}

		input = String(input).replace(/[\r\n]/g, x => x === '\n' ? '\\n' : '\\r');

		if (options.singleQuotes === false) {
			input = input.replace(/"/g, '\\"');
			return `"${input}"`;
		}

		input = input.replace(/\\?'/g, '\\\'');
		return `'${input}'`;
	})(input, options, pad);
};
