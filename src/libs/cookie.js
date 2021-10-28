'use strict'

// locale lib
import { validateLanguageKey } from './locale.js'

/**
 * Saves an arbitrary cookie
 *
 * @param cname     The saved name of the cookie
 * @param cvalue    The saved value of the cookie
 * @param exdays    The number of days that the cookie should be saved in the cache
 */
export function setCookie (cname, cvalue, exdays) {
  const d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

/**
 * Get a saved cookie using it's name
 *
 * @param cname     The saved name of the cookie
 */
export function getCookie (cname) {
  const name = cname + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }

    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

/**
 * Deletes all the stored cookies
 */
export function deleteCookies () {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

/**
 * Deletes a stored cookies
 */
export function deleteCookie (cname) {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    if (name === cname) {
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      return true
    }
  }

  return false
}

export function getLangFromCookie () {
  // grab lang cookie
  const lang = getCookie('lang')

  // if specified language is not supported, return english
  if (!validateLanguageKey(lang)) {
    return null
  }

  return lang
}
