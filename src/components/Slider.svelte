<script>

    // properties
    export let options;
    export let previous_callback;
    export let next_callback;

    // import ui lib
    import { onMount } from "svelte";

    // import constants
    import { URL_PREFIX } from '../constants.json';

    // displayed
    let pointer = -1;
    let title = '';

    // on click
    function previous(){

        // check if we can decrement
        if(pointer - 1 < 0) return;

        // decrement
        pointer = pointer - 1;

        // change option
        title = options[pointer]['value'];

        // trigger callback
        previous_callback(options[pointer]['key']);
    }

    function next(){

        // check if we can increment
        if(pointer + 1 >= options.length) return;

        // increment
        pointer = pointer + 1;

        // change option
        title = options[pointer]['value'];

        // trigger callback
        next_callback(options[pointer]['key']);
    }

    onMount(() => {

        // run checks
        if([...new Set(options)].length !== options.length){
            console.error('duplicates in slider options');
        }

        next();
    })

</script>

<div class='buttons'>
    <img alt="previous" src='{URL_PREFIX}/assets/imgs/previous.png' on:click={() => { previous(); }}>
    <h1>{title}</h1>
    <img alt="next" src='{URL_PREFIX}/assets/imgs/next.png' on:click={() => { next(); }}>
</div>

<style>

    h1 {
        margin: auto;
        padding: 0px;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-small);
        text-transform: capitalize;
    }

    img {
        width: 48px;
        cursor: pointer;
        opacity: 0.6;
    }

    img:hover {
        opacity: 0.2;
    }

    div.buttons {
        display: flex;
        margin: auto;
        display:flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        max-width: var(--max-width-small);
        text-align: center;
        margin-bottom: 32px;
        margin-top: 32px;
    }

</style>