<script>

    // properties
    export let lang;

    // import strings
    import { introduction } from '../strings.json';

</script>

<section>

    <h1 class="subtitle">{introduction['title'][lang]}</h1>

    {#each Object.keys(introduction['paragraphs']) as paragraph_key}
        <p>
            {@html introduction['paragraphs'][paragraph_key][lang]}
        </p>
        <br>
    {/each}

</section>


<style>

</style>