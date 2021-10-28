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


<div id="container">
    <div id="lexiconcanvas"></div>
</div>


<style>

    #container {
        margin: auto;
        max-width: 300px;
        height: 150px;
        margin-top: 32px;
        overflow-y:hidden;
    }

</style>