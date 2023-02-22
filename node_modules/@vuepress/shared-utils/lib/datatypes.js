"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTypes = exports.getType = exports.toRawType = exports.isNullOrUndefined = exports.isNull = exports.isUndefined = exports.isPlainObject = exports.isBoolean = exports.isString = exports.isFunction = exports.isObject = void 0;
const chalk_1 = __importDefault(require("chalk"));
const isObject = (obj) => obj !== null && typeof obj === 'object';
exports.isObject = isObject;
/**
 * Get the raw type string of a value e.g. [object Object]
 */
const _toString = Object.prototype.toString;
const getObjectType = (x) => _toString.call(x).slice(8, -1);
const isOfType = (type) => (x) => typeof x === type; // eslint-disable-line valid-typeof
const isObjectOfType = (type) => (x) => getObjectType(x) === type;
exports.isFunction = isOfType('function');
exports.isString = isOfType('string');
exports.isBoolean = isOfType('boolean');
exports.isPlainObject = isObjectOfType('Object');
exports.isUndefined = isOfType('undefined');
const isNull = (x) => x === null;
exports.isNull = isNull;
const isNullOrUndefined = (x) => (0, exports.isUndefined)(x) || (0, exports.isNull)(x);
exports.isNullOrUndefined = isNullOrUndefined;
const toRawType = (value) => _toString.call(value).slice(8, -1);
exports.toRawType = toRawType;
const getType = function (fn) {
    const match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : '';
};
exports.getType = getType;
function toNaturalMultiTypesLanguage(types) {
    const len = types.length;
    if (len === 1) {
        return types.join('');
    }
    const rest = types.slice(0, len - 1);
    const last = types[len - 1];
    return rest.join(', ') + ' or ' + last;
}
function assertTypes(value, types) {
    let valid;
    let warnMsg;
    let actualType = (0, exports.toRawType)(value);
    const expectedTypes = [];
    if (actualType === 'AsyncFunction') {
        actualType = 'Function';
    }
    for (const type of types) {
        const expectedType = (0, exports.getType)(type);
        expectedTypes.push(expectedType);
        valid = actualType === expectedType;
        if (valid)
            break;
    }
    if (!valid) {
        warnMsg
            = `expected a ${chalk_1.default.green(toNaturalMultiTypesLanguage(expectedTypes))} `
                + `but got ${chalk_1.default.yellow(actualType)}.`;
    }
    return { valid, warnMsg };
}
exports.assertTypes = assertTypes;
