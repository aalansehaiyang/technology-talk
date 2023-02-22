
/*!
 * Stylus - errors
 * Copyright (c) Automattic <developer.wordpress.com>
 * MIT Licensed
 */

/**
 * Expose constructors.
 */

exports.ParseError = ParseError;
exports.SyntaxError = SyntaxError;

/**
 * Initialize a new `ParseError` with the given `msg`.
 *
 * @param {String} msg
 * @api private
 */

function ParseError(msg) {
  this.name = 'ParseError';
  this.message = msg;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ParseError);
  }
}

/**
 * Inherit from `Error.prototype`.
 */

ParseError.prototype.__proto__ = Error.prototype;

/**
 * Initialize a new `SyntaxError` with the given `msg`.
 *
 * @param {String} msg
 * @api private
 */

function SyntaxError(msg) {
  this.name = 'SyntaxError';
  this.message = msg;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ParseError);
  }
}

/**
 * Inherit from `Error.prototype`.
 */

SyntaxError.prototype.__proto__ = Error.prototype;
