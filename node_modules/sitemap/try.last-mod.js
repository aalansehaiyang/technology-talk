
'use strict'

//const sm = require('./index')
const sm = require('./index')
const url = 'http://ya.ru/view?widget=3&count>2'
const smi = new sm.SitemapItem({
        url: 'http://www.example.org/business/article55.html',
        news: {
          publication: {
            name: 'The Example Times',
            language: 'en'
          },
          genres: 'PressRelease, Blog',
          publication_date: '2008-12-23',
          title: 'Companies A, B in Merger Talks',
          keywords: 'business, merger, acquisition, A, B',
          stock_tickers: 'NASDAQ:A, NASDAQ:B'
        }
})
console.log(smi.toString())
