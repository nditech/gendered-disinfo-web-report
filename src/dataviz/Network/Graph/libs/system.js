'use strict'

export function delay (delay_in_ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2)
        }, delay_in_ms)
    })
}
