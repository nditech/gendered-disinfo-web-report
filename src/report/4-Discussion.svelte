<script>

    // properties
    export let lang;

    // import strings
    import { discussion } from '../strings.json';

</script>

<section>

    <h1 class="title">{discussion['title'][lang]}</h1>

    {#each Object.keys(discussion['paragraphs_1']) as paragraph_key}
        <p>
            {@html discussion['paragraphs_1'][paragraph_key][lang]}
        </p>
        <br>
    {/each}

    <ol>
        {#each Object.keys(discussion['enumerations']) as paragraph_key}
            <li>
                {@html discussion['enumerations'][paragraph_key][lang]}
            </li>
        {/each}    
    </ol>


    {#each Object.keys(discussion['paragraphs_2']) as paragraph_key}
        <p>
            {@html discussion['paragraphs_2'][paragraph_key][lang]}
        </p>
        <br>
    {/each}


</section>

<style>

</style>