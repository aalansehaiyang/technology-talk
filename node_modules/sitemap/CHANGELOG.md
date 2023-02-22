# 3.2.2
  - revert https everywhere added in 3.2.0. xmlns is not url.
  - adds alias for lastmod in the form of lastmodiso
  - fixes bug in lastmod option for buildSitemapIndex where option would be overwritten if a lastmod option was provided with a single url
  - fixes #201, fixes #203
# 3.2.1
  - no really fixes ts errors for real this time
  - fixes #193 in PR #198
# 3.2.0
  - fixes #192, fixes #193 typescript errors
  - correct types on player:loc and restriction:relationship types
  - use https urls in xmlns
# 3.1.0
 - fixes #187, #188 typescript errors
 - adds support for full precision priority #176
# 3.0.0
 - Converted project to typescript
 - properly encode URLs #179
 - updated core dependency
## breaking changes
 This will likely not break anyone's code but we're bumping to be safe
 - root domain URLs are now suffixed with / (eg. https://www.ya.ru -> https://www.ya.ru/) This is a side-effect of properly encoding passed in URLs

