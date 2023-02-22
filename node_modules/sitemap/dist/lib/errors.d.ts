/*!
 * Sitemap
 * Copyright(c) 2011 Eugene Kalinin
 * MIT Licensed
 */
/**
 * URL in SitemapItem does not exists
 */
export declare class NoURLError extends Error {
    constructor(message?: string);
}
/**
 * Config was not passed to SitemapItem constructor
 */
export declare class NoConfigError extends Error {
    constructor(message?: string);
}
/**
 * changefreq property in sitemap is invalid
 */
export declare class ChangeFreqInvalidError extends Error {
    constructor(message?: string);
}
/**
 * priority property in sitemap is invalid
 */
export declare class PriorityInvalidError extends Error {
    constructor(message?: string);
}
/**
 * SitemapIndex target Folder does not exists
 */
export declare class UndefinedTargetFolder extends Error {
    constructor(message?: string);
}
export declare class InvalidVideoFormat extends Error {
    constructor(message?: string);
}
export declare class InvalidVideoDuration extends Error {
    constructor(message?: string);
}
export declare class InvalidVideoDescription extends Error {
    constructor(message?: string);
}
export declare class InvalidAttrValue extends Error {
    constructor(key: string, val: any, validator: RegExp);
}
export declare class InvalidAttr extends Error {
    constructor(key: string);
}
export declare class InvalidNewsFormat extends Error {
    constructor(message?: string);
}
export declare class InvalidNewsAccessValue extends Error {
    constructor(message?: string);
}
