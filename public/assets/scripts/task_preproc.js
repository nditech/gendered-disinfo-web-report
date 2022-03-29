'use strict';

// local lib
import { unzip, is_of_interest, get_max_followers, date_to_month_year, return_consensus } from './libs.js';


function preproc_posts(raw_posts){
    // after being unzipped the posts are still in a representation that minimizes the size of the data. 
    // we need remap the data structure to a format easier to work with. 

    // init array
    let posts = [];

    // unnest the posts
    Object.keys(raw_posts).forEach(source_name => {
        Object.keys(raw_posts[source_name]).forEach(year => {
            Object.keys(raw_posts[source_name][year]).forEach(month => {

                // we now have the posts published by a specific source for a specific (month, year)
                const posts_for_a_source_year_month = raw_posts[source_name][year][month];

                // go through and push to an array where each posts is an element
                posts_for_a_source_year_month.forEach(post => {

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

    // sort in ascending chronological order
    posts.sort((a, b) => new Date(a['t']) - new Date(b['t']))

    return posts;
}


function preproc_submissions(raw_submissions, posts, lexicon, dictionary, OF_INTEREST){

    // we can have multiple submissions for each post, and posts can be uniquely identified by their url
    // let's extract all unique urls
    const unique_post_urls = [...new Set(raw_submissions.map(s => s['url']))]
    
    // here we group the submissions by their post url
    let _raw_submissions = {};
    unique_post_urls.forEach(url => {
        _raw_submissions[url] = [];
    })
    raw_submissions.forEach(s => {
        _raw_submissions[s['url']].push(s);
    })

    // here we keep all the posts that are referenced in our submissions and we discard the rest
    // we use a dict data structure to easily reference them by their url
    let posts_with_submission = {};
    posts.filter(post => unique_post_urls.includes(post['l'])).forEach(post_with_submission => {
        posts_with_submission[post_with_submission['l']] = post_with_submission;
    });

    // convert lexicon to word vector
    const lexicon_wv = lexicon.map(e => dictionary[e['word']]).filter(w => w !== undefined);

    // invert the dictionary
    const dictionary_inv = {};
    Object.keys(dictionary).map(key => {
        const val = dictionary[key];
        dictionary_inv[val] = key;
    })

    // merge submissions with posts
    let merged_submissions = [];
    Object.keys(_raw_submissions).forEach(url => {

        // grab submissions & post
        const submissions = _raw_submissions[url];
        const post = posts_with_submission[url];

        // check if we have a post for this submission
        if(post === undefined || post === null) {
            console.error(`could not find post with url - ${url}`)
            return;
        }

        // some submissions state that a given post is benign, or malign. 
        // with multiple submissions for each post we want to extract the consensus
        const of_interest_consensus = return_consensus(submissions.map(s => is_of_interest(s, OF_INTEREST)));
        if (of_interest_consensus === null) return;

        // get the categories consensus
        let categories_consensus = return_consensus(submissions.map(s => s['categories'].join(',')));
        if (categories_consensus === null) return;
        categories_consensus = categories_consensus.split(',').filter(d => d.length > 0).map(d => +d);

        // set lexicon match
        let lexicon_match = new Set();
        for(let w of post['wv']){
            if(lexicon_wv.includes(w)){
                lexicon_match.add(dictionary_inv[w]);
            }
        }
        
        // create datum
        const datum = {
            'source_name': post['source_name'],
            'url': post['l'],
            'wv': post['wv'],
            'lexicon_match': [...lexicon_match], 
            'published_at': post['t'],
            'engagement': submissions[0]['engagement'],
            'categories': categories_consensus,
            'of_interest': of_interest_consensus
        };

        // push
        merged_submissions.push(datum);
    })

    // sort in ascending chronological order
    merged_submissions.sort((a, b) => new Date(a['published_at']) - new Date(b['published_at']));

    return merged_submissions;
}


function preproc_lexicon(raw_lexicon, dictionary, submissions){

    // map to word vector
    const lexicon_wv = raw_lexicon.map(el => dictionary[el]).filter(el => el !== undefined);

    // init lexicon performance
    let lexicon_performance_obj = {};
    raw_lexicon.forEach(el => {
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
    raw_lexicon.forEach(el => {
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


function preproc_categories(raw_categories, submissions, lang = 'eng'){

    // filter
    const submissions_of_interest = submissions.filter(submission => submission['of_interest']);

    // narratives
    let categories = raw_categories.map(category => {

        // filter by categories
        const nbr_of_posts = submissions_of_interest.filter(p => p['categories'].includes(+category['key'])).length;

        // title
        const category_title = category['title'][lang] !== undefined ? category['title'][lang] : category['title']['eng'];
        const category_description = category['description'][lang] !== undefined ? category['description'][lang] : category['description']['eng'];
        return {
            'key': category['key'],
            'name': category_title,
            'name_count': `${category_title}, (${nbr_of_posts} ${nbr_of_posts > 1 ? 'posts' : 'post'})`,
            'description': category_description,
            'value': nbr_of_posts
        }
    })

    // sort
    categories.sort((a, b) => b['value'] - a['value']);

    return categories;
}


function preproc_belligerents(sources, submissions, MIN_NBR_OF_PUBLICATION_OF_INTEREST = 1){
    // belligerents – sources that published posts that our annotators identified as of interest

    // only keep submissions of interest
    let submissions_of_interest = submissions.filter(submission => submission['of_interest']);

    // get belligerents
    let belligerents = [...new Set(submissions_of_interest.map(p => p['source_name']))].map(name => {
        return sources.filter(s => s['name'] === name)[0];
    }).filter(d => d !== undefined);

    // sort by following descending order
    belligerents.sort((a, b) => get_max_followers(b) - get_max_followers(a));  

    // create a map of belligerent to nbr of posts
    let belligerents_nbr_publications_of_interest_map = {};
    belligerents.forEach(belligerent => {
        belligerents_nbr_publications_of_interest_map[belligerent['name']] = submissions_of_interest.filter(s => s['source_name'] === belligerent['name']).length;
    })

    // filter by MIN_NBR_OF_PUBLICATION_OF_INTEREST
    belligerents = belligerents.filter(b => {
        return belligerents_nbr_publications_of_interest_map[b['name']] >= MIN_NBR_OF_PUBLICATION_OF_INTEREST;
    })
    submissions_of_interest = submissions_of_interest.filter(s => {
        return belligerents_nbr_publications_of_interest_map[s['source_name']] >= MIN_NBR_OF_PUBLICATION_OF_INTEREST;
    })

    return [ belligerents, submissions_of_interest]
}



function preprocess(sources, raw_posts, raw_submissions, events, raw_lexicon, dictionary, raw_categories, OF_INTEREST, MIN_NBR_OF_PUBLICATION_OF_INTEREST, lang = 'eng'){

    // ---------------------------------------------------------------------------------------------------------
    // ---------------------------------------- Basic Processing -----------------------------------------------
    // ---------------------------------------------------------------------------------------------------------

    // sources: keep the selected translation and sort in descending order using their number of followers
    sources = sources.map(source => {
        return {
            'endpoint': source['endpoint'],
            'name': source['name']['eng'],
            'description': source['description'][lang] !== undefined ? source['description'][lang] : source['description']['eng']
        }
    })
    sources.sort((a, b) => get_max_followers(b) - get_max_followers(a));

    // posts: unnest them from their low-size representation
    const posts = preproc_posts(raw_posts);

    // submissions: combine them with their referenced post and add the 'of_interest' flag
    // also add the lexicon match
    const submissions = preproc_submissions(raw_submissions, posts, raw_lexicon, dictionary, OF_INTEREST);

    // events: keep the selected translation and sort in ascending chronological order
    events = events.map(event => { 
        return {
            'id': event['id'],
            'date': event['date'],
            'title': event['title'][lang] !== undefined ? event['title'][lang] : event['title']['eng'],
            'description': event['description'][lang] !== undefined ? event['description'][lang] : event['description']['eng']
        }
    })
    events.sort((a, b) => new Date(a['date']) - new Date(b['date']));    


    // lexicon: add the performance of each lexcon based on the submissions
    const lexicon = preproc_lexicon(raw_lexicon, dictionary, submissions);

    // categories: add descriptive title and description based on the submissions
    const categories = preproc_categories(raw_categories, submissions, lang);


    // ---------------------------------------------------------------------------------------------------------
    // ------------------------------------------ Create Tables ------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------

    // lexicon table
    let lexicon_table = lexicon.map(d => [d['word']]).sort();
    lexicon_table.unshift(['Lexicon'])

    // events table
    let events_table = events.map(event => [event['date'], event['title'], event['description']])
    events_table.unshift(['Date', 'Title', 'Description'])

    // political network table
    let political_network_table = [];
    sources.forEach(source => {
        // grab data
        const { endpoint, name } = source;
        Object.keys(endpoint).forEach(platform_name => {
            const { url } = endpoint[platform_name];
            political_network_table.push([name, platform_name, url])
        })
    })
    political_network_table.unshift(['Source', 'Platform', 'Link'])


    // ---------------------------------------------------------------------------------------------------------
    // --------------------------------------- Top line statistics ---------------------------------------------
    // ---------------------------------------------------------------------------------------------------------

    // number of distinct social media pages
    const nbr_of_accounts = political_network_table.length - 1;

    // compute the date span of our posts
    const time_delta = Math.round(posts.length*0.01); // the extremums are erroneous, this is safer
    const min_date = date_to_month_year(new Date(posts[time_delta]['t']))
    const max_date = date_to_month_year(new Date(posts[posts.length-time_delta]['t']))


    // ---------------------------------------------------------------------------------------------------------
    // -------------------------------------- Get nefarious sources --------------------------------------------
    // ---------------------------------------------------------------------------------------------------------

    // belligerents
    const [belligerents, submissions_of_interest] = preproc_belligerents(sources, submissions, MIN_NBR_OF_PUBLICATION_OF_INTEREST)

    return [
        sources, posts, submissions, events, lexicon, categories,
        lexicon_table, events_table, political_network_table, 
        nbr_of_accounts, min_date, max_date, 
        belligerents, submissions_of_interest
    ]
}



addEventListener('message', async function(e) {

    // unpack data
    const { 
        sources, 
        submissions,
        lexicon,
        events,
        categories,
        dictionary, 
        posts_zipped,
        OF_INTEREST,
        MIN_NBR_OF_PUBLICATION_OF_INTEREST,
        lang
    } = e.data;

    // unzip posts
    const posts = (await unzip(posts_zipped))[0];

    // preproc
    const [
        _sources, _posts, _submissions, _events, _lexicon, _categories,
        lexicon_table, events_table, political_network_table, 
        nbr_of_accounts, min_date, max_date, 
        belligerents, submissions_of_interest
    ] = preprocess(sources, posts, submissions, events, lexicon, dictionary, categories, OF_INTEREST, MIN_NBR_OF_PUBLICATION_OF_INTEREST, lang);
    
    // bundle into a payload
    const payload = {
        'sources': _sources, 
        'posts': _posts, 
        'submissions': _submissions, 
        'lexicon': _lexicon, 
        'dictionary': dictionary,
        'events': _events, 
        'categories': _categories, 
        'lexicon_table': lexicon_table,
        'events_table': events_table,
        'political_network_table': political_network_table,
        'nbr_of_accounts': nbr_of_accounts,
        'min_date': min_date,
        'max_date': max_date,
        'belligerents': belligerents,
        'submissions_of_interest': submissions_of_interest
    }

    // return 
    postMessage(payload);

}, false);
