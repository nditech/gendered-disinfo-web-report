'use strict';

// import constants
import { DEFAULT_LAT, DEFAULT_LNG, DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, MAP_STYLE, MAP_ATTRIBUTION } from './env.js';

// import libs
import * as L from 'leaflet';
import * as d3 from 'd3';


export function initMap(){

    // Grab Map
    const map = L.map('map', {
        worldCopyJump: true
    })

    // Initialize the background map and the initial position
    L.tileLayer(
        MAP_STYLE, {
            maxZoom: MAX_ZOOM,
            minZoom: MIN_ZOOM,
            attribution: MAP_ATTRIBUTION
        }
    ).addTo(map)

    // Set the map's initial position
    map.setView([DEFAULT_LAT, DEFAULT_LNG], DEFAULT_ZOOM)

    // Get map size
    const { x, y } = map.getSize();

    // Initialize the SVG context that will host the Leaflet map.
    const svg = d3.select(map.getPanes().overlayPane).append('svg')
                    .attr('width', x)
                    .attr('height', y);

    // set the svg style
    svg.attr("overflow","overlay");

    // Initialize the group in wich we draw our objects
    const g = svg.append("g").attr("class", "leaflet-zoom-hide");

    return {
        'svg': svg,
        'map': map,
        'g': g
    }
}

export function getProjection(map){

    // projects a point in the map referential
    function projectPoint (x, y) {
        const point = map.latLngToLayerPoint(new L.LatLng(y, x))
        this.stream.point(point.x, point.y)
    }

    // create mapping
    return d3.geoPath(d3.geoTransform({ point: projectPoint }));
}


export function drawPaths(g, projection, paths, tooltip, tooltiptext, onclick){

    // draw boundaries
    g.selectAll('path')
        .data(paths)
        .enter()
        .append('path')
        .attr('d', projection)
        .attr("style", "pointer-events: auto") // pointer event is disabled by default

    // set tooltip
    if(typeof(tooltiptext) === 'function'){
        g.selectAll('path')
            .on('mouseover', (_, d) => {
                const html = tooltiptext(d);
                if(html === null) return;
                tooltip.style('display', 'inline');
                tooltip.html(html);
            })
            .on('mousemove', (event) => {
                tooltip
                    .style('left', `${event.pageX + 8}px`)
                    .style('top', `${event.pageY + 8}px`);
            })
            .on('mouseout', () => {
                tooltip.style('display', 'none');
            })
    }

    // on click
    if(typeof(onclick) === 'function'){
        g.selectAll('path')
            .on('click', function(_, d){
                d3.select(this).classed('clicked', !d3.select(this).classed('clicked'));
                onclick();
            })
    }
}


export function drawCircles(g, map, circles, tooltip, tooltiptext, onclick){

    // draw boundaries
    g.selectAll('circle')
        .data(circles)
        .enter()
        .append('circle')
        .attr('cx', d => {
            return map.latLngToLayerPoint(new L.LatLng(d['lat'], d['lng'])).x;
        })
        .attr('cy', d => {
            return map.latLngToLayerPoint(new L.LatLng(d['lat'], d['lng'])).y;
        })
        .attr('r', '20px')
        .attr("style", "pointer-events: auto") // pointer event is disabled by default

    // set tooltip
    if(typeof(tooltiptext) === 'function'){
        g.selectAll('circle')
            .on('mouseover', (_, d) => {
                const html = tooltiptext(d);
                if(html === null) return;
                tooltip.style('display', 'inline');
                tooltip.html(html);
            })
            .on('mousemove', (event) => {
                tooltip
                    .style('left', `${event.pageX + 8}px`)
                    .style('top', `${event.pageY + 8}px`);
            })
            .on('mouseout', () => {
                tooltip.style('display', 'none');
            })
    }

    // on click
    if(typeof(onclick) === 'function'){
        g.selectAll('circle')
            .on('click', function(_, d){
                d3.select(this).classed('clicked', !d3.select(this).classed('clicked'));
                onclick();
            })
    }
}


export function highlightPaths(g, regions){
    if(regions.length === 0) return;

    g.selectAll('path')
        .classed('highlight', d => {
            return regions.filter(([key, val], _) => {
                return d['properties'][key] === val
            }).length > 0
        })
}


export function updateMap (map, g, projection, paths, circles) {
    if(Array.isArray(paths) && paths.length > 0){
        g.selectAll('path').attr('d', projection)
    }
    if(Array.isArray(circles) && circles.length > 0){
        g.selectAll('circle')
        .attr('cx', d => {
            return map.latLngToLayerPoint(new L.LatLng(d['lat'], d['lng'])).x;
        })
        .attr('cy', d => {
            return map.latLngToLayerPoint(new L.LatLng(d['lat'], d['lng'])).y;
        })
        .attr('r', map.getZoom())
    }
}
