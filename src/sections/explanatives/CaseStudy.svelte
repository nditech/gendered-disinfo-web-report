<script>

    // properties
    export let participants_html;
    export let events_description;
    export let events, lexicon, posts, sources, dictionary, params, submissions, categories;

    // import components
    import TextBlock from '../../components/TextBlock.svelte';
    import DataSearchEngine from './DataSearchEngine.svelte';
    import Table from '../../components/Table.svelte';
    import Results from './Results.svelte';

    // import libs
    import { date_to_month_year } from '../../libs/dt.js';

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
        const { name, endpoint } = source;
        Object.keys(endpoint).forEach(platform_name => {
            const { url } = endpoint[platform_name];
            political_network_table.push([name, platform_name, url])
        })
    })
    political_network_table.unshift(['Source', 'Platform', 'Link'])

    // number of distinct social media pages
    const nbr_of_accounts = sources.map(d => Object.keys(d['endpoint']).length).reduce((a, b) => a + b, 0);

    // time
    const time_delta = Math.round(posts.length*0.01); // the extremums are erroneous, this is safer
    const min_date = date_to_month_year(new Date(posts[time_delta]['t']))
    const max_date = date_to_month_year(new Date(posts[posts.length-time_delta]['t']))


    // --- texts ---
    const subsubtitle_1 = "Participants";
    const subsubtitle_2 = "Selected shocks";
    const subsubtitle_3 = "Political Network";
    const subsubtitle_4 = "Lexicon";
    const subsubtitle_5 = "Dataset";
    const subsubtitle_6 = "Annotation";
    const subsubtitle_7 = "Results"

    // --- text ---
    const text_2 = `
    <p>
        The selected shock is the ${events_description}. The timeline of events developed by the participants is composed of ${events.length} key events.
    </p>
    `;

    const text_3 = `
    <p>
        The participants identified <b>${nbr_of_accounts}</b> Telegram, Facebook, Twitter and Youtube accounts as being part of the political network.
    </p>
    `;

    const text_4 = `
    <p>
        Participants came up with a list of <b>${lexicon.length} words</b> prone to be used in disinformation.
    </p>
    `;

    const text_5 = `
    <p>
        Data collection returned a total of <b>${posts.length.toLocaleString()}</b> posts between ${min_date} and ${max_date}.
    </p>

    <p>
        This search bar allows you to find social media posts based on space-separated keywords (click for full results). Some keywords have been removed if they either had low or high occurrence.
    </p>

    <p style="font-style: italic;">
        Some posts might have been taken down since this data collection activity.
    </p>
    `;


    const text_6 = `
    <p>
        After filtering, <b>${submissions.length.toLocaleString()} posts</b> remained and were sent to our in-situ participants to be reviewed.
    </p>
    `;


</script>

    <h1 class="subsubsubtitle">{subsubtitle_1}</h1>
    <TextBlock html={participants_html}/>

    <h1 class="subsubsubtitle">{subsubtitle_2}</h1>
    <TextBlock html={text_2}/>
    <Table data={events_table}/>

    <h1 class="subsubsubtitle">{subsubtitle_3}</h1>
    <TextBlock html={text_3}/>
    <Table data={political_network_table}/>

    <h1 class="subsubsubtitle">{subsubtitle_4}</h1>
    <TextBlock html={text_4}/>
    <Table data={lexicon_table}/>

    <h1 class="subsubsubtitle">{subsubtitle_5}</h1>
    <TextBlock html={text_5}/>
    <DataSearchEngine posts={posts} dictionary={dictionary} params={params}/>

    <h1 class="subsubtitle">{subsubtitle_6}</h1>
    <TextBlock html={text_6}/>

    <h1 class="subsubtitle">{subsubtitle_7}</h1>
    <Results sources={sources} submissions={submissions} events={events} categories={categories} dictionary={dictionary} lexicon={lexicon}/>

<style>

</style>