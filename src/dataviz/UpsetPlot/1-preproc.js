'use strict';

// func lib
import { bin_to_keys, missing_sets } from './libs.js';


export function preproc(data, keys_dict){

    // init
    let sets = [];

    // go through binary answers counts
    data.forEach(d => {

        // grab data
        const binary_answer = d['binary_answer'];
        const count = +d['count'];

        // clean binary
        const cleaned_binary = binary_answer.substring(binary_answer.length-keys_dict.length)

        // convert answer to keys
        const keys = bin_to_keys(keys_dict, cleaned_binary);

        // push
        sets.push({
            'sets': keys,
            'size': count,
            'binary': cleaned_binary
        })
    })

    // if we have data
    if(sets.length === 0){
        return null;
    }

    // remove any empty sets with nothing
    sets = sets.filter(set => {
        return set['sets'].length > 0
    })

    // if we have data
    if(sets.length === 0){
        return null;
    }


    return sets;
}


export function removeSetByKey(sets, keys_dict, key){

    // get the index of the keys dict
    const key_index = keys_dict.length - (+keys_dict.filter(d => d['key'] === key)[0]['index'] + 1);

    // init
    let new_sets = [];
    sets.forEach(d => {

        // filter keys
        const filtered = d['sets'].filter(set => set !== key);
        if(filtered.length === 0) return;

        // update binary
        let binary = d['binary'].split('');
        binary[key_index] = '0';
        binary = binary.join('')

        new_sets.push({
            'sets': filtered,
            'size': d['size'],
            'binary': binary
        })
    })

    // merge identical sets
    let merged_sets = {};
    new_sets.forEach(d => {
        merged_sets[d['binary']] = {
            'size': 0,
            'sets': d['sets']
        }
    })
    new_sets.forEach(d => {
        merged_sets[d['binary']]['size'] += d['size']
    })

    // convert back to list
    let final_set = [];
    Object.keys(merged_sets).forEach(binary => {
        final_set.push({
            'binary': binary,
            'size': merged_sets[binary]['size'],
            'sets': merged_sets[binary]['sets']
        })
    })

    return final_set;
}


export function appendMissingSets(sets){

    // add all missing set of keys with a count of 0
    missing_sets(sets).forEach(keys => {
        sets.push({
            'sets': keys,
            'size': 0
        });
    })

    return sets;
}
