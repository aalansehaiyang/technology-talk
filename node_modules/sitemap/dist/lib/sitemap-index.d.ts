import { Sitemap } from './sitemap';
import { ICallback } from './types';
/**
 * Shortcut for `new SitemapIndex (...)`.
 *
 * @param   {Object}        conf
 * @param   {String|Array}  conf.urls
 * @param   {String}        conf.targetFolder
 * @param   {String}        conf.hostname
 * @param   {Number}        conf.cacheTime
 * @param   {String}        conf.sitemapName
 * @param   {Number}        conf.sitemapSize
 * @param   {String}        conf.xslUrl
 * @return  {SitemapIndex}
 */
export declare function createSitemapIndex(conf: {
    urls: SitemapIndex["urls"];
    targetFolder: SitemapIndex["targetFolder"];
    hostname?: SitemapIndex["hostname"];
    cacheTime?: SitemapIndex["cacheTime"];
    sitemapName?: SitemapIndex["sitemapName"];
    sitemapSize?: SitemapIndex["sitemapSize"];
    xslUrl?: SitemapIndex["xslUrl"];
    gzip?: boolean;
    callback?: SitemapIndex["callback"];
}): SitemapIndex;
/**
 * Builds a sitemap index from urls
 *
 * @param   {Object}    conf
 * @param   {Array}     conf.urls
 * @param   {String}    conf.xslUrl
 * @param   {String}    conf.xmlNs
 * @return  {String}    XML String of SitemapIndex
 */
export declare function buildSitemapIndex(conf: {
    urls: Sitemap["urls"];
    xslUrl?: string;
    xmlNs?: string;
    lastmodISO?: string;
    lastmodrealtime?: boolean;
    lastmod?: number | string;
}): string;
/**
 * Sitemap index (for several sitemaps)
 */
declare class SitemapIndex {
    hostname?: string;
    sitemapName: string;
    sitemapSize?: number;
    xslUrl?: string;
    sitemapId: number;
    sitemaps: string[];
    targetFolder: string;
    urls: Sitemap["urls"];
    chunks: Sitemap["urls"][];
    callback?: ICallback<Error, boolean>;
    cacheTime?: number;
    xmlNs?: string;
    /**
     * @param {String|Array}  urls
     * @param {String}        targetFolder
     * @param {String}        hostname      optional
     * @param {Number}        cacheTime     optional in milliseconds
     * @param {String}        sitemapName   optional
     * @param {Number}        sitemapSize   optional
     * @param {Number}        xslUrl                optional
     * @param {Boolean}       gzip          optional
     * @param {Function}      callback      optional
     */
    constructor(urls: Sitemap["urls"], targetFolder: string, hostname?: string, cacheTime?: number, sitemapName?: string, sitemapSize?: number, xslUrl?: string, gzip?: boolean, callback?: ICallback<Error, boolean>);
}
export {};
