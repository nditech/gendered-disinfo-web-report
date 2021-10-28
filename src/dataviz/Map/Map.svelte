<script>

    // --- Import Libs ---
    import * as d3 from 'd3';
    import { onMount } from 'svelte';

    // map styles
    import "../../../node_modules/leaflet/dist/leaflet.css";


    // --- Properties ---
    // data
    export let circles;
    export let paths;

    export let highlighted_paths;

    // interactivity
    export let tooltiptext;
    export let onclick;


    // --- Import Functions ---
    import { updateMap, getProjection, initMap, drawPaths, drawCircles } from './main.js';

    // local tooltip text
    const _tooltiptext = typeof(tooltiptext) === 'function' ? function(d){
        return tooltiptext(d);
    } : null;

    // local onclick listener
    const _onclick = typeof(onclick) === 'function' ? () => {
        let data = [];
        d3.selectAll('.clicked').each(d => { data.push(d) })
        onclick(data);
    } : null;


    // Wait for DOM to be loaded
    onMount(() => {

        // initialize map
        const { map, svg, g } = initMap();

        // grab tooltip
        const tooltip = d3.select('#maptooltip');

        // get projection
        const projection = getProjection(map);

        // if we have circles
        if(Array.isArray(circles) && circles.length > 0){
            drawCircles(g, map, circles, tooltip, _tooltiptext, _onclick);
        }

        // if we have paths
        if(Array.isArray(paths) && paths.length > 0){
            drawPaths(g, projection, paths, tooltip, _tooltiptext, _onclick);
        }

        // if we have highlighted paths
        if(Array.isArray(paths) && paths.length > 0 && Array.isArray(highlighted_paths) && highlighted_paths.length > 0){
            g.selectAll('path').classed('highlight', d => {
                for(let i=0 ; i<highlighted_paths.length ; i++){
                    if(d['properties'][highlighted_paths[i][0]] === highlighted_paths[i][1]) return true;
                }
                return false;
            })
        }

        // add listener to update map on zoom event
		map.on("zoom", () => {
            updateMap(map, g, projection, paths, circles);
        });
		updateMap(map, g, projection, paths, circles);
    });
</script>

<div id="map"></div>
<div id="maptooltip" class='tooltip'></div>

<style>

    #map {
        position: relative;
        width: 800px;
        height: 400px;
        margin: 16px auto;
        background-color: #eee;
        overflow: hidden;
        z-index: 0;
	    border: 1px solid rgb(0, 0, 0);
        box-shadow: 0px 2px 5px rgba(0, 0, 0, .5);
    }

    :global(path) {
        fill-opacity: 0.0;
        fill: rgba(51, 51, 51);
        stroke: rgba(51, 51, 51, 0.3);
        stroke-width: 1px;
    }

    :global(path.highlight){
        fill: var(--main-color);
        stroke:var(--main-color);
        stroke-width: 3px;
    }

    :global(path:hover) {
        fill-opacity: 0.15;
    }

    :global(path.clicked){
        fill-opacity: 0.5;
    }
</style>
