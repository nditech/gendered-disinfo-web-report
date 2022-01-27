'use strict';

// unzip lib
import { unzipSync, strFromU8 } from 'https://cdn.skypack.dev/fflate?min';


export function date_to_month_year(date){

    // months
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let month = monthNames[(date.getMonth() + 1) - 1];   // JavaScript months are 0-based.
    let year = String(date.getFullYear());

    return `${month}, ${year}`;
}


export function findMostFrequent(arr) {
    return arr
    .reduce((acc, cur, ind, arr) => {
        if (arr.indexOf(cur) === ind) {
        return [...acc, [cur, 1]];
        } else {
        acc[acc.indexOf(acc.find(e => e[0] === cur))] = [
            cur,
            acc[acc.indexOf(acc.find(e => e[0] === cur))][1] + 1
        ];
        return acc;
        }
    }, [])
    .sort((a, b) => b[1] - a[1])
    .filter((cur, ind, arr) => cur[1] === arr[0][1])
    .map(cur => cur[0]);
}


export function countOccurence(arr, el){
    return arr.filter(d => {
        return d == el;
    }).length;
}


export function return_consensus(values){

    if(values === undefined || values === null || !Array.isArray(values) || values.length == 0){
        return null;

    }else if(values.length == 1){
        return values[0];

    }else if(values.length == 2){
        return (values[0] == values[1]) ? values[0] : null;

    }else if(values.length % 2 == 0){

        // get most frequent element
        const most_frequent = findMostFrequent(values);

        // count number is arr
        const nbr_of_occu = countOccurence(values, most_frequent);

        if(nbr_of_occu >= values/2.0){
            return most_frequent;
        }else{
            return null;
        }

    }else if(values.length % 2 == 1){

        // get most frequent element
        const most_frequent = findMostFrequent(values);

        // count number is arr
        const nbr_of_occu = countOccurence(values, most_frequent);

        if(nbr_of_occu > values/2.0){
            return most_frequent;
        }else{
            return null;
        }
    }

    return null;
}


export function get_max_followers(source){
    return Math.max(...Object.keys(source['endpoint']).map(key => +source['endpoint'][key]['followers']))
}


export async function unzip(blob){

    // data as buffer
    const buff = await blob.arrayBuffer();

    // as uint
    const uint_buff = new Uint8Array(buff);

    // unzip
    const unzipped = unzipSync(uint_buff);

    // grab
    const content = Object.values(unzipped).map(uint8arr => {
        return JSON.parse(strFromU8(uint8arr));
    })

    return content;
}


export function is_of_interest(submission, CONDITIONS_FOR_POSTS_OF_INTEREST){

    // grab data
    const results = submission.results

    // check conditions
    let conditions_satisfied = false
    CONDITIONS_FOR_POSTS_OF_INTEREST.forEach(or_conditions => {

        // according to AND
        let _conditions_satisfied = true
        or_conditions.forEach(and_condition => {
            if (!(and_condition.key in results) || results[and_condition.key] !== and_condition.value) {
                _conditions_satisfied = false
            }
        })

        // according to OR
        if (_conditions_satisfied) {
            conditions_satisfied = true
        }
    })

    return conditions_satisfied
}