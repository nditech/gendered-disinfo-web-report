'use strict'

// import locale lib
import { URL_PREFIX } from './constants.json';
import { nFormatter } from './libs/locale.js';
import { url_to_platform_type } from './libs/socialmedia.js';

// ADJUST
function of_interest(submission){
    return submission['categories'].length > 0 &&
        submission['results']['harms_women'] === 'yes' &&
        submission['results']['contains_disinfo'] === 'yes';
}


export function get_max_followers(belligerent){
    return Math.max(...Object.keys(belligerent['endpoint']).map(key => belligerent['endpoint'][key]['followers']))
}


function findMostFrequent(arr) {
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


function countOccurence(arr, el){
    return arr.filter(d => {
        return d == el;
    }).length;
}


function return_consensus(values){

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

function preproc_posts(_posts){

    // decompress the posts
    let posts = [];
    Object.keys(_posts).forEach(source_name => {
        Object.keys(_posts[source_name]).forEach(year => {
            Object.keys(_posts[source_name][year]).forEach(month => {
                _posts[source_name][year][month].forEach(post => {

                    // grab data
                    let [ day, url, wv ] = post;
                    day = day >= 10 ? `${day}` : `0${day}`;
                    wv = wv.split(',').map(w => +w);

                    posts.push({
                        'source_name': source_name,
                        't': `${year}-${month}-${day}`,
                        'l': url,
                        'wv': wv
                    });
                })
            })
        })
    })

    // sort
    posts.sort((a, b) => new Date(a['t']) - new Date(b['t']))

    return posts;
}

function preproc_sources(_sources){

    // init
    let sources = _sources.map(d => {

        const elements = Object.keys(d['endpoint']).sort().map(key => {
            return `
                <a target="_blank" href="${d['endpoint'][key]['url']}"" style="margin: 8px; width: 25%">
                    <img src="${URL_PREFIX}/assets/imgs/${key}.png" width=16 height=16>
                    <p style="font-size:12px;margin:0px;padding:0px">
                        ${nFormatter(d['endpoint'][key]['followers'])}
                    </p>
                </a>
            `
        })

        const html = `<div style="display: flex; justify-content: center;">${elements.join('')}</div>`

        return {
            'name': d['name'],
            'description': d['description'],
            'endpoint': d['endpoint'],
            'src': `${URL_PREFIX}/assets/portraits/${d['name'].replaceAll(' ', '_')}.jpg`,
            'html': html
        }
    })

    // sort by following
    sources.sort((a, b) => get_max_followers(b) - get_max_followers(a));

    return sources;
}

function preproc_submissions(_submissions, posts){

    // group submissions by url
    const __submissions = {};
    _submissions.forEach(s => {
        __submissions[s['url']] = [];
    })
    _submissions.forEach(s => {
        __submissions[s['url']].push(s);
    })

    // convert posts to mapping
    let posts_mapping = {};
    posts.forEach(post => {
        posts_mapping[post['l']] = post
    })

    // merge submissions with posts
    let merged_submissions = [];
    Object.keys(__submissions).forEach(url => {

        // grab submission & post
        const submissions = __submissions[url];
        const post = posts_mapping[url];

        // check
        if(post === undefined || post === null) {
            console.error(`could not find post with url - ${url}`)
            return;
        }

        // get of interest consensus
        const of_interest_consensus = return_consensus(submissions.map(s => of_interest(s)));
        if (of_interest_consensus === null) return;

        // get the categories consensus
        let categories_consensus = return_consensus(submissions.map(s => s['categories'].join(',')));
        if (categories_consensus === null) return;

        // parse
        categories_consensus = categories_consensus.split(',').filter(d => d.length > 0).map(d => +d);

        // create datum
        const datum = {
            'source_name': post['source_name'],
            'url': post['l'],
            'wv': post['wv'],
            'published_at': post['t'],
            'engagement': submissions[0]['engagement'],
            'categories': categories_consensus,
            'of_interest': of_interest_consensus
        };

        // push
        merged_submissions.push(datum);
    })

    // sort
    merged_submissions.sort((a, b) => new Date(a['published_at']) - new Date(b['published_at']));

    return merged_submissions;
}

function preproc_lexicon(_lexicon, dictionary, submissions){

    // map to word vector
    const lexicon_wv = _lexicon.map(el => dictionary[el]).filter(el => el !== undefined);

    // init lexicon performance
    let lexicon_performance_obj = {};
    _lexicon.forEach(el => {
        lexicon_performance_obj[dictionary[el]] = {
            'word': el,
            'tp': 0,
            'fp': 0,
            'score': 0
        }
    })

    // go through results
    submissions.forEach(submission => {

        // grab data
        const of_interest = submission['of_interest'];
        const wv = submission['wv'];

        // overlap
        const lexicon_match = wv.filter(el => lexicon_wv.indexOf(el) >= 0);

        if(of_interest){
            // true positive
            lexicon_match.forEach(w => {
                lexicon_performance_obj[w]['tp'] += 1;

                // if the word creates a tp on its own, it's worth more
                lexicon_performance_obj[w]['score'] += 1.0/(1.0*lexicon_match.length);
            })
        }else{
            // false positive
            lexicon_match.forEach(w => {
                lexicon_performance_obj[w]['fp'] += 1;
                lexicon_performance_obj[w]['score'] -= 1.0;
            })
        }
    });

    // normalize score
    Object.keys(lexicon_performance_obj).map(key => {

        // grab data
        const score = lexicon_performance_obj[key]['score'];
        const tp = lexicon_performance_obj[key]['tp'];
        const fp = lexicon_performance_obj[key]['fp'];

        // the score is divided by the number of occurences (i.e. tp + fp)
        lexicon_performance_obj[key]['score'] = Math.round((1000.0*score)/(tp + fp + 0.000001))/1000.0;
    })

    // convert to list
    let lexicon_performance = Object.keys(lexicon_performance_obj).map(key => {
        return {
            'word': lexicon_performance_obj[key]['word'],
            'tp': +lexicon_performance_obj[key]['tp'],
            'fp': +lexicon_performance_obj[key]['fp'],
            'score': lexicon_performance_obj[key]['score']
        }
    });

    // add missing
    _lexicon.forEach(el => {
        if (lexicon_performance.map(d => d['word']).includes(el)) return;
        lexicon_performance.push({
            'word': el,
            'tp': 0,
            'fp': 0,
            'score': 0
        })
    })

    // sort by score and tp
    lexicon_performance.sort((a, b) => {

        // get scores, if 0 use large negative value (we want them at the end)
        const a_score = a['score'] !== 0 ? a['score'] : -999;
        const b_score = b['score'] !== 0 ? b['score'] : -999;

        if(b_score === a_score){
            if(b['tp'] > 0 || a['tp'] > 0){
                return b['tp'] - a['tp'];
            }else{
                return b['fp'] - a['fp'];
            }
        }else{
            return b_score - a_score
        }
    })


    return lexicon_performance;
}

function preproc_categories(_categories, submissions){

    // filter
    const submissions_of_interest = submissions.filter(submission => submission['of_interest']);

    // narratives
    let categories = _categories.map(category => {

        // filter by categories
        const nbr_of_posts = submissions_of_interest.filter(p => p['categories'].includes(+category['key'])).length;

        return {
            'key': category['key'],
            'name': category['title'],
            'name_count': `${category['title']}, (${nbr_of_posts} ${nbr_of_posts > 1 ? 'posts' : 'post'})`,
            'description': category['description'],
            'value': nbr_of_posts
        }
    })

    // sort
    categories.sort((a, b) => b['value'] - a['value']);

    return categories;
}

export function preproc(_sources, _posts, _submissions, _lexicon, _events, _categories, _dictionary){
    const sources = preproc_sources(_sources);
    const posts = preproc_posts(_posts);
    const submissions = preproc_submissions(_submissions, posts);
    const lexicon = preproc_lexicon(_lexicon, _dictionary, submissions);
    const categories = preproc_categories(_categories, submissions);

    // sort
    _events.sort((a, b) => new Date(a['date']) - new Date(b['date']));

    return [ sources, posts, submissions, lexicon, _events, categories, _dictionary ]
}


export function posts_to_dotmatrix(posts){
    return posts.map(post => {

        // grab data
        const { url, source_name, categories } = post;
        const source_type = url_to_platform_type(url);

        // set reactions
        let reactions = 0;
        if (['facebook', 'twitter'].includes(source_type)){
            reactions = post['engagement']['reactions'];
        }else if(['youtube', 'telegram'].includes(source_type)){
            reactions = post['engagement']['views'];
        }

        return {
            'reactions': reactions,
            'url': url,
            'source_name': source_name,
            'source_type': source_type,
            'categories': categories
        }
    })
}



export function posts_to_heatmap(posts, categories){

    // convert categories to dict
    let categories_dict = {};
    categories.forEach(category => {
        categories_dict[category['key']] = category
    })

    return JSON.parse(JSON.stringify(posts)).map(post => {
        post['categories'] = post['categories'].map(key => categories_dict[key]['name']).join(', ')
        return post;
    });
}



function compute_nodes(posts, belligerents){

    // keep all unique names
    const keys = [...new Set(belligerents.map(belligerent => belligerent['name']))];

    // grab max following
    const max_followers = get_max_followers(belligerents.sort((a, b) => get_max_followers(b) - get_max_followers(a))[0]);

    // create temporary nodes
    const _nodes = keys.map(key => {

        // grab posts
        const _posts = posts.filter(post => post['source_name'] === key);

        // grab following
        const _max_followers = get_max_followers(belligerents.filter(belligerent => belligerent['name'] === key)[0]);

        // grab categories
        const __posts = _posts.map(post => {
            return {
                'categories': post['categories'],
                'published_at': post['published_at'],
                'url': post['url'],
                'lexicon_match': post['lexicon_match']
            }
        })

        // sort posts
        __posts.sort((a, b) => new Date(a.published_at) - new Date(b.published_at))

        // compute weight
        const weight = _max_followers/(1.0*max_followers);

        return {
            'key': key,
            'weight': weight,
            'posts': __posts
        }
    })

    // sort the nodes by their weight in descending order
    _nodes.sort((a, b) => b.weight - a.weight)

    // filter by posts
    const nodes = _nodes.filter(node => node['posts'].length > 0);

    // set id
    nodes.forEach((node, i) => {
        node['id'] = i;
    })

    return nodes;
}

function compute_vertices(nodes, max_time_diff_in_days){

    // create all combinations of nodes pair
    const _potential_vertices = []
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            _potential_vertices.push({
                node_id_1: i,
                node_id_2: j
            })
        }
    }

    // init
    let vertices = [];

    // go through candidates
    _potential_vertices.forEach(vertice => {
        // grab vertice data
        const node_1_id = vertice.node_id_1
        const node_2_id = vertice.node_id_2

        // grab our nodes
        const node_1 = nodes.filter(node => node.id === node_1_id)[0]
        const node_2 = nodes.filter(node => node.id === node_2_id)[0]

        // get our nodes posts
        const node_1_posts = [...new Set([].concat.apply([], node_1['posts'].map(p => p['categories'])))];
        const node_2_posts = [...new Set([].concat.apply([], node_2['posts'].map(p => p['categories'])))];

        // check if we have an intersection of the lexicon_match attribute
        const intersection = node_1_posts.filter(x => node_2_posts.includes(x))

        // if we have no overlap, we stop
        if (intersection.length === 0) {
            return
        }

        let valid = false;
        for(let i=0 ; i<node_1['posts'].length ; i++){
            if (valid) break;
            for(let j=0 ; j<node_2['posts'].length ; j++){
                if (valid) break;

                const date_1 = new Date(node_1['posts'][i].published_at)
                const date_2 = new Date(node_2['posts'][j].published_at)

                const time_diff_in_days = Math.abs(date_1 - date_2)/(1000.0*60*60*24);
                if(time_diff_in_days < max_time_diff_in_days){
                    valid = true;
                }
            }
        }

        if(!valid) return;

        // push our temporary vertice
        vertices.push({
            'node_1_id': node_1_id,
            'node_2_id': node_2_id,
            'intersection': intersection,
            'weight': intersection.length
        });
    });

    return vertices;
}

export function posts_to_graph(posts, categories, belligerents, max_time_diff_in_days){

    // compute graph components
    const nodes = compute_nodes(posts, belligerents);
    const vertices = compute_vertices(nodes, max_time_diff_in_days);

    // convert nodes to dict
    let nodes_dict = {};
    nodes.forEach(node => {
        nodes_dict[node['id']] = node
    })

    // convert categories to dict
    let categories_dict = {};
    categories.forEach(category => {
        categories_dict[category['key']] = category
    })

    // set tooltip info
    nodes.forEach(node => {
        node['tooltip'] = `
            <h2>${node['key']}</h2>
            ${node['posts'].map(post => `<p>${post['published_at']}</p>`).join('')}
        `;
    })

    vertices.forEach(vertice => {

        // get the two nodes
        const node_1 = nodes_dict[vertice['node_1_id']];
        const node_2 = nodes_dict[vertice['node_2_id']];

        // associate a unique id to each post
        const posts_1 = node_1['posts'].map((d, i) => {
            d['id'] = `1-${i}`;
            d['source'] = node_1['key'];
            return d;
        });
        const posts_2 = node_2['posts'].map((d, i) => {
            d['id'] = `2-${i}`;
            d['source'] = node_2['key']
            return d;
        });

        // get the posts published within max_nbr_days interval
        let _posts = [];
        let _posts_keys = [];
        for(let i=0 ; i<posts_1.length ; i++){
            for(let j=0 ; j<posts_2.length ; j++){

                // get post
                const post_1 = posts_1[i];
                const post_2 = posts_2[j];

                // grab date
                const date_1 = new Date(post_1.published_at)
                const date_2 = new Date(post_2.published_at)

                const time_diff_in_days = Math.abs(date_1 - date_2)/(1000.0*60*60*24);
                if(time_diff_in_days < max_time_diff_in_days){
                    if(!_posts_keys.includes(post_1['id'])){
                        _posts_keys.push(post_1['id']);
                        _posts.push(post_1);
                    }
                    if(!_posts_keys.includes(post_2['id'])){
                        _posts_keys.push(post_2['id']);
                        _posts.push(post_2);
                    }
                }
            }
        }

        // sort posts
        _posts.sort((a, b) => new Date(a.published_at) - new Date(b.published_at))

        // set urls
        vertice['urls'] = _posts.map(post => post['url']);

        // set lexicon match, keep words that are in ALL posts
        const unique_words_1 = new Set([].concat.apply([], node_1['posts'].map(post => post.lexicon_match)))
        const unique_words_2 = new Set([].concat.apply([], node_2['posts'].map(post => post.lexicon_match)))
        vertice['lexicon_match'] = [...new Set([...unique_words_1].filter(x => unique_words_2.has(x)))]

        // set html
        vertice['tooltip'] = `
            <h2>${node_1['key']} - ${node_2['key']}</h2>
            ${_posts.map(post => `<p>${post['published_at']}: ${post['source']}</p>`).join('')}
        `;
    })

    return [nodes, vertices];
}
