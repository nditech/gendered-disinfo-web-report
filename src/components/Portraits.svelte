<script>

    // properties
    export let data;

    // import ui lib
    import { onMount } from 'svelte';

    // import transition lib
    import { add_scroll_fade_transition } from '../libs/transition.js';

    onMount(() => {

        // grab parent div
        const elements = document.getElementById('portraits-container').getElementsByTagName('div');

        // apply transition to each
        for (let i = 0; i < elements.length; i++) {

            // dont apply to non-picture divs
            if(!elements[i].classList.contains('portraits')) continue;

            // add_scroll_fade_transition(elements[i], i*50);
        }
    })

</script>

<div id="portraits-container" class="container">
    {#each data as datum}
        <div class='portraits'>
            <img alt={datum['name']} src={datum['src']}>
            <h1>{datum['name']}</h1>
            <p>{datum['description']}</p>
            {@html datum['html']}
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

    .portraits{
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

    .portraits h1{
        font-weight: var(--font-bold);
        font-size: var(--font-size-very-small);
        color: var(--black);
        margin: 0px;
        padding: 0px;
        text-transform: capitalize;
    }

    .portraits p{
        font-weight: var(--font-normal);
        font-size: var(--font-size-very-very-very-small);
        color: var(--black);
        word-spacing: var(--word-spacing-small);
        margin: 0px;
        padding: 0px;
        line-height: var(--line-height-small);
    }

    img {
        width: 100px;
        padding: 0px;
        margin: 0px;
        height: auto;
        opacity: 0.6;
        filter: grayscale(100%);
        border-radius: 50%;
        border: 1px solid #000;
    }


</style>

