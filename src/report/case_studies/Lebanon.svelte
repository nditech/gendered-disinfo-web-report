<script>

    // properties
    export let lang;
    export let dataset;
    export let params;

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


</script>


<section>

    <p class="title">Lebanon</p>
    
    <p>
        For this case study, we partnered with the 
        <a target="_blank" href="https://www.skeyesmedia.org/en/Home">Skeyes Center for Media and Cultural Freedom</a> and 
        <a target="_blank" href="https://www.abaadmena.org/">ABAAD - Resource Centre for Gender Equality</a>. We seek to 
        establish the prevalence and nature of disinformation campaigns throughout the economic and political crisis. 
    </p>

    <br>
    <br>
    
    <p class="subtitle">Political Network</p>
    <p>
        In-country participants identified <b>{nbr_of_accounts}</b> Telegram, Facebook, Twitter and Youtube accounts as being part of 
        the political network.
    </p>
    <Table data={political_network_table}/>


    <p class="subtitle">Dataset</p>
    <p>
        Data collection returned a total of <b>{posts.length.toLocaleString()}</b> posts between {min_date} and {max_date}.
    </p>
    <br>
    <p>
        This search bar allows you to find social media posts based on space-separated keywords (click for full results). 
        Some keywords have been removed if they either had low or high occurrence.
    </p>
    <br>
    <p style="font-style: italic;">
        Some posts might have been taken down by the author or the platform since this data collection activity.
    </p>
    <br>
    <SearchTable placeholders={params['examples']['queries']} documents={posts} word_mapping={dictionary}/>



    <p class="subtitle">Filtering</p>
    <p class="subsubtitle">Lexicon</p>
    <p>
        Participants came up with a list of <b>{lexicon.length} words</b> prone to be used in disinformation. Only posts containing at least
        one of these keywords were kept. 
    </p>
    <Table data={lexicon_table}/>

    <p class="subsubtitle">Events</p>
    <p>
        The shock timeline developed by the participants is composed of {events.length} key events. We only considered social media posts 
        published during the 21 days following each event. 
    </p>
    <Table data={events_table}/>


    <p class="subsubtitle">Engagement</p>
    <p>
        Post that did not meet the minimum engagement thresholds were dismissed.
    </p>
    <Table data={[
        ["Type", "Minimum Value"],
        ["Views", "500"],
        ["Reactions", "200"],
        ["Comments", "200"],
        ["Shares", "100"]
    ]}/>

    <p class="subtitle">Results</p>

    <p>
        Using automated lexical, temporal and engagement filters, in combination with human reviews we uncovered a total of 
        <b>{submissions_of_interest.length}</b> posts containing disinformation from <b>{belligerents.length}</b> belligerents.
    </p>
    <br>

    <Heatmap data={submissions_of_interest} sources={belligerents} events={events}/>
    
    <p class="subsubtitle">Belligerents</p>
    <p>
        Here is a short description of the <b>{belligerents.length.toLocaleString()} state-affiliated accounts</b> that published 
        disinformation.
    </p>
    <br>
    <Portraits data={belligerents}/>


    <br>
    <h1 class="subsubtitle">Salient Narratives</h1>
    <p>
        We reviewed all the posts of interest and categorized them into {categories.length} narratives.
    </p>
    <List elements={categories.map(d => d['description'])}/>

    <br>

    <h1 class="subsubtitle">Engagement</h1>
    <p>
        Each post is represented as a square. The color intensity is proportional to the level of engagement.
    </p>
    <br>
    {#each categories as category, i}
        <DotMatrixPlot data={dotmatrix.filter(d => d['categories'].includes(category['key']))} title={`${romanize(i+1)}. ${category['name_count']}`} max_interactions={Math.max(...dotmatrix.map(d => d['interactions']['count']))}/>
    {/each}


    <br>
    
    <h1 class="subsubtitle">Coordination</h1>
    <p>
        Let's now look at coordination for each of these categories. To do so, we will look at our social media posts using a graph representation.
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