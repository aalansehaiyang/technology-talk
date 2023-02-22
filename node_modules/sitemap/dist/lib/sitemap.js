"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase, semi */
/*!
 * Sitemap
 * Copyright(c) 2011 Eugene Kalinin
 * MIT Licensed
 */
const errors = __importStar(require("./errors"));
exports.errors = errors;
const xmlbuilder_1 = require("xmlbuilder");
const sitemap_item_1 = __importDefault(require("./sitemap-item"));
exports.SitemapItem = sitemap_item_1.default;
const zlib_1 = require("zlib");
// remove once we drop node 8
const whatwg_url_1 = require("whatwg-url");
__export(require("./sitemap-index"));
exports.version = '2.2.0';
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
function createSitemap(conf) {
    // cleaner diff
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new Sitemap(conf.urls, conf.hostname, conf.cacheTime, conf.xslUrl, conf.xmlNs);
}
exports.createSitemap = createSitemap;
class Sitemap {
    /**
     * Sitemap constructor
     * @param {String|Array}  urls
     * @param {String}        hostname    optional
     * @param {Number}        cacheTime   optional in milliseconds; 0 - cache disabled
     * @param {String}        xslUrl            optional
     * @param {String}        xmlNs            optional
     */
    constructor(urls, hostname, cacheTime, xslUrl, xmlNs) {
        // This limit is defined by Google. See:
        // https://sitemaps.org/protocol.php#index
        this.limit = 5000;
        this.xmlNs = '';
        this.cacheSetTimestamp = 0;
        // Base domain
        this.hostname = hostname;
        // Make copy of object
        if (urls) {
            this.urls = Array.isArray(urls) ? Array.from(urls) : [urls];
        }
        else {
            // URL list for sitemap
            this.urls = [];
        }
        // sitemap cache
        this.cacheResetPeriod = cacheTime || 0;
        this.cache = '';
        this.xslUrl = xslUrl;
        this.root = xmlbuilder_1.create('urlset', { encoding: 'UTF-8' });
        if (xmlNs) {
            this.xmlNs = xmlNs;
            const ns = this.xmlNs.split(' ');
            for (let attr of ns) {
                const [k, v] = attr.split('=');
                this.root.attribute(k, v.replace(/^['"]|['"]$/g, ''));
            }
        }
    }
    /**
     *  Clear sitemap cache
     */
    clearCache() {
        this.cache = '';
    }
    /**
     *  Can cache be used
     */
    isCacheValid() {
        let currTimestamp = Date.now();
        return !!(this.cacheResetPeriod && this.cache &&
            (this.cacheSetTimestamp + this.cacheResetPeriod) >= currTimestamp);
    }
    /**
     *  Fill cache
     */
    setCache(newCache) {
        this.cache = newCache;
        this.cacheSetTimestamp = Date.now();
        return this.cache;
    }
    /**
     *  Add url to sitemap
     *  @param {String} url
     */
    add(url) {
        return this.urls.push(url);
    }
    /**
     *  Delete url from sitemap
     *  @param {String} url
     */
    del(url) {
        const indexToRemove = [];
        let key = '';
        if (typeof url === 'string') {
            key = url;
        }
        else {
            // @ts-ignore
            key = url.url;
        }
        // find
        this.urls.forEach((elem, index) => {
            if (typeof elem === 'string') {
                if (elem === key) {
                    indexToRemove.push(index);
                }
            }
            else {
                if (elem.url === key) {
                    indexToRemove.push(index);
                }
            }
        });
        // delete
        indexToRemove.forEach((elem) => { this.urls.splice(elem, 1); });
        return indexToRemove.length;
    }
    /**
     *  Create sitemap xml
     *  @param {Function}     callback  Callback function with one argument — xml
     */
    toXML(callback) {
        if (typeof callback === 'undefined') {
            return this.toString();
        }
        process.nextTick(() => {
            try {
                callback(undefined, this.toString());
            }
            catch (err) {
                callback(err);
            }
        });
    }
    /**
     *  Synchronous alias for toXML()
     *  @return {String}
     */
    toString() {
        if (this.root.children.length) {
            this.root.children = [];
        }
        if (!this.xmlNs) {
            this.root.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
            this.root.att('xmlns:news', 'http://www.google.com/schemas/sitemap-news/0.9');
            this.root.att('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
            this.root.att('xmlns:mobile', 'http://www.google.com/schemas/sitemap-mobile/1.0');
            this.root.att('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1');
            this.root.att('xmlns:video', 'http://www.google.com/schemas/sitemap-video/1.1');
        }
        if (this.xslUrl) {
            this.root.instructionBefore('xml-stylesheet', `type="text/xsl" href="${this.xslUrl}"`);
        }
        if (this.isCacheValid()) {
            return this.cache;
        }
        // TODO: if size > limit: create sitemapindex
        this.urls.forEach((elem, index) => {
            // SitemapItem
            // create object with url property
            let smi = (typeof elem === 'string') ? { 'url': elem, root: this.root } : Object.assign({ root: this.root }, elem);
            // insert domain name
            if (this.hostname) {
                smi.url = (new whatwg_url_1.URL(smi.url, this.hostname)).toString();
                if (smi.img) {
                    if (typeof smi.img === 'string') {
                        // string -> array of objects
                        smi.img = [{ url: smi.img }];
                    }
                    else if (!Array.isArray(smi.img)) {
                        // object -> array of objects
                        smi.img = [smi.img];
                    }
                    // prepend hostname to all image urls
                    smi.img.forEach((img) => {
                        if (typeof img === 'string') {
                            img = { url: img };
                        }
                        img.url = (new whatwg_url_1.URL(img.url, this.hostname)).toString();
                    });
                }
                if (smi.links) {
                    smi.links.forEach((link) => {
                        link.url = (new whatwg_url_1.URL(link.url, this.hostname)).toString();
                    });
                }
            }
            else {
                smi.url = (new whatwg_url_1.URL(smi.url)).toString();
            }
            const sitemapItem = new sitemap_item_1.default(smi);
            sitemapItem.buildXML();
        });
        return this.setCache(this.root.end());
    }
    toGzip(callback) {
        if (typeof callback === 'function') {
            zlib_1.gzip(this.toString(), callback);
        }
        else {
            return zlib_1.gzipSync(this.toString());
        }
    }
}
exports.Sitemap = Sitemap;
//# sourceMappingURL=sitemap.js.map