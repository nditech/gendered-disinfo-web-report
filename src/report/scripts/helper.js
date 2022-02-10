'use strict';

// load constants
import { SUBDIRECTORY } from '../../constants.json';

// load libs
import { request_GET, getRequestWrapper } from '../../libs/http.js';


export async function load_tools(project_select){

    const promises = []
    promises.push(request_GET(`${SUBDIRECTORY}assets/data/${project_select}/sources.json`))
    promises.push(request_GET(`${SUBDIRECTORY}assets/data/${project_select}/lexicon.json`))
    promises.push(request_GET(`${SUBDIRECTORY}assets/data/${project_select}/events.json`))

    // load
    const results = await Promise.all(promises);

    // check
    if(results === null || !Array.isArray(results) || results.length === 0){
        return null;
    }

    return results;        
}

export async function load_findings(project_select){

    const promises = []
    promises.push(request_GET(`${SUBDIRECTORY}assets/data/${project_select}/submissions.json`))
    promises.push(request_GET(`${SUBDIRECTORY}assets/data/${project_select}/dictionary.json`))
    promises.push(request_GET(`${SUBDIRECTORY}assets/data/${project_select}/categories.json`))

    // load
    const results = await Promise.all(promises);

    // check
    if(results === null || !Array.isArray(results) || results.length === 0){
        return null;
    }

    return results;  
}

export async function load_posts_zip(project_select){

    // get zipped posts
    const posts_zip = await getRequestWrapper(`${SUBDIRECTORY}assets/data/${project_select}/posts.json.zip`, 'eng', 'blob')
    if (posts_zip === null) return null;

    return posts_zip;
}


export async function load_params(project_select){
    return await getRequestWrapper(`${SUBDIRECTORY}assets/data/${project_select}/params.json`, 'eng');
}


// concat two arrays
export function interleave([ x, ...xs ], ys = []){
    return x === undefined ? ys : [ x, ...interleave (ys, xs) ]
}
