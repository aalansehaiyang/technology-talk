
'use strict'

//const sm = require('./index')
const sm = require('./index')
const url = 'http://ya.ru/view?widget=3&count>2'
const smi = new sm.SitemapItem({
        url: 'http://www.example.org/business/article55.html',
        lastmod: '2011-06-27'
})
console.log(smi.toString())
