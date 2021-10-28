<script>

    // import ui lib
    import { onMount } from 'svelte';

    // import constants
    import { URL_PREFIX } from '../../constants.json'

    // import transition lib
    import { add_scroll_fade_transition } from '../../libs/transition.js';

    onMount(() => {

        // grab parent div
        const elements = document.getElementById('data-collection-container').getElementsByTagName('div');

        // apply transition to each
        for (let i = 0; i < elements.length; i++) {
            add_scroll_fade_transition(elements[i], i*100);
        }
    })

</script>


<div id="data-collection-container" class="container">
    <div class="data-collection">
        <img alt="institutions" src="{URL_PREFIX}/assets/explanatives/twitter.png">
        <h1>Twitter</h1>
    </div>
    <div class="data-collection">
        <img alt="politics" src="{URL_PREFIX}/assets/explanatives/facebook.png">
        <h1>Facebook</h1>
    </div>
    <div class="data-collection">
        <img alt="society" src="{URL_PREFIX}/assets/explanatives/youtube.png">
        <h1>Youtube</h1>
    </div>
    <div class="data-collection">
        <img alt="society" src="{URL_PREFIX}/assets/explanatives/telegram.png">
        <h1>Telegram</h1>
    </div>
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

    .data-collection{
        margin: 0px;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 16px;
        padding-bottom: 16px;
        display: inline-block;
        align-items: center;
        text-align: center;
        max-width: 200px;
    }

    .data-collection h1{
        font-weight: var(--font-normal);
        font-size: var(--font-size-very-small);
        color: var(--black);
        margin: 0px;
        padding: 0px;
    }

    img {
        width: 60px;
        padding: 0px;
        margin: 0px;
        height: auto;
        opacity: 1.0;
    }


</style>