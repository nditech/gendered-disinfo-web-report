<script>

    // properties
    export let lang;
    export const id = "casestudies";
    export let brazil_categories, brazil_events, brazil_lexicon, brazil_posts, brazil_sources, brazil_dictionary, brazil_params, brazil_submissions;
    export let lebanon_categories, lebanon_events, lebanon_lexicon, lebanon_posts, lebanon_sources, lebanon_dictionary, lebanon_params, lebanon_submissions;

    // import components
    import CaseStudy from './explanatives/CaseStudy.svelte';

    // --- texts ---
    const title = "Case Studies";

    const subtitle_1 = "Brazil";
    const brazil_participants_html = `
    <p>
        Our in-situ partner is <a target="_blank" href="https://www.internetlab.org.br/en/">InternetLab</a>, an independent research center that
        aims to foster academic debate around issues involving law and technology, especially internet policy.
    </p>
    `;
    const brazil_events_description = 'covid response';


    const subtitle_2 = "Lebanon";
    const lebanon_participants_html = `
    <p>
        We worked with multiple in-situ organizations including the Skeyes Center for Media and Cultural Freedom, ABAAD - Resource Centre for Gender Equality and the National Democratic Institute.
    </p>
    `;
    const lebanon_events_description = 'economic and political crisis';

</script>

    <h1 class="subtitle">{title}</h1>

    <!-- Brazil -->
    <h1 class="subsubtitle">{subtitle_1}</h1>
    <CaseStudy events_description={brazil_events_description} participants_html={brazil_participants_html}
        categories={brazil_categories} events={brazil_events} lexicon={brazil_lexicon} posts={brazil_posts} submissions={brazil_submissions}
        sources={brazil_sources} dictionary={brazil_dictionary} params={brazil_params}/>

    <!-- Lebanon -->
    <h1 class="subsubtitle">{subtitle_2}</h1>
    <CaseStudy events_description={lebanon_events_description} participants_html={lebanon_participants_html}
        categories={lebanon_categories} events={lebanon_events} lexicon={lebanon_lexicon} posts={lebanon_posts} submissions={lebanon_submissions}
        sources={lebanon_sources} dictionary={lebanon_dictionary} params={lebanon_params}/>

<style>

</style>