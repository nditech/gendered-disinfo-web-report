<script>

    // properties
    export let onstart = false;

    // ui lib
    import { onMount } from "svelte";

    // displays the loader
    export function on(){
        document.getElementById('loader').style.display = 'inline-block';
    }

    // hides the loader
    export function off(){
        document.getElementById('loader').style.display = 'none';
    }

    onMount(() => {
        onstart ? on() : off()
    })

</script>

<div id="loader"></div>

<style>

    div {
        position: absolute;
        display: none;
        left: 50%;
        top: 50%;
        margin-left: -76px;
        margin-top: -76px;
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid var(--main-color); /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        z-index: 9;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

</style>