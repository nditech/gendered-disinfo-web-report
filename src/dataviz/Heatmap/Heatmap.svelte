<script>

    // properties
    export let lang;
    export let data;
    export let events;

    // ids of elements
    const uid = Math.round(Math.random()*1000.0);
    const heatmap_id = `heatmap-${uid}`;
    const tooltip_id = `heatmaptooltip-${uid}`;

    // import d3 stuff
    import * as d3 from 'd3';

    // UI lib
    import { onMount } from 'svelte';

    // import our scripts
    import { NBR_OF_TIME_STEPS } from './0-env.js';
    import { matrixify } from './1-preproc.js';
    import { draw, animate, clear } from './2-draw.js';

    onMount(async () => {

        // check
        if(!Array.isArray(data)) return;

        // convert to matrix
        const { matrix, source_mapping, time_scale, color_scale } = matrixify(data, NBR_OF_TIME_STEPS);

        // grab main
        const main = document.querySelector('main');
        
        // append svg object to the body
        const canvas = d3.select(`#${heatmap_id}`);

        // get tip info box
        const tooltip = d3.select(`#${tooltip_id}`);

        // get screen size
        const screen_height = window.screen.height;

        // draw
        const { svg } = draw(matrix, source_mapping, time_scale, color_scale, canvas, tooltip, events);
        let drawn = false;

        // animate
        main.addEventListener('scroll', () => {

            // get position of svg
            const { top, bottom } = svg.node().getBoundingClientRect()
            const height = bottom - top;

            if(top > -height/2.0 && top < 2*screen_height/3.0){
                if(!drawn){
                    drawn = true;
                    animate(svg)
                }
            }else{
                drawn = false;
                clear(svg);
            }
        })
    })
</script>

<div class="container">
    <div id="{heatmap_id}"></div>
    <div id="{tooltip_id}" class='tooltip'></div>
</div>

<style>

    .container {
        overflow: hidden;
    }

    #heatmap {
        margin: auto;
        text-align: center;
    }

</style>