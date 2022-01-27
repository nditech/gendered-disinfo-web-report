<script>

    // import ui lib
    import { onMount } from "svelte";

    // properties
    export let posts;

    // animate
    const delay_in_ms = 4000;
    let pointer = -1;


    onMount(() => {

        // grab canvas
        const el = document.getElementById('lexiconcanvas');

        // update function
        function update_post(){

            // increment pointer
            pointer = (pointer + 1) % posts.length;

            // set html
            el.innerHTML = posts[pointer]
            el.style.lineHeight = '1.2em';
            el.style.fontSize = '0.9em';

            // set transition
            el.className = 'fade-in';

            // set transition
            setTimeout(() => {
                el.className = 'fade-out';
            }, delay_in_ms-1000);

            // repeat
            setTimeout(() => {
                update_post();
            }, delay_in_ms);
        }

        // start
        update_post();
    })


</script>


<div id="lexicon-container">
    <div id="lexicon-vertical-center">
        <div id="lexiconcanvas"></div>
    </div>
</div>


<style>

    #lexicon-container {
        position: relative;
        margin: 0px auto;
        max-width: 300px;
        height: 200px;
    }

    #lexicon-vertical-center {
        position: absolute;
        margin: 0;
        top: 50%;
        left: 50%;
        width: 100%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        overflow-y:hidden;
        text-align: center;
    }

</style>