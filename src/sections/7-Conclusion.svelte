<script>

    // properties
    export let lang;
    export const id = "conclusion";

    // components
    import TextBlock from '../components/TextBlock.svelte';


    // ---
    const title = 'Conclusion';
    const html = `
        <p>
            The results and our confidence in the methodology leads us to believe there was no state-based gendered disinformation 
            campaign within the studied time frame in both Lebanon and Brazil. Nonetheless, the likely absence of gendered disinformation 
            campaigns in the two contexts considered here doesn’t discount the possibility that there are disinformation campaigns 
            underway around other narratives, or other gendered disinformation campaigns in other societies.
        </p>
        <p>
            The social media research methodology layed out in this report is applicable in other contexts with other themes, 
            account networks, timeframes, languages, and geographies. Its implementation in two dissimilar societies is indicative 
            of its adaptability. We expect our partners in Brazil and Lebanon to build upon it and use it in future work involving 
            the examination of Telegram, Youtube, Facebook and Twitter. 
        </p>
    `;

</script>

    <h1 class="subtitle">{title}</h1>
    <TextBlock html={html}/>

<style>

</style>
