<script>

    // properties
    export let lang;

    // import strings
    import { introduction } from '../strings.json';

</script>

<section>

    <h1 class="title">{introduction['title'][lang] !== undefined ? introduction['title'][lang] : introduction['title']['eng']}</h1>

    {#each Object.keys(introduction['paragraphs']) as paragraph_key}
        <p>
            {@html introduction['paragraphs'][paragraph_key][lang] !== undefined ? introduction['paragraphs'][paragraph_key][lang] : introduction['paragraphs'][paragraph_key]['eng']}
        </p>
    {/each}

</section>


<style>

</style>