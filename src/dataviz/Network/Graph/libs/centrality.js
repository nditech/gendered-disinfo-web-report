'use strict'

function normalize (dict) {
    // get max value
    let max = 0.0
    Object.keys(dict).forEach(key => {
        if (dict[key] > max) {
            max = dict[key]
        }
    })

    // divide
    Object.keys(dict).forEach(key => {
        dict[key] = dict[key] / (1.0 * max)
    })

    return dict
}

export function degree (adjacency_matrix) {
    // init dict
    const obj = {}

    // go through rows
    adjacency_matrix.forEach((row, i) => {
        obj[i] = row.reduce((a, b) => a + b, 0)
    })

    // normalize
    return normalize(obj)
}
