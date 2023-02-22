import { XMLElement } from 'xmlbuilder';
import { IVideoItem, SitemapItemOptions } from './types';
/**
 * Item in sitemap
 */
declare class SitemapItem {
    conf: SitemapItemOptions;
    loc: SitemapItemOptions["url"];
    lastmod: SitemapItemOptions["lastmod"];
    changefreq: SitemapItemOptions["changefreq"];
    priority: SitemapItemOptions["priority"];
    news?: SitemapItemOptions["news"];
    img?: SitemapItemOptions["img"];
    links?: SitemapItemOptions["links"];
    expires?: SitemapItemOptions["expires"];
    androidLink?: SitemapItemOptions["androidLink"];
    mobile?: SitemapItemOptions["mobile"];
    video?: SitemapItemOptions["video"];
    ampLink?: SitemapItemOptions["ampLink"];
    root: XMLElement;
    url: XMLElement;
    constructor(conf: SitemapItemOptions);
    /**
     *  Create sitemap xml
     *  @return {String}
     */
    toXML(): string;
    buildVideoElement(video: IVideoItem): void;
    buildXML(): XMLElement;
    /**
     *  Alias for toXML()
     *  @return {String}
     */
    toString(): string;
}
export default SitemapItem;
