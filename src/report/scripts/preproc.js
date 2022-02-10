'use strict'

// import locale lib
import { post_to_interactions } from '../../libs/socialmedia.js';


function url_to_platform_type(url){
    if (url.includes('facebook')){
        return 'facebook'
    }else if (url.includes('t.me')){
        return 'telegram'
    }else if (url.includes('twitter')){
        return 'twitter'
    }else if (url.includes('youtube')){
        return 'youtube'
    }else{
        return null;
    }
}


export function get_max_followers(belligerent){
    return Math.max(...Object.keys(belligerent['endpoint']).map(key => belligerent['endpoint'][key]['followers']))
}



export function posts_to_dotmatrix(posts){
    return posts.map(post => {

        // grab data
        const { url, source_name, categories } = post;
        const source_type = url_to_platform_type(url);

        // set interactions
        const interactions = post_to_interactions(post);

        return {
            'interactions': interactions,
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
