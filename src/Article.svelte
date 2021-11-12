<script>

    // properties
    export let lang;

    // components
    import Loader from './components/Loader.svelte';

    // background
    import Background from './Background.svelte';

    // import sections
    import Introduction from './sections/1-Introduction.svelte';
    import GenderedDisinfo from './sections/2-GenderedDisinfo.svelte';
    import Methods from './sections/3-Methods.svelte';
    import CaseStudies from './sections/4-CaseStudies.svelte';
    import Discussion from './sections/5-Discussion.svelte';
    import Conclusion from './sections/6-Conclusion.svelte';

    // import libs
    import { onMount } from 'svelte';
    import { getString } from './libs/locale.js';
    import { preproc } from './preproc.js';
    import { request_GET, getRequestWrapper } from './libs/http.js';
    import { unzip } from './libs/unzip.js';

    // check if on mobile
    import { isMobile } from './libs/system.js';
    const _isMobile = isMobile();

    // load constants from json file
    import { URL_PREFIX } from './constants.json';

    // process vars
    let brazil_sources, brazil_submissions, brazil_lexicon, brazil_events, brazil_categories, brazil_dictionary;
    let brazil_params;
    let brazil_posts;

    let lebanon_sources, lebanon_submissions, lebanon_lexicon, lebanon_events, lebanon_categories, lebanon_dictionary;
    let lebanon_params;
    let lebanon_posts;

    let example_posts;

    let ready_raw = false, ready_processed = false;


    // concat two arrays
    const interleave = ([ x, ...xs ], ys = []) => {
        return x === undefined ? ys : [ x, ...interleave (ys, xs) ]
    }


    async function load_raw_data(project_select){

        // import data
        const promises = []
        promises.push(request_GET(`${URL_PREFIX}/assets/data/${project_select}/sources.json`))
        promises.push(request_GET(`${URL_PREFIX}/assets/data/${project_select}/submissions.json`))
        promises.push(request_GET(`${URL_PREFIX}/assets/data/${project_select}/lexicon.json`))
        promises.push(request_GET(`${URL_PREFIX}/assets/data/${project_select}/events.json`))
        promises.push(request_GET(`${URL_PREFIX}/assets/data/${project_select}/categories.json`))
        promises.push(request_GET(`${URL_PREFIX}/assets/data/${project_select}/dictionary.json`))
        promises.push(request_GET(`${URL_PREFIX}/assets/data/${project_select}/params.json`))

        return await Promise.all(promises);
    }

    async function load_posts_and_process_data(project_select){

        // get zipped posts
        const _posts_zip = await getRequestWrapper(`${URL_PREFIX}/assets/data/${project_select}/posts.json.zip`, lang, 'blob')

        // unzip posts
        const _posts = (await unzip(_posts_zip))[0];

        // process
        if(project_select === 'brazil'){
            return preproc(brazil_sources , _posts, brazil_submissions, brazil_lexicon, brazil_events, brazil_categories, brazil_dictionary);
        }else if(project_select === 'lebanon'){
            return preproc(lebanon_sources , _posts, lebanon_submissions, lebanon_lexicon, lebanon_events, lebanon_categories, lebanon_dictionary);
        }
    }

    onMount(async () => {

        // load data
        const brazil_results = await load_raw_data('brazil');
        if(brazil_results === null || !Array.isArray(brazil_results) || brazil_results.length === 0) return;
        [ brazil_sources, brazil_submissions, brazil_lexicon, brazil_events, brazil_categories, brazil_dictionary, brazil_params ] = brazil_results;

        // load data
        const lebanon_results = await load_raw_data('lebanon');
        if(lebanon_results === null || !Array.isArray(lebanon_results) || lebanon_results.length === 0) return;
        [ lebanon_sources, lebanon_submissions, lebanon_lexicon, lebanon_events, lebanon_categories, lebanon_dictionary, lebanon_params ] = lebanon_results;

        // combine example posts
        const brazil_example_posts = brazil_params['examples']['lexicon'];
        const lebanon_example_posts = lebanon_params['examples']['lexicon'];
        example_posts = interleave(brazil_example_posts, lebanon_example_posts)

        // set ready flag
        ready_raw = true;

        // load posts
        [ brazil_sources, brazil_posts, brazil_submissions, brazil_lexicon, brazil_events, brazil_categories, brazil_dictionary ] = await load_posts_and_process_data('brazil');
        [ lebanon_sources, lebanon_posts, lebanon_submissions, lebanon_lexicon, lebanon_events, lebanon_categories, lebanon_dictionary ] = await load_posts_and_process_data('lebanon');

        // set ready flag
        ready_processed = true;
    })

</script>


<!-- Loader -->
{#if !ready_raw}
    <Loader onstart={true}/>
{/if}

<!-- Background -->
{#if !_isMobile && ready_raw && ready_processed}
    <Background/>
{/if}

<main>

    <!-- Title -->
    <div class="title">
        <h1>{getString(lang, 'title')}</h1>
        <h2>{getString(lang, `case_studies`)}</h2>
    </div>

    <hr>
    <div class="separator"></div>
    <Introduction lang={lang}/>


    <div class="separator"></div>
    <GenderedDisinfo lang={lang}/>

    <!-- Main content -->
    {#if ready_raw}

        <div class="separator"></div>
        <Methods posts={example_posts} lang={lang}/>
        
        {#if ready_processed}

            <div class="separator"></div>

            <CaseStudies lang={lang}
                brazil_categories={brazil_categories} brazil_events={brazil_events} brazil_submissions={brazil_submissions} brazil_lexicon={brazil_lexicon} brazil_posts={brazil_posts} brazil_sources={brazil_sources} brazil_dictionary={brazil_dictionary} brazil_params={brazil_params}
                lebanon_categories={lebanon_categories} lebanon_events={lebanon_events} lebanon_submissions={lebanon_submissions} lebanon_lexicon={lebanon_lexicon} lebanon_posts={lebanon_posts} lebanon_sources={lebanon_sources} lebanon_dictionary={lebanon_dictionary} lebanon_params={lebanon_params}/>
        {/if}

        <div class="separator"></div>
        <Discussion lang={lang}/>

        <div class="separator"></div>
        <Conclusion lang={lang}/>

    {/if}


</main>

<style>

    main {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 65px;
        width: 100%;
        margin: 0px auto;
		padding: 0px;
        padding-top: 96px;
        padding-bottom: 96px;
		text-align: center;
        overflow-y: scroll;
        overflow-x: hidden;
        z-index: 1;
	}

    /* footer starts to span two lines when width < 446px */
    @media (max-width: 368px) {
        main{
            bottom: 88px;
        }
    }

    .separator {
        height: 16px;
    }

    /* Our CSS variables for the whole project */
    :global(:root) {
        --black-dark: #222;
        --black: #444;
        --black-light: #999;
        --red: #e44e4e;
        --green: #009900;
        --main-color: hsl(219, 42%, 41%);
        --main-color-dark: hsl(219, 42%, 28%);
        --main-color-light: hsl(219, 42%, 54%);
        --max-width-small: 40vw;
        --max-width: 60vw;
        --max-width-large: 70vw;
        --font-size-very-very-very-small: 0.7em;
        --font-size-very-very-small: 0.8em;
        --font-size-very-small: 0.9em;
        --font-size-small: 1.05em;
        --font-size-normal: 1.3em;
        --font-size-large: 1.8em;
        --font-size-very-large: 2em;
        --font-weight-bold: 600;
        --font-weight-normal: 400;
        --font-weight-light: 200;
        --word-spacing: 0.025em;
        --word-spacing-small: 0.01em;
        --letter-spacing: 0.02em;
        --letter-spacing-small: 0.01em;
        --line-height: 1.45em;
        --line-height-small: 1.2em;
    }

    /* If screen is small (e.g. mobile) we make the article take up a larger fraction of the screen width */
    @media (max-width: 768px) {
        :global(:root) {
            --max-width-small: 60vw;
            --max-width: 80vw;
            --max-width-large: 90vw;
        }
    }


    :global(body) {
        font-family: charter, Georgia, Cambria, "Times New Roman", Times, serif;
        letter-spacing: var(--letter-spacing);
        word-spacing: var(--word-spacing);
        line-height: var(--line-height);
    }

    :global(.red){
        color: var(--red);
    }

    :global(.green){
        color: var(--green);
    }

    :global(a){
        color: var(--black);
        /* text-decoration: none; */
        cursor: pointer;
    }

    :global(a:hover) {
        text-decoration: underline;
        color: var(--black-light);
    }

    :global(p){
        color: var(--black);
        hyphens: none;
        margin: 8px 0px;
        padding: 0px;
    }

    :global(li){
        hyphens: none;
        margin: 8px 0px;
        padding: 0px;
    }

    :global(hr) {
        height:1px;
        border-width:0px;
        max-width: var(--max-width);
        background-color: black;
        opacity: 0.2;
        margin: 0px auto;
        padding: 0px;
    }

    /* Text formatting */
    :global(.title) {
        padding: 0px 32px 0px;
        margin: 1.5em auto 0.5em;
        color: var(--black-dark);
        margin: auto;
        line-height: 2em;
        max-width: var(--max-width);
    }

    :global(.title h1) {
        margin: 0px;
        padding: 0px;
        color: var(--black-dark);
        margin-bottom: 12px;
        padding-top: 12px;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-very-large);
    }

    :global(.title h2) {
        margin: 0px;
        padding: 0px;
        color: var(--black-dark);
        margin-bottom: 24px;
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-small);
    }

    :global(.subtitle) {
        text-align: left;
        color: var(--black-dark);
        margin: 1.5em auto 0.5em;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-normal);
        max-width: var(--max-width);
    }

    :global(.subsubtitle) {
        text-align: left;
        color: var(--black-dark);
        margin: 1.5em auto -0.5em;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-small);
        max-width: var(--max-width);
    }


    :global(.subsubsubtitle) {
        text-align: left;
        color: var(--black-dark);
        margin: 1.5em auto -0.5em;
        padding: 0px;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-very-small);
        max-width: var(--max-width);
    }


    :global(.subsubsubtitle-underline) {
        text-align: left;
        color: var(--black-dark);
        margin: 1.5em auto -0.5em;
        padding: 0px;
        text-decoration: underline;
        font-size: var(--font-size-very-small);
        max-width: var(--max-width);
    }

    :global(.italic) {
        font-style: italic;
    }

    /* D3 tooltip */
    :global(.tooltip) {
        display: none;
        position: fixed;
        text-align: left;
        border: 1px solid #333;
        background: rgb(255, 255, 255);
        color: var(--black);
        box-shadow: 0px 2px 5px rgba(0, 0, 0, .3);
        text-transform: capitalize;
        margin: 0px;
        padding: 8px;
        z-index: 998;
        line-height: 1.2em;
        max-width: 350px;
    }

    :global(.tooltip h1) {
        font-size: var(--font-size-normal);
        margin: 0px;
        padding: 0px;
    }

    :global(.tooltip h2) {
        font-size: var(--font-size-small);
        margin: 0px;
        margin-bottom: 4px;
        padding: 0px;
    }

    :global(.tooltip p) {
        font-size: var(--font-size-very-small);
        margin: 0px;
        padding: 0px;
    }


    /* D3 function */
    :global(.hidden){
        visibility: hidden;
    }


    /* Sweet alert global variables */
    :global(.swal-footer){
        text-align: center;
    }

    :global(.swal-button){
        background-color: var(--main-color);
    }

    :global(.swal-button:not([disabled]):hover){
        background-color: var(--main-color-dark);
    }

    /* Transtions */
    :global(.fade-in) {
        animation: fadeIn 1.5s;
        -webkit-animation: fadeIn 1.5s;
        -moz-animation: fadeIn 1.5s;
        -o-animation: fadeIn 1.5s;
        -ms-animation: fadeIn 1.5s;
        opacity: 1.0;
    }

    :global(.fade-in-long) {
        animation: fadeIn 3.0s;
        -webkit-animation: fadeIn 3.0s;
        -moz-animation: fadeIn 3.0s;
        -o-animation: fadeIn 3.0s;
        -ms-animation: fadeIn 3.0s;
        opacity: 1.0;
    }

    @keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }

    @-moz-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }

    @-webkit-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }

    @-o-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }

    @-ms-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }


    :global(.fade-out) {
        animation: fadeOut 1.5s;
        -webkit-animation: fadeOut 1.5s;
        -moz-animation: fadeOut 1.5s;
        -o-animation: fadeOut 1.5s;
        -ms-animation: fadeOut 1.5s;
        opacity: 0.0;
    }
    @keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
    }

    @-moz-keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
    }

    @-webkit-keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
    }

    @-o-keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
    }

    @-ms-keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
    }

</style>