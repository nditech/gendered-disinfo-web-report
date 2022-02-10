<script>

    // properties
    export let lang;

    // import strings
    import { conclusion } from '../strings.json';

</script>

<section>

    <h1 class="subtitle">{conclusion['title'][lang]}</h1>

    {#each Object.keys(conclusion['paragraphs']) as paragraph_key}
        <p>
            {@html conclusion['paragraphs'][paragraph_key][lang]}
        </p>
        <br>
    {/each}

</section>

<style>

</style>
