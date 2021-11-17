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
            In this study, we investigated the presence of state-based gendered disinformation during periods of societal shock. 
            Hundreds of thousands of posts were collected from the social media pages of political insiders. Thousands were selected 
            based on their language, publication date and level of engagement. They were then sent to in-country participants for 
            review. Participants received training on how to identify disinformation and gendered narratives. Only a few dozen posts 
            were found to contain what we were looking for. The results and our confidence in the methodology leads us to believe 
            there was no coordinated campaign within the studied time frame in both of our case studies. In retrospect, the lack of 
            findings can be explained by the strict constraints that were placed on the study. Posts had to be disinformative, 
            gendered, from political insiders, generated high engagement, and published in the fallout of shocks. 
        </p>
        <p>
            The social media research methodology layed out in this report is operationalizable in other contexts with other themes, 
            account networks, timeframes, and geographies. Its implementation in two dissimilar societies is indicative of its adaptability. 
            We expect our partners in Brazil and Lebanon to build upon it and use it in subsequent projects involving the examination 
            of Telegram, Youtube, Facebook and Twitter.
        </p>
        <p>TEST - 2</p>
    `;

</script>

    <h1 class="subtitle">{title}</h1>
    <TextBlock html={html}/>

<style>

</style>