/* eslint-disable @typescript-eslint/no-var-requires */
const container = require('markdown-it-container');
const { logger, ensureLeadingSlash } = require('@vuepress/shared-utils');
/**
 * helper function to transform string to RenderPlaceFunction
 *
 * @param func
 */
function wrapRenderPlaceFunction(func) {
    if (typeof func === 'string') {
        return () => func;
    }
    return func;
}
const ContainerPlugin = ({ validate, marker, render, type, before, after, defaultTitle = type.toUpperCase(), }) => {
    const options = {
        name: 'vuepress-plugin-container',
        multiple: true,
    };
    if (!type) {
        logger.warn(`[${options.name}]`, `'type' option is required`);
        return options;
    }
    if (!render) {
        // ===============================
        // resolve render place functions
        // ===============================
        let renderBefore;
        let renderAfter;
        if (before !== undefined && after !== undefined) {
            // user defined
            renderBefore = wrapRenderPlaceFunction(before);
            renderAfter = wrapRenderPlaceFunction(after);
        }
        else {
            // fallback default
            renderBefore = (info) => `<div class="custom-block ${type}">${info ? `<p class="custom-block-title">${info}</p>` : ''}\n`;
            renderAfter = () => '</div>\n';
        }
        // token info stack
        const infoStack = [];
        render = (tokens, index, opts, env) => {
            const token = tokens[index];
            if (token.nesting === 1) {
                // `before` tag
                // resolve info (title)
                let info = token.info.trim().slice(type.length).trim();
                if (!info && defaultTitle) {
                    if (typeof defaultTitle === 'string') {
                        // const
                        info = defaultTitle;
                    }
                    else if (typeof defaultTitle === 'object') {
                        // locale
                        let { relativePath = '' } = env;
                        relativePath = ensureLeadingSlash(relativePath);
                        const locale = Object.keys(defaultTitle)
                            .filter((locale) => locale !== '/')
                            .find((locale) => relativePath.startsWith(locale));
                        if (locale) {
                            info = defaultTitle[locale];
                        }
                        else {
                            info = defaultTitle['/'] || '';
                        }
                    }
                }
                // push the info to stack
                infoStack.push(info);
                // render
                return renderBefore(info);
            }
            else {
                // `after` tag
                // pop the info from stack
                const info = infoStack.pop() || '';
                // render
                return renderAfter(info);
            }
        };
    }
    options.extendMarkdown = (md) => {
        md.use(container, type, { render, validate, marker });
    };
    return options;
};
module.exports = ContainerPlugin;
//# sourceMappingURL=index.js.map