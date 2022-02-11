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


export function nFormatter(num){
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}


export function romanize (num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","c","cc","ccc","cd","d","dc","dcc","dccc","cm",
                "","x","xx","xxx","xl","l","lx","lxx","lxxx","xc",
                "","i","ii","iii","iv","v","vi","vii","viii","ix"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}


export function unidecode(str){
    // removes diacritics
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


export function clean_str(str){
    return unidecode(str).toLowerCase().trim();
}