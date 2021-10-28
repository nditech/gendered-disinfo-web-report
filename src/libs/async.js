'use strict'

// store lib
import { loading } from './stores.js'

// Decorator displaying the loader during the execution of the async function
export function attachLoader (func) {
  return async function (...args) {
    // enable loader
    loading.set(true)

    // run function
    const res = await func(...args)

    // disable loader
    loading.set(false)

    return res
  }
}
