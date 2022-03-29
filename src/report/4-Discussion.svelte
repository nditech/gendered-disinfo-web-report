<script>

    // properties
    export let lang;

    // import strings
    import { discussion } from '../strings.json';

</script>

<section>

    <h1 class="title">{discussion['title'][lang] !== undefined ? discussion['title'][lang] : discussion['title']['eng']}</h1>

    {#each Object.keys(discussion['paragraphs_1']) as paragraph_key}
        <p>
            {@html discussion['paragraphs_1'][paragraph_key][lang] !== undefined ? discussion['paragraphs_1'][paragraph_key][lang] : discussion['paragraphs_1'][paragraph_key]['eng']}
        </p>
    {/each}

    <ol>
        {#each Object.keys(discussion['enumerations']) as paragraph_key}
            <li>
                {@html discussion['enumerations'][paragraph_key][lang] !== undefined ? discussion['enumerations'][paragraph_key][lang] : discussion['enumerations'][paragraph_key]['eng']}
            </li>
        {/each}    
    </ol>


    {#each Object.keys(discussion['paragraphs_2']) as paragraph_key}
        <p>
            {@html discussion['paragraphs_2'][paragraph_key][lang] !== undefined ? discussion['paragraphs_2'][paragraph_key][lang] : discussion['paragraphs_2'][paragraph_key]['eng']}
        </p>
    {/each}


</section>

<style>

</style>