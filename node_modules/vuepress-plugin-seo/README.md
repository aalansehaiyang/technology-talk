# Vuepress Plugin SEO
🔌 Generate SEO friendly meta header for every page

## Installation

```bash
npm i vuepress-plugin-seo -D
```

## Usage

```js
plugins: {
    'seo': { /* options */ }
},
```

Note that Vuepress allows multiple syntaxes to register plugins. See [Vuepress documentation on how to use a plugin](https://vuepress.vuejs.org/plugin/using-a-plugin.html) for more information.

## Options

The default options below show you how the relevant data is being retrieved from your vuepress application and its pages. Simply override the function of your choice to define your own logic.

```js
// Options
{
    siteTitle: (_, $site) => $site.title,
    title: $page => $page.title,
    description: $page => $page.frontmatter.description,
    author: (_, $site) => $site.themeConfig.author,
    tags: $page => $page.frontmatter.tags,
    twitterCard: _ => 'summary_large_image',
    type: $page => ['articles', 'posts', 'blog'].some(folder => $page.regularPath.startsWith('/' + folder)) ? 'article' : 'website',
    url: (_, $site, path) => ($site.themeConfig.domain || '') + path,
    image: ($page, $site) => $page.frontmatter.image && (($site.themeConfig.domain && !$page.frontmatter.image.startsWith('http') || '') + $page.frontmatter.image),
    publishedAt: $page => $page.frontmatter.date && new Date($page.frontmatter.date),
    modifiedAt: $page => $page.lastUpdated && new Date($page.lastUpdated),
}
```

A few things to note:

* Each of those functions take three agurments: `$page` (page configs provided by Vuepress), `$site` (site configs provided by Vuepress) and `path` (the built permalink of the page which is different than `$page.path` in the plugin world).
* If the return value of any of these options is null or undefined, it will not add the metadata. This avoids having lots of empty meta header in your pages.
* The `author` option should be an object with any of the following values: `name` (the full name of the author) and `twitter` (the Twitter handle of the author, e.g. `@lorismatic`).
* The `tags` option should be an array.
* The `type` should be part of the [Open Graph protocol](http://ogp.me/#types). E.g. `article`, `profile`, `book`, `website`.
* Both the `url` and `image` options try to use the `$site.themeConfig.domain` variable as a prefix. If it's not available, it will still work but the links of your meta headers will be relative and not absolute.
* When defining the `image` attribute in your frontmatter, you should make sure that its path is already resolved. That means, either storing your SEO images in the `public` folder or simply copy/pasting the path of a resolved image from the browser, e.g. `/assets/img/my_image.8b54ab32.jpg`. You cannot use for example `image: ./my_image.jpg` to reference the image in the current folder. We cannot resolve this path for you at this time because [vuepress does not support asset resolution in frontmatter](https://github.com/vuejs/vuepress/issues/79).
* It can be wise to include a timezone when defining `publishedAt` in your frontmatter. E.g. `date: 2018-06-07 23:46 UTC`.
* The `modifiedAt` default value will work out-of-the-box if you registers the `@vuepress/last-updated` plugin **before** this one.

Finally you can also add your own custom meta headers through the `customMeta` option:

```js
// Options
{
    //...
    customMeta: (add, context) => {

        const {
            $site, // Site configs provided by Vuepress
            $page, // Page configs provided by Vuepress

            // All the computed options from above:
            siteTitle, title, description, author, tags,
            twitterCard, type, url, image, publishedAt, modifiedAt,
        } = context

        add('twitter:site', $site.themeConfig.twitter)
        // -> <meta name="twitter:site" content="@github"></meta>

        add('book:isbn', '9780091929114', 'property')
        // -> <meta property="book:isbn" content="9780091929114"></meta>
    },
}
```

Note that `customMeta` defaults to `() => {}`.
