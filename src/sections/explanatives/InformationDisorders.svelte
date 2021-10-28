<script>

    // import ui lib
    import { onMount } from 'svelte';

    // import constants
    import { URL_PREFIX } from '../../constants.json'

    // import transition lib
    import { add_scroll_fade_transition } from '../../libs/transition.js';

    onMount(() => {

        // grab parent div
        const elements = document.getElementById('information-disorder-container').getElementsByTagName('div');

        // apply transition to each
        for (let i = 0; i < elements.length; i++) {
            add_scroll_fade_transition(elements[i], i*100);
        }
    })

</script>


<div id="information-disorder-container" class="container">
    <div class="information-disorder">
        <img alt="satire" src="{URL_PREFIX}/assets/explanatives/satire.png">
        <h1>Satire or Parody</h1>
        <p>The use of humor, irony, exaggeration, or ridicule to expose and criticize. Has the potential to fool.</p>
    </div>
    <div class="information-disorder">
        <img alt="misleading content" src="{URL_PREFIX}/assets/explanatives/misleading_content.png">
        <h1>Misleading Content</h1>
        <p>Misleading use of information to frame an issue or individual</p>
    </div>
    <div class="information-disorder">
        <img alt="imposter content" src="{URL_PREFIX}/assets/explanatives/imposter_content.png">
        <h1>Imposter Content</h1>
        <p>When genuine sources are impersonated</p>
    </div>
    <div class="information-disorder">
        <img alt="fabricated content" src="{URL_PREFIX}/assets/explanatives/fabricated_content.png">
        <h1>Fabricated Content</h1>
        <p>New content is 100% false, designed to deceive and do harm</p>
    </div>
    <div class="information-disorder">
        <img alt="false connection" src="{URL_PREFIX}/assets/explanatives/false_connection.png">
        <h1>False Connection</h1>
        <p>When headlines, visuals or captions don't support the content</p>
    </div>
    <div class="information-disorder">
        <img alt="false context" src="{URL_PREFIX}/assets/explanatives/false_context.png">
        <h1>False Context</h1>
        <p>When genuine content is shared with contextual information</p>
    </div>
    <div class="information-disorder">
        <img alt="manipulated content" src="{URL_PREFIX}/assets/explanatives/manipulated_content.png">
        <h1>Manipulated Content</h1>
        <p>When genuine information or imagery is manipulated to deceive</p>
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
        font-weight: var(--font-bold);
        font-size: var(--font-size-very-small);
        color: var(--black);
        margin: 0px;
        padding: 0px;
    }

    .information-disorder p{
        font-weight: var(--font-normal);
        font-size: var(--font-size-very-very-very-small);
        color: var(--black);
        word-spacing: var(--word-spacing-small);
        margin: 0px;
        padding: 0px;
        line-height: var(--line-height-small);
    }

    img {
        width: 80px;
        padding: 0px;
        margin: 0px;
        height: auto;
        opacity: 0.6;
    }

</style>