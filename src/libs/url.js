'use strict'

/**
 * Loads the language key from the URL
 */
export function loadLangFromURL () {
  // get url parameters
  const params = getUrlParams()

  // if language not specified, return english
  if (typeof params.lang !== 'string') {
    return null
  }

  return params.lang
}

/**
 * Returns all the params in the current URL
 *
 * ie. /index.html?foo=34&bob=35
 *
 * returns {foo: 34, bob: 35}
 *
 */
export function getUrlParams () {
  // init array
  const params = {}

  // grab current url
  const url = window.location.href
  let url_split = url.split('?')

  // if no params
  if (url_split.length !== 2) {
    return params
  }

  // grab the right end
  url_split = url_split[1]

  // split all
  url_split = url_split.split('&')

  // go through
  url_split.forEach(param => {
    // check if contains '='
    if (!param.includes('=')) {
      return
    }

    const vals = param.split('=')
    if (vals.length !== 2) {
      return
    }

    params[vals[0]] = vals[1]
  })

  return params
}
