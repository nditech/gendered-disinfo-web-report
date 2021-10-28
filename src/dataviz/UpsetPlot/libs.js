'use strict'

export function combination (a, min) {
    const fn = function (n, src, got, all) {
        if (n === 0) {
            if (got.length > 0) {
                all[all.length] = got
            }
            return
        }
        for (let j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all)
        }
    }
    const all = []
    for (let i = min; i < a.length; i++) {
        fn(i, a, [], all)
    }
    all.push(a)
    return all
}

export function arrayCompare (_arr1, _arr2) {
    if (
        !Array.isArray(_arr1) ||
        !Array.isArray(_arr2) ||
        _arr1.length !== _arr2.length
    ) {
        return false
    }

    // .concat() to not mutate arguments
    const arr1 = _arr1.concat().sort()
    const arr2 = _arr2.concat().sort()

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }

    return true
}

export function bin_to_keys (keys, binary_string) {
    // init returned array
    const true_keys = []

    // go through string
    for (let i = binary_string.length - 1; i >= 0; i--) {
        // grab value at position i
        const val = +binary_string[i]

        // get inverse index
        const q_index = (binary_string.length - i) - 1

        if (val === 1) {
            // grab key
            const q_key = keys.filter(key => {
                return +key.index === q_index
            })[0]

            // push key
            if (q_key) {
                true_keys.push(q_key.key)
            }
        }
    }

    return true_keys
}

export function missing_sets (sets) {
    // init returned array
    const missing_set_of_keys = []

    // get all the keys found in our sets
    let all_keys = []
    sets.map(set => set.sets).forEach(keys => {
        all_keys = all_keys.concat(keys)
    })
    all_keys = [...new Set(all_keys)]

    // generate all the combinations of the keys
    const all_combinations = combination(all_keys, 1)

    // find all the missing combinations
    all_combinations.forEach(_keys => {
        // init process var
        let found = false

        // check if we have it
        sets.forEach(set => {
            // grab keys
            const keys = set.sets

            // compare arrays
            if (arrayCompare(_keys, keys)) {
                found = true
            }
        })

        // if could not find
        if (!found) {
            missing_set_of_keys.push(_keys)
        }
    })

    return missing_set_of_keys
}


export function generateBinaryStates(n){
    // init
    let states = [];

    // Convert to decimal
    let maxDecimal = parseInt("1".repeat(n),2);

    // For every number between 0->decimal
    for(let i = 0; i <= maxDecimal; i++){
        // Convert to binary, pad with 0, and add to final results
        states.push(i.toString(2).padStart(n,'0'));
    }

    return states;
}

