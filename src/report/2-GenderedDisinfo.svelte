<script>

    // properties
    export let lang;

    // import strings
    import { gendereddisinfo } from '../strings.json';

    // import config
    import { SUBDIRECTORY } from '../config.json'

</script>

<section>

    <h1 class="title">{gendereddisinfo['title'][lang]}</h1>

    {#each Object.keys(gendereddisinfo['paragraphs_1']) as paragraph_key}
        <p>
            {@html gendereddisinfo['paragraphs_1'][paragraph_key][lang]}
        </p>
    {/each}

    <div>
        <img alt="information venn diagram" src="{SUBDIRECTORY}assets/explanatives/misinformation_girls.png">
    </div>


    <h1 class="subtitle">{gendereddisinfo['subtitle'][lang]}</h1>

    {#each Object.keys(gendereddisinfo['paragraphs_2']) as paragraph_key}
        <p>
            {@html gendereddisinfo['paragraphs_2'][paragraph_key][lang]}
        </p>
    {/each}

</section>


<style>


    div {
        margin: 0px;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 16px;
        padding-bottom: 16px;
        align-items: center;
        text-align: center;
    }

    img {
        border: 1px solid var(--black);
        max-width: var(--max-width-small);
        filter: grayscale(100%);
        opacity: 0.6;
    }


</style>