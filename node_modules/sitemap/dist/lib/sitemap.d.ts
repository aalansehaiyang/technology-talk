/// <reference types="node" />
/*!
 * Sitemap
 * Copyright(c) 2011 Eugene Kalinin
 * MIT Licensed
 */
import * as errors from './errors';
import { XMLElement } from 'xmlbuilder';
import SitemapItem from './sitemap-item';
import { ICallback, SitemapItemOptions } from './types';
import { CompressCallback } from 'zlib';
export { errors };
export * from './sitemap-index';
export declare const version = "2.2.0";
/**
 * Shortcut for `new Sitemap (...)`.
 *
 * @param   {Object}        conf
 * @param   {String}        conf.hostname
 * @param   {String|Array}  conf.urls
 * @param   {Number}        conf.cacheTime
 * @param   {String}        conf.xslUrl
 * @param   {String}        conf.xmlNs
 * @return  {Sitemap}
 */
export declare function createSitemap(conf: {
    urls?: string | Sitemap["urls"];
    hostname?: string;
    cacheTime?: number;
    xslUrl?: string;
    xmlNs?: string;
}): Sitemap;
export declare class Sitemap {
    limit: number;
    xmlNs: string;
    cacheSetTimestamp: number;
    hostname?: string;
    urls: (string | SitemapItemOptions)[];
    cacheResetPeriod: number;
    cache: string;
    xslUrl?: string;
    root: XMLElement;
    /**
     * Sitemap constructor
     * @param {String|Array}  urls
     * @param {String}        hostname    optional
     * @param {Number}        cacheTime   optional in milliseconds; 0 - cache disabled
     * @param {String}        xslUrl            optional
     * @param {String}        xmlNs            optional
     */
    constructor(urls?: string | Sitemap["urls"], hostname?: string, cacheTime?: number, xslUrl?: string, xmlNs?: string);
    /**
     *  Clear sitemap cache
     */
    clearCache(): void;
    /**
     *  Can cache be used
     */
    isCacheValid(): boolean;
    /**
     *  Fill cache
     */
    setCache(newCache: string): string;
    /**
     *  Add url to sitemap
     *  @param {String} url
     */
    add(url: string | SitemapItemOptions): number;
    /**
     *  Delete url from sitemap
     *  @param {String} url
     */
    del(url: string | SitemapItemOptions): number;
    /**
     *  Create sitemap xml
     *  @param {Function}     callback  Callback function with one argument — xml
     */
    toXML(callback?: ICallback<Error, string>): string | void;
    /**
     *  Synchronous alias for toXML()
     *  @return {String}
     */
    toString(): string;
    toGzip(callback: CompressCallback): void;
    toGzip(): Buffer;
}
export { SitemapItem };
