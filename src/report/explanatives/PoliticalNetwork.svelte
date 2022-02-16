<script>


    // properties
    export let lang;

    // import config
    import { SUBDIRECTORY } from '../../config.json';

    // import strings
    import { political_networks } from '../../strings.json';

</script>


<div id="political-network-container" class="container">
    {#each political_networks as political_network}
        <div class="political-network">
            <img alt="{political_network['src'].split('.').pop()}" src="{SUBDIRECTORY}assets/images/{political_network['src']}">
            <h1>{political_network['title'][lang]}</h1>
            {#each political_network['description'][lang] as el}
                <p>{el}</p>
            {/each}
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

    .political-network{
        margin: 0px;
        padding: 32px;
        display: inline-block;
        align-items: center;
        text-align: center;
        max-width: 220px;
    }

    .political-network h1{
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-very-small);
        margin: 0px;
        padding: 0px;
        color: var(--black);
    }

    .political-network p{
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
        height: 80px;
        width: auto;
        padding: 4px;
        margin: 0px;
        /* filter: brightness(0) invert(1); */
        opacity: 0.7;
    }

</style>