'use strict'

// import libs
import { writable } from 'svelte/store'

// properties
export const store = writable({})
export const loading = writable(false)

// grab specific keys
export function returnStoreValues (desired_keys) {
  // init dataframe
  const df = {}

  // grab all the values from the store
  Object.keys(store).forEach(key => {
    if (desired_keys.includes(key)) {
      df[key] = store[key]
    }
  })

  return df
}

// clear store
export function clearStoreValues () {
  Object.keys(store).forEach(key => {
    delete store[key]
  })
}
