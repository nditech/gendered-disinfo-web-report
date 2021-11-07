<script>

    // properties
    export let lang;

    export let sources, submissions, events, categories, dictionary, lexicon;

    // import dataviz
    import Network from '../../dataviz/NetworkGeneral/Network.svelte';
    import Heatmap from '../../dataviz/Heatmap/Heatmap.svelte';
    import DotMatrixPlot from '../../dataviz/DotMatrixPlot/DotMatrixPlot.svelte';

    // import components
    import TextBlock from '../../components/TextBlock.svelte';
    import Portraits from '../../components/Portraits.svelte';
    import List from '../../components/List.svelte';
    import Slider from '../../components/Slider.svelte';

    // import lib
    import { posts_to_graph, posts_to_heatmap, posts_to_dotmatrix, get_max_followers } from '../../preproc.js';
    import { romanize } from '../../libs/locale.js';

    // constants
    const COORDINATION_MAX_NUMBER_OF_DAYS = 15;
    const MIN_NBR_OF_PUBLICATION_OF_INTEREST = 1;

    // submissions
    let submissions_of_interest = submissions.filter(submission => submission['of_interest']);

    // belligerents
    let belligerents = [...new Set(submissions_of_interest.map(p => p['source_name']))].map(name => {
        return sources.filter(s => s['name'] === name)[0];
    }).filter(d => d !== undefined);
    belligerents.sort((a, b) => get_max_followers(b) - get_max_followers(a));  // sort by following

    // create a map of belligerent to nbr of posts
    let belligerents_nbr_publications_of_interest_map = {};
    belligerents.forEach(belligerent => {
        belligerents_nbr_publications_of_interest_map[belligerent['name']] = submissions_of_interest.filter(s => s['source_name'] === belligerent['name']).length;
    })

    // filter by MIN_NBR_OF_PUBLICATION_OF_INTEREST
    submissions_of_interest = submissions_of_interest.filter(s => {
        return belligerents_nbr_publications_of_interest_map[s['source_name']] >= MIN_NBR_OF_PUBLICATION_OF_INTEREST;
    })
    belligerents = belligerents.filter(b => {
        return belligerents_nbr_publications_of_interest_map[b['name']] >= MIN_NBR_OF_PUBLICATION_OF_INTEREST;
    })

    // get final total
    const nbr_of_belligerents_accounts = belligerents.map(belligerent => Object.keys(belligerent['endpoint']).length).reduce((a, b) => a + b)

    // convert lexicon to word vector
    const lexicon_wv = lexicon.map(e => dictionary[e['word']]).filter(w => w !== undefined);

    // invert the dictionary
    const dictionary_inv = {};
    Object.keys(dictionary).map(key => {
        const val = dictionary[key];
        dictionary_inv[val] = key;
    })

    // set lexicon match
    submissions_of_interest.forEach(s => {
        let lexicon_match = new Set();
        for(let w of s['wv']){
            if(lexicon_wv.includes(w)){
                lexicon_match.add(dictionary_inv[w]);
            }
        }
        s['lexicon_match'] = [...lexicon_match];
    })

    // heatmap data
    const heatmap = posts_to_heatmap(submissions_of_interest, categories);

    // dot matrix data
    const dotmatrix = posts_to_dotmatrix(submissions_of_interest);

    // displayed variables
    let nodes, vertices;

    // network data
    function change_category(key){

        // filter posts based on category
        const _submissions = submissions.filter(post => post['categories'].includes(key));

        // update network data
        [nodes, vertices] = posts_to_graph(_submissions, categories, sources, COORDINATION_MAX_NUMBER_OF_DAYS);
    }

    // options
    const options = categories.map(d => {
        return {
            'key': d['key'],
            'value': d['name_count'],
        }
    })

    // --- texts ---
    const text_1 = `
    <p>
        We discovered a total of <b>${submissions_of_interest.length}</b> posts containing disinformation from <b>${belligerents.length}</b> belligerents or <b>${nbr_of_belligerents_accounts}</b> social media accounts.
    </p>
    `;

    const text_3 = `
    <p>
        We reviewed all the posts of interest and categorized them into ${categories.length} narratives.
    </p>
    `;

    const text_4 = `
    <p>
        Each post is represented as a square. The color intensity is proportional to the level of engagement.
    </p>
    `;

    const text_5 = `
    <p>
        Here is a short description of all the <b>${belligerents.length.toLocaleString()} state-affiliated accounts</b> that published disinformation.
    </p>
    `;

    const text_6 = `
    <p>
        Let's now look at coordination for each of these categories. To do so, we will look at our social media posts using a graph representation.
    </p>
    <p>
        If there is a link between two belligerents it means they published a message containing the same keyword within a <b>${COORDINATION_MAX_NUMBER_OF_DAYS}</b> days interval.
    </p>
    `;

</script>


<section>

    <TextBlock html={text_1}/>
    <Heatmap data={heatmap} events={events}/>

    <h1 class="subsubsubtitle">Belligerents</h1>
    <TextBlock html={text_5}/>
    <Portraits data={belligerents}/>


    <h1 class="subsubsubtitle">Salient Narratives</h1>
    <TextBlock html={text_3}/>
    <List elements={categories.map(d => d['description'])}/>


    <h1 class="subsubsubtitle">Engagement</h1>
    <TextBlock html={text_4}/>
    {#each categories as category, i}
        <DotMatrixPlot data={dotmatrix.filter(d => d['categories'].includes(category['key']))} title={`${romanize(i+1)}. ${category['name_count']}`} max_reactions={Math.max(...dotmatrix.map(d => d['reactions']))}/>
    {/each}

    <h1 class="subsubsubtitle">Coordination</h1>
    <TextBlock html={text_6}/>
    <Slider previous_callback={(opt) => change_category(opt)} next_callback={(opt) => change_category(opt)} options={options}/>
    <Network bind:nodes={nodes} bind:vertices={vertices}/>

</section>


<style>

</style>