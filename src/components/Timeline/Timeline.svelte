<script>

    // properties
    export let min_date;
    export let max_date;
    export let ondrag;
    export let ondragend;
    let timeline;

    // import d3 stuff
    import * as d3 from 'd3';

    // UI lib
    import { onMount } from 'svelte';

    // func lib
    import { remove_px } from './libs.js';
    import { Slider } from './Slider.js';
    import { Timeline } from './Timeline.js';

	// timeline date formatter
	var dateformatter = d3.timeFormat("%y/%m");

    // function to read the dates
    export function get_dates(){
        return timeline.getDates();
    }

    export function freeze(){
        timeline.freeze();
    }

    export function unfreeze(){
        timeline.unfreeze();
    }

    onMount(() => {

        // Time Sliders
        var track = d3.select("#track");
        var slider_1_el = d3.select("#slider_1");
        var slider_2_el = d3.select("#slider_2");

        // Set the Timeline's attributes
        const timelineWidth = remove_px(track.style("width"));
        const timelineHeight = remove_px(track.style("height"));

        // Scales
        var timelineScale = d3.scaleTime().range([0, timelineWidth]);
        var timelineAxis = d3.axisBottom(timelineScale).ticks(d3.timeMonth).tickFormat(dateformatter);

        // We initiate the timeline html object
        var trackSvg = track.select("svg")    // we grab the SVG object inside of the track html object
            .attr("width", timelineWidth)       // set the width and height
            .attr("height", timelineHeight);

        // Set the scale
        timelineScale.domain([min_date, max_date]);

		// Set the timeline axis
		trackSvg.append("g")
			.attr("class", "axis")
			.call(timelineAxis);

        // create line between sliders
        var connector = track.select("svg")
            .append("g")
            .append("rect")
			.attr("class", "connector")
            .attr("y", "9px")
            .attr("height", "8px")

        // init an instance of the sliders
        const slider_1 = new Slider(slider_1_el, track, timelineScale);
        const slider_2 = new Slider(slider_2_el, track, timelineScale);

        // init an instance of the timeline
        timeline = new Timeline(slider_1, slider_2, connector, track, ondrag, ondragend);

        // init sliders to arbitrary position
        slider_1.setXPos(timelineWidth*0.05);
        slider_2.setXPos(timelineWidth*0.95);
        timeline.redrawConnector();
    })


</script>

<div id="timeline">
    <div id="track">
        <svg></svg>
        <div id="slider_1" class="slider">
            <p></p>
        </div>
        <div id="slider_2" class="slider">
            <p></p>
        </div>
    </div>
</div>


<style>

    #timeline {
        position: absolute;
        left: 0;
        right: 0;
        height: 100px;
        display: flex;
        justify-content: center;
        line-height: initial;
    }

    #track {
        position: relative;
        background-color: #eee;
        border: 1px solid rgb(0, 0, 0);
        width: 70%;
        height: 25px;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, .3);
        line-height: initial;
    }

    .slider {
        position: absolute;
        background-color: rgba(255,255,255,1);
        border: 1px solid rgb(0, 0, 0);
        border-radius: 6px;
        cursor: pointer;
        width: 15px;
        height: 45px;
        margin-top: -40px;
    }

    .slider p{
        position: relative;
        top: 36px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        left: -44px;
        width: 100px;
    }

    :global(.connector) {
        fill: rgba(255,255,255,1);
        stroke: rgb(0, 0, 0);
        stroke-width: 1px;
        opacity : 1.0;
        cursor: pointer;
    }

    :global(#track .axis) {
        shape-rendering: crispEdges;
        font-size: 12px;
    }

    :global(#track .axis line) {
        display: block;
    }

    :global(#track .axis path) {
        display: none;
    }

</style>