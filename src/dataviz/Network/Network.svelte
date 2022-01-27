<script>

    // properties
    export let lang;
    export let nodes;
    export let vertices;

    // import d3 stuff
    import * as d3 from 'd3';

    // UI lib
    import { onMount } from 'svelte';

    // graph lib
    import { Graph } from './Graph/Graph.js';

    // ids
    const uid = Math.round(Math.random()*1000.0);
    const network_id = `network-${uid}`;
    const networktooltip_id = `networktooltip-${uid}`;

    // Graph
    let graph = null;
    let canvas;
    let tooltip;

    onMount(async () => {

        // get div object
        canvas = d3.select(`#${network_id}`);

        // get tip info box
        tooltip = d3.select(`#${networktooltip_id}`);
    })

    $: if(nodes, vertices){
        if(graph === null){
            graph = new Graph(nodes, vertices, canvas, tooltip);
        }else{
            graph.update(nodes, vertices);
        }
    }

</script>

<div class="container">
    <div id="{network_id}"></div>
    <div id="{networktooltip_id}" class='tooltip'></div>
</div>


<style>

    .container {
        overflow: hidden;
        text-align: center;
    }

    #network {
        margin: auto;
        text-align: center;
    }

</style>
