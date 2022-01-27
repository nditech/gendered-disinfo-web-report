<script>

    // import sections
    import Introduction from './sections/1-Introduction.svelte';
    import GenderedDisinfo from './sections/2-GenderedDisinfo.svelte';
    import Methods from './sections/3-Methods.svelte';
    import CaseStudies from './sections/case_studies/Brazil.svelte';
    import Discussion from './sections/5-Discussion.svelte';
    import Interventions from './sections/6-Interventions.svelte';
    import Conclusion from './sections/7-Conclusion.svelte';

    import Brazil from './sections/case_studies/Brazil.svelte';
    import Lebanon from './sections/case_studies/Lebanon.svelte';

    // properties
    export let lang;

    // load constants
    import { SUBDIRECTORY, AUTHOR, AUTHOR_DOMAIN, TITLE, DESCRIPTION, OF_INTEREST, MIN_NBR_OF_PUBLICATION_OF_INTEREST } from '../constants.json';

    // load libs
    import { onMount } from 'svelte';
    import { getString } from '../libs/translator.js';
    
    // load helper functions
    import { interleave, load_params, load_tools, load_findings, load_posts_zip } from './helper.js';

    // init variables
    let phase_1_params_done = false;
    let phase_2_brazil_done = false;
    let phase_3_lebanon_done = false;

    // data
    let brazil_params, lebanon_params;
    let sample_posts = null;
    let brazil_dataset, lebanon_dataset;
    
    onMount(async () => {

        // load params
        brazil_params = await load_params('brazil');
        lebanon_params = await load_params('lebanon');

        // combine example posts
        sample_posts = interleave(brazil_params['examples']['lexicon'], lebanon_params['examples']['lexicon'])

        // set ready flag
        phase_1_params_done = true;

        // ------------------------------------------------------------------------------------------
        // -------------------------------------- Brazil --------------------------------------------
        // ------------------------------------------------------------------------------------------
        
        // load data
        const [ brazil_sources, brazil_lexicon, brazil_events ] = await load_tools('brazil');
        const [ brazil_submissions, brazil_dictionary, brazil_categories ] = await load_findings('brazil');
        const brazil_posts_zip = await load_posts_zip('brazil');

        // bundle the data
        const brazil_payload = {
            'sources': brazil_sources, 
            'posts_zipped': brazil_posts_zip, 
            'submissions': brazil_submissions, 
            'lexicon': brazil_lexicon, 
            'events': brazil_events, 
            'categories': brazil_categories, 
            'dictionary': brazil_dictionary,
            'OF_INTEREST': OF_INTEREST,
            'MIN_NBR_OF_PUBLICATION_OF_INTEREST': MIN_NBR_OF_PUBLICATION_OF_INTEREST
        };

        // init worker
        var worker_brazil = new Worker('assets/scripts/task_preproc.js', { type: "module" });

        // configure how the worker responds to incomming data
        worker_brazil.addEventListener('message', function(e) {
            brazil_dataset = e.data;
            phase_2_brazil_done = true;
        }, false); 

        // start worker
        worker_brazil.postMessage(brazil_payload);


        // ------------------------------------------------------------------------------------------
        // ------------------------------------- Lebanon --------------------------------------------
        // ------------------------------------------------------------------------------------------
        
        // load data
        const [ lebanon_sources, lebanon_lexicon, lebanon_events ] = await load_tools('lebanon');
        const [ lebanon_submissions, lebanon_dictionary, lebanon_categories ] = await load_findings('lebanon');
        const lebanon_posts_zip = await load_posts_zip('lebanon');

        // bundle the data
        const lebanon_payload = {
            'sources': lebanon_sources, 
            'posts_zipped': lebanon_posts_zip, 
            'submissions': lebanon_submissions, 
            'lexicon': lebanon_lexicon, 
            'events': lebanon_events, 
            'categories': lebanon_categories, 
            'dictionary': lebanon_dictionary,
            'OF_INTEREST': OF_INTEREST,
            'MIN_NBR_OF_PUBLICATION_OF_INTEREST': MIN_NBR_OF_PUBLICATION_OF_INTEREST
        };

        // init worker
        var worker_lebanon = new Worker('assets/scripts/task_preproc.js', { type: "module" });

        // configure how the worker responds to incomming data
        worker_lebanon.addEventListener('message', function(e) {
            lebanon_dataset = e.data;
            phase_3_lebanon_done = true;
        }, false); 

        // start worker
        worker_lebanon.postMessage(lebanon_payload);

    })

</script>

<main>

    <!-- Sections -->
    <div class="separator"></div>
    <Introduction bind:lang={lang}/>

    <div class="separator"></div>
    <GenderedDisinfo lang={lang}/>

    <!-- Main content -->
    {#if phase_1_params_done}

        <div class="separator"></div>
        <Methods posts={sample_posts} lang={lang}/>
        
        {#if phase_2_brazil_done}
            <div class="separator"></div>
            <Brazil lang={lang} params={brazil_params} dataset={brazil_dataset}/>
        {/if}

        {#if phase_3_lebanon_done}
            <div class="separator"></div>
            <Lebanon lang={lang} params={lebanon_params} dataset={lebanon_dataset}/>
        {/if}


        <div class="separator"></div>
        <Discussion lang={lang}/>

        <!-- <div class="separator"></div>
        <Interventions lang={lang}/> -->

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
        bottom: 0;
        width: 100%;
        margin: 0px auto;
        padding: 0px;
        padding-top: 100vh;
        text-align: center;
        overflow-y: scroll;
        overflow-x: hidden;
        padding-bottom: 96px;
        z-index: 1;
    }

</style>