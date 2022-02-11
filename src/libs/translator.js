'use strict'

// load strings from json file
import * as strings from '../strings.json'

// load supported languages from json file
import { SUPPORTED_LANGUAGES } from '../config.json'

/**
 * Returns true if the language key is supported
 */
export function validateLanguageKey (lang) {
    if (lang === undefined || lang === null || typeof lang !== 'string' || lang === '') {
        return false
    }
    return SUPPORTED_LANGUAGES.map(l => l.key).includes(lang)
}

/**
 * Returns the string in the provided language
 */
export function getString (lang, key) {
    // if language key is invalid, return error
    if (!validateLanguageKey(lang)) {
        console.error(`the '${lang}' language is not supported`)
        return 'error'
    }

    // check if exists in the json file
    if (strings[key] === undefined) {
        console.error(`'${key}' does not exist in strings`)
        return 'error'
    } else if (strings[key][lang] === undefined) {
        console.error(`'${key}' in the '${lang}' language does not exist in strings`)
        return 'error'
    }

    return strings[key][lang]
}
