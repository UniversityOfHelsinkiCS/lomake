/* eslint-disable */
import fs from 'fs/promises'
import readline from 'readline'
import path from 'path'
import minimist from 'minimist'
import merge from 'lodash/merge.js'

const args = minimist(process.argv.slice(2))

/**
 * Console colors
 */
const Reset = '\x1b[0m'
const Bright = '\x1b[1m'
const Dim = '\x1b[2m'
const Underscore = '\x1b[4m'
const Blink = '\x1b[5m'
const Reverse = '\x1b[7m'
const Hidden = '\x1b[8m'
const FgBlack = '\x1b[30m'
const FgRed = '\x1b[31m'
const FgGreen = '\x1b[32m'
const FgYellow = '\x1b[33m'
const FgBlue = '\x1b[34m'
const FgMagenta = '\x1b[35m'
const FgCyan = '\x1b[36m'
const FgWhite = '\x1b[37m'
const BgBlack = '\x1b[40m'
const BgRed = '\x1b[41m'
const BgGreen = '\x1b[42m'
const BgYellow = '\x1b[43m'
const BgBlue = '\x1b[44m'
const BgMagenta = '\x1b[45m'
const BgCyan = '\x1b[46m'
const BgWhite = '\x1b[47m'

/**
 * Paths and regexs
 */
const ROOT_PATH = './client'
const LOCALES_DIR_NAME = 'locales'
const LOCALES_PATH = './client/util/locales'
const TRANSLATION_EXTENSION = 'js'
const EXTENSION_MATCHER = /.+\.js/
// matches 'asd:asd'
const TRANSLATION_KEY_REFERENCE_MATCHER = new RegExp(/['"`]\w+(?::\w+)+['"`]/, 'g')
// matches t('asd'
const TRANSLATION_KEY_REFERENCE_MATCHER_2 = new RegExp(/\bt\(['"`]\w+(?::\w+)*['"`]/, 'g')
const DEFAULT_NAMESPACE = 'common'
const LANGUAGES = ['fi', 'se', 'en']
const NAMESPACE = 'translation'
const IGNOREFILE_PATH = path.join('scripts', '.translationignore')

/**
 * Imports a translation object from an ES module file.
 * This function uses `eval` to parse the file, which is generally unsafe.
 * @param {string} f - The file path to the translation module.
 * @returns {Promise<Object>} The imported translation object.
 */
const importTranslationObjectFromESModule = async f => {
  const content = await fs.readFile(f, 'utf8')
  const jsLines = ['"use strict";({']
  let objectStarted = false
  for (const line of content.split('\n')) {
    if (objectStarted) {
      jsLines.push(line)
    }
    if (line.startsWith('export default')) {
      objectStarted = true
    }
  }
  jsLines.push(')')

  const js = jsLines.join('\n')
  return eval?.(js)
}

const log0 = (...msg) => {
  if (!args.quiet) {
    console.log(...msg)
  }
}

const log = (...msg) => {
  console.log(...msg)
}

/**
 * Main execution block
 */
;(async () => {
  if (args.help) {
    printHelp()
    return
  }

  const argLangs = args.lang ? args.lang.split(',') : LANGUAGES

  const translationIgnores = await readTranslationIgnoreFile()

  const translationKeyReferences = new Map()
  let fileCount = 0
  log0(`Analyzing ${ROOT_PATH}...`)

  // Walk through the directory structure and analyze files
  for await (const file of walk(ROOT_PATH)) {
    fileCount += 1
    const contents = await fs.readFile(file, 'utf8')
    let lineNumber = 1
    for (const line of contents.split('\n')) {
      // Match translation keys using regex and store their locations
      ;[...line.matchAll(TRANSLATION_KEY_REFERENCE_MATCHER)]
        .concat([...line.matchAll(TRANSLATION_KEY_REFERENCE_MATCHER_2)])
        .flat()
        .forEach(match => {
          const t = match.startsWith('t')
          const common = !match.includes(':')
          const location = new Location(file, lineNumber)
          const reference = `${common ? 'common:' : ''}${match.slice(t ? 3 : 1, match.length - 1)}`

          if (translationIgnores.has(reference)) {
            return
          }

          if (translationKeyReferences.has(reference)) {
            translationKeyReferences.get(reference).push(location)
          } else {
            translationKeyReferences.set(reference, [location])
          }
        })

      lineNumber += 1
    }
  }
  log0(`Found ${translationKeyReferences.size} references in ${fileCount} files`)

  const locales = {}

  // Load translation files for each language
  for await (const lang of LANGUAGES) {
    const filePath = path.join(LOCALES_PATH, `${lang}.${TRANSLATION_EXTENSION}`)
    locales[lang] = await importTranslationObjectFromESModule(filePath)
  }
  log0('Imported translation modules')

  const translationsNotUsed = new Set()

  /**
   * Recursively finds all keys in a nested object.
   * @param {Object} obj - The object to traverse.
   * @param {string} path - The current path in the object.
   * @returns {string[]} An array of keys found in the object.
   */
  const findKeysRecursively = (obj, path) => {
    const keys = []
    Object.keys(obj).forEach(k => {
      if (typeof obj[k] === 'object') {
        keys.push(...findKeysRecursively(obj[k], `${path}:${k}`)) // Go deeper...
      } else if (typeof obj[k] === 'string' && obj[k].trim().length > 0) {
        keys.push(`${path}:${k}`) // Key seems legit
      }
    })
    return keys
  }

  // Collect all translation keys from the loaded locales
  Object.entries(locales).forEach(([_, t]) => {
    findKeysRecursively(t, '').forEach(k => translationsNotUsed.add(k.slice(1)))
  })

  const numberOfTranslations = translationsNotUsed.size
  log0('Generated translation keys\n')
  log0(`${Underscore}Listing references with missing translations${Reset}\n`)

  let longestKey = 0
  translationKeyReferences.forEach((v, k) => {
    if (k.length > longestKey) longestKey = k.length
  })

  let missingCount = 0
  const missingByLang = Object.fromEntries(argLangs.map(l => [l, []]))

  // Check for missing translations
  translationKeyReferences.forEach((v, k) => {
    const missing = []
    const parts = k.split(':')

    Object.entries(locales).forEach(([lang, t]) => {
      let obj = t
      for (const p of parts) {
        obj = obj[p]
        if (!obj) break
      }
      if (typeof obj !== 'string') {
        missing.push(lang)
      } else {
        translationsNotUsed.delete(k)
      }
    })

    if (missing.length > 0 && missing.some(l => argLangs.includes(l))) {
      missingCount += printMissing(k, v, missing, longestKey)
      missing.forEach(l => argLangs.includes(l) && missingByLang[l].push(k))
    }
  })

  if (missingCount > 0) {
    log(`\n${FgRed}${Bright}Error:${Reset} ${missingCount} translations missing\n`)
    log(`For false positives, add key to ${FgCyan}${IGNOREFILE_PATH}${Reset}\n`)
  } else {
    log(`${FgGreen}${Bright}Success:${Reset} All translations found\n`)
  }

  if (args.unused) {
    printUnused(translationsNotUsed, numberOfTranslations)
  }

  if (missingCount > 0) {
    process.exit(1)
  } else {
    process.exit(0)
  }
})()

/**
 * Prints missing translations for a given key.
 * @param {string} translationKey - The translation key.
 * @param {Location[]} referenceLocations - Locations where the key is referenced.
 * @param {string[]} missingLangs - Languages missing the translation.
 * @param {number} longestKey - The length of the longest key for padding.
 * @returns {number} The number of missing languages.
 */
const printMissing = (translationKey, referenceLocations, missingLangs, longestKey) => {
  let msg = translationKey
  // Add padding
  for (let i = 0; i < longestKey - translationKey.length; i++) {
    msg += ' '
  }

  msg += ['fi', 'en', 'se']
    .map(l => (missingLangs.includes(l) ? `${FgRed}${l}${Reset}` : `${FgGreen}${l}${Reset}`))
    .join(', ')

  if (args.detailed) {
    msg += `\n${FgCyan}${referenceLocations.join('\n')}\n`
  }

  console.log(msg, Reset)

  return missingLangs.length
}

/**
 * Prints potentially unused translations.
 * @param {Set<string>} translationsNotUsed - Set of unused translation keys.
 * @param {number} numberOfTranslations - Total number of translations.
 */
const printUnused = (translationsNotUsed, numberOfTranslations) => {
  console.log(
    `${Underscore}Potentially unused translations (${translationsNotUsed.size}/${numberOfTranslations}): ${Reset}`
  )
  console.log(`${FgMagenta}please check if they are used before deleting${Reset}`)
  translationsNotUsed.forEach(t => console.log(`  ${t.split(':').join(`${FgMagenta}:${Reset}`)}`))
}

/**
 * Prints help information for the script.
 */
function printHelp() {
  console.log('Usage:')
  console.log('--lang fi,se,en')
  console.log('--unused: print all potentially unused translation fields')
  console.log('--detailed: Show usage locations')
  console.log('--quiet: Print less stuff')
}

/**
 * Recursively walks through a directory and yields file paths.
 * @param {string} dir - The directory to walk.
 * @returns {AsyncGenerator<string>} An async generator yielding file paths.
 */
async function* walk(dir) {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isDirectory() && d.name !== LOCALES_DIR_NAME) yield* walk(entry)
    else if (d.isFile() && EXTENSION_MATCHER.test(d.name)) yield entry
  }
}

/**
 * Represents a line location in a file.
 */
class Location {
  constructor(file, line) {
    this.file = file
    this.line = line
  }

  toString() {
    return `${this.file}:${this.line}`
  }
}

/**
 * Reads the .translationignore file and returns a set of ignored translation keys.
 * Lines starting with # are treated as comments and ignored.
 * @returns {Promise<Set<string>>} A set of translation keys to ignore.
 */
async function readTranslationIgnoreFile() {
  try {
    const content = await fs.readFile(IGNOREFILE_PATH, 'utf8')
    const ignoredKeys = new Set(
      content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'))
    )
    log0(`Number of ignored keys in ${IGNOREFILE_PATH}: ${ignoredKeys.size}`)
    return ignoredKeys
  } catch (err) {
    if (err.code === 'ENOENT') {
      log0('No .translationignore file found, proceeding without ignored keys.')
      return new Set()
    }
    throw err
  }
}
