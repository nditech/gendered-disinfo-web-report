<script>

    // properties
    export let lang;
    export let data;

    // UI
    import { onMount } from 'svelte';

    // import d3
    import * as d3 from 'd3';

    // libs
    import { init, clear, animate } from './main.js';

    // load
    onMount(async () => {

        // grab UI elements
        const canvas = d3.select('#barplot');
        const tooltip = d3.select('#barplottooltip')

        // get screen size
        const screen_height = window.screen.height;

        // init
        const { svg, y } = init(data, canvas, tooltip)
        let drawn = false;

        // animate
        window.addEventListener('scroll', () => {

            // get position of svg
            const { top, bottom } = svg.node().getBoundingClientRect()
            const height = bottom - top;

            if(top > -height/2.0 && top < 2*screen_height/3.0){
                if(!drawn){
                    drawn = true;
                    animate(svg, y)
                }
            }else{
                drawn = false;
                clear(svg);
            }
        })
    })

</script>


<div class="container">
    <div id="barplot"></div>
    <div id="barplottooltip" class='tooltip'></div>
</div>

<style>

    .container {
        overflow: hidden;
    }

    :global(.myrect) {
        fill: var(--main-color)
    }

</style>