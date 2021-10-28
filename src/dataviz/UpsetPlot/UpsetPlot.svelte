<script>

    // properties
    export let lang;
    export let data;

    // UI
    import { onMount } from 'svelte';

    // import d3
    import * as d3 from 'd3';

    // libs
    import { drawUpset } from './2-draw.js';


    // load
    onMount(async () => {

        // grab UI elements
        const canvas = d3.select('#upsetplot');
        const tooltip = d3.select('#upsettooltip');

        // draw
        drawUpset(canvas, data, tooltip)
    })

</script>

<div id="upsetplot"></div>
<div id="upsettooltip" class="tooltip"></div>

<style>

</style>