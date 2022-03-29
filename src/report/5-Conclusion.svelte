<script>

    // properties
    export let lang;

    // import strings
    import { conclusion } from '../strings.json';

</script>

<section>

    <h1 class="title">{conclusion['title'][lang] !== undefined ? conclusion['title'][lang] : conclusion['title']['eng']}</h1>

    {#each Object.keys(conclusion['paragraphs']) as paragraph_key}
        <p>
            {@html conclusion['paragraphs'][paragraph_key][lang] !== undefined ? conclusion['paragraphs'][paragraph_key][lang] : conclusion['paragraphs'][paragraph_key]['eng']}
        </p>
    {/each}

</section>

<style>

</style>
