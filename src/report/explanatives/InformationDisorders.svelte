<script>

    // properties
    export let lang;

    // import config
    import { SUBDIRECTORY } from '../../config.json';

    // import strings
    import { information_disorders } from '../../strings.json';

</script>


<div id="information-disorder-container" class="container">
    {#each information_disorders as information_disorder}
        <div class="information-disorder">
            <img alt="{information_disorder['src'].split('.').pop()}" src="{SUBDIRECTORY}assets/images/{information_disorder['src']}">
            <h1>{information_disorder['title'][lang]}</h1>
            <p>{information_disorder['description'][lang]}</p>
        </div>
    {/each}
</div>


<style>

    .container {
        text-align: center;
        margin: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: var(--max-width-large);
        padding: 0px;
    }

    .information-disorder{
        margin: 0px;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 16px;
        padding-bottom: 16px;
        display: inline-block;
        align-items: center;
        text-align: center;
        max-width: 150px;
    }

    .information-disorder h1{
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-very-small);
        margin: 0px;
        padding: 0px;
        color: var(--black);
    }

    .information-disorder p{
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-very-very-very-small);
        word-spacing: var(--word-spacing-small);
        margin: 0px;
        padding: 0px;
        line-height: var(--line-height-small);
        color: var(--black);
        background-color: var(--white-transparent);
        box-shadow: var(--white-box-shadow);
    }

    img {
        width: 80px;
        padding: 0px;
        margin: 0px;
        height: auto;
        /* filter: brightness(0) invert(1); */
        opacity: 0.7;
    }

</style>