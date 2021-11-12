<script>

    // properties
    export let lang;
    export const id = "discussion";

    // components
    import TextBlock from '../components/TextBlock.svelte';


    // ---
    const title = 'Discussion';
    const html = `
    <p>
        We found negligible evidence of gendered disinformation campaigns from our political network within the studied timeframe. 
    </p>
    <p>
        
    </p>
    `;

</script>

    <h1 class="subtitle">{title}</h1>
    <TextBlock html={html}/>

<style>

</style>