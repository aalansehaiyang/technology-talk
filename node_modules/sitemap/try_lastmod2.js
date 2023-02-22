
'use strict'

//const sm = require('./index')
const sm = require('./index')
const smi = sm.buildSitemapIndex({
    urls: [{ url: 'https://www.example.com', lastmod: '2011-06-06' }]
  });
console.log(smi.toString())
