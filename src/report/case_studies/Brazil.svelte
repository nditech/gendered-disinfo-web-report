<script>
    
    // properties
    export let lang;
    export let dataset;
    export let params;

    // import strings
    import { casestudies } from '../../strings.json';
    const casestudy = casestudies['brazil'];

    // unpack
    const { 
        sources, 
        posts, 
        submissions, 
        lexicon, 
        dictionary,
        events, 
        categories, 
        lexicon_table,
        events_table,
        political_network_table,
        nbr_of_accounts,
        min_date,
        max_date,
        belligerents,
        submissions_of_interest
    } = dataset;

    // import components
    import SearchTable from '../../components/SearchTable.svelte';
    import Table from '../../components/Table.svelte';
    import Portraits from '../../components/Portraits.svelte';
    import List from '../../components/List.svelte';
    import Slider from '../../components/Slider.svelte';

    // import dataviz
    import Heatmap from '../../dataviz/Heatmap/Heatmap.svelte';
    import DotMatrixPlot from '../../dataviz/DotMatrixPlot/DotMatrixPlot.svelte';
    import Network from '../../dataviz/Network/Network.svelte';

    // import libs
    import { romanize } from '../../libs/locale.js';
    import { posts_to_dotmatrix, posts_to_graph } from '../scripts/preproc.js';
    const dotmatrix = posts_to_dotmatrix(submissions_of_interest);


    // displayed variables
    const COORDINATION_MAX_NUMBER_OF_DAYS = 15;
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


    // engagement filters
    const engagement_table = [
        ["Type", "Minimum Value"],
        ["Views", "30000"],
        ["Reactions", "800"],
        ["Comments", "150"],
        ["Shares", "50"]
    ];

</script>

<section>

    <h1 class="title">{casestudy['title'][lang]}</h1>
    <p>
        {@html casestudy['partners'][lang]}
    </p>
        
    
    <h1 class="subtitle">{casestudies['subtitle_1'][lang]}</h1>
    <p>
        In-country participants identified <b>{nbr_of_accounts}</b> Telegram, Facebook, Twitter and Youtube accounts as being part of 
        the political network.
    </p>
    <Table data={political_network_table}/>


    <h1 class="subtitle">{casestudies['subtitle_2'][lang]}</h1>
    <p>
        Data collection returned a total of <b>{posts.length.toLocaleString()}</b> posts between {min_date} and {max_date}.
    </p>
    <br>
    <p>
        {@html casestudies['searchbar_1'][lang]}
    </p>
    <br>
    <p>
        {@html casestudies['searchbar_2'][lang]}
    </p>
    <br>
    <SearchTable placeholders={params['examples']['queries']} documents={posts} word_mapping={dictionary}/>


    <h1 class="subtitle">{casestudies['subtitle_3'][lang]}</h1>
    <h1 class="subsubtitle">{casestudies['subsubtitle_1'][lang]}</h1>
    <p>
        Participants came up with a list of <b>{lexicon.length} words</b> prone to be used in disinformation. Only posts containing at least
        one of these keywords were kept. 
    </p>
    <Table data={lexicon_table}/>

    
    <h1 class="subsubtitle">{casestudies['subsubtitle_2'][lang]}</h1>
    <p>
        The shock timeline developed by the participants is composed of {events.length} key events. We only considered social media posts 
        published during the 21 days following each event. 
    </p>
    <Table data={events_table}/>


    <h1 class="subsubtitle">{casestudies['subsubtitle_3'][lang]}</h1>
    <p>
        {@html casestudies['engagement_1'][lang]}
    </p>
    <Table data={engagement_table}/>


    <h1 class="subtitle">{casestudies['subtitle_4'][lang]}</h1>
    <p>
        Using automated lexical, temporal and engagement filters, in combination with human reviews we uncovered a total of 
        <b>{submissions_of_interest.length}</b> posts containing disinformation from <b>{belligerents.length}</b> belligerents.
    </p>
    <br>
    <Heatmap data={submissions_of_interest} sources={belligerents} events={events}/>

    
    <h1 class="subsubtitle">{casestudies['subsubtitle_4'][lang]}</h1>
    <p>
        Here is a short description of the <b>{belligerents.length.toLocaleString()} state-affiliated accounts</b> that published 
        disinformation.
    </p>
    <br>
    <Portraits data={belligerents}/>


    <h1 class="subsubtitle">{casestudies['subsubtitle_5'][lang]}</h1>
    <p>
        We reviewed all the posts of interest and categorized them into {categories.length} narratives.
    </p>
    <List elements={categories.map(d => d['description'])}/>

        

    <h1 class="subsubtitle">{casestudies['subsubtitle_6'][lang]}</h1>
    <p>
        {@html casestudies['engagement_2'][lang]}
    </p>
    <br>
    {#each categories as category, i}
        <DotMatrixPlot data={dotmatrix.filter(d => d['categories'].includes(category['key']))} title={`${romanize(i+1)}. ${category['name_count']}`} max_interactions={Math.max(...dotmatrix.map(d => d['interactions']['count']))}/>
    {/each}

    
    <h1 class="subsubtitle">{casestudies['subsubtitle_7'][lang]}</h1>
    <p>
        {@html casestudies['coordination'][lang]}
    </p>
    <br>
    <p>
        If there is a link between two belligerents it means they published a message containing the same keyword within a <b>{COORDINATION_MAX_NUMBER_OF_DAYS}</b> days interval.
    </p>
    <Slider previous_callback={(opt) => change_category(opt)} next_callback={(opt) => change_category(opt)} options={options}/>
    <Network bind:nodes={nodes} bind:vertices={vertices}/>

</section>

<style>

</style>