#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const esm = require('esm')
const { existsSync } = require('fs')
const { resolve } = require('path')
const pkg = require('./package.json')
const make = require('.')

program
  .version(pkg.version)
  .option('-H, --hostname <hostname>', 'website hostname')
  .option(
    '-F, --changefreq [daily|weekly|monthly]',
    'page change frequency, defaults to daily'
  )
  .option('-c, --cache-time [n]', 'cache time in second', parseInt)
  .option('-u, --urls [urls]', 'list of urls to be merged', (val) =>
    val.split(',')
  )
  .option('-d, --dest [dest]', 'vuepress dest dir, defaults to process.cwd', process.cwd())
  .option('-t, --temp [temp]', 'vuepress temporary dir')
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp(chalk.green)
  process.exit()
}

try {
  let tempDir = program.temp || ''
  if (!tempDir) {
    const legacyTempDir = resolve('node_modules/vuepress/lib/app/.temp')
    tempDir = existsSync(legacyTempDir)
      ? legacyTempDir
      : resolve('node_modules/@vuepress/core/.temp/internal')
  } else {
    const stableDir = resolve(tempDir, 'internal')
    tempDir = existsSync(stableDir) ? stableDir : resolve(tempDir)
  }

  const siteDataFile = resolve(tempDir, 'siteData.js')

  if (!existsSync(siteDataFile)) {
    throw new Error('Can\'t find siteData on temp dir, please build first or supply temp dir manually')
  }

  const requires = esm(module)
  const { siteData } = requires(siteDataFile)

  make(program, siteData).generated()
} catch (error) {
  console.error(chalk.bold.red(error.message || error.msg || error))
  process.exit(1)
}
