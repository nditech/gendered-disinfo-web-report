<script>

    // properties
    export let lang;
    export let data;
    export let title;
    export let max_interactions;

    // import d3
    import * as d3 from 'd3';

    // import ui lib
    import { onMount } from 'svelte';

    // import dataviz lib
    import { init, animate, clear } from './main.js';

    // create random ids for elements
    const dataviz_id = `dotmatrixplot-${Math.round(Math.random()*10000.0)}`;
    const tooltip_id = `dotmatrixtooltip-${Math.round(Math.random()*10000.0)}`;

    onMount(() => {

        // grab UI elements
        const canvas = d3.select(`#${dataviz_id}`);
        const tooltip = d3.select(`#${tooltip_id}`);

        // grab main
        const main = document.querySelector('main');

        // get screen size
        const screen_height = window.screen.height;

        // init
        const { svg } = init(data, canvas, tooltip, max_interactions, title);
        let drawn = false;

        // animate
        main.addEventListener('scroll', () => {

            // get position of svg
            const { top, bottom } = svg.node().getBoundingClientRect()
            const height = bottom - top;

            if(top > -height/2.0 && top < screen_height){
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
    <div id="{dataviz_id}"></div>
    <div id="{tooltip_id}" class='tooltip'></div>
</div>


<style>

    .container {
        text-align: left;
        overflow: hidden;
        margin-left: 32px;
    }

</style>