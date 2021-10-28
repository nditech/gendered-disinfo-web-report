'use strict';

// import d3
import * as d3 from 'd3';

// system lib
import { isMobile } from '../../libs/system.js';

// import env
import { width, margin,
        block_width, block_padding,
        color_a, color_b, color_c } from './env.js';


function get_tooltip_text(d){
    return `
    <h2>${d['source_name']}</h2>
    <p>Platform: ${d['source_type']}</p>
    <p>Reactions: ${(+d['reactions']).toLocaleString()}</p>
    `;
}

export function init(data, canvas, tooltip, max_reactions, title){

    // compute height
    const height = Math.floor(data.length*block_width/width)*block_width + block_width;

    // create svg
    const svg = canvas.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    // sort posts
    data.sort((a, b) => b['reactions'] - a['reactions']);

    // create a d3 color scale
    const color_scale = d3.scaleLinear().domain([-max_reactions/20.0, max_reactions, Math.round(Math.ceil(max_reactions/1000.0)*1000.0)]).range([color_a, color_b, color_c])

    // create group in which we will append our objects
    const rect_g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const title_g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',0)')

    // draw title
    title_g.append('text')
        .attr('x', '0px')
        .attr('y', '20px')
        .attr('text-anchor', 'start')
        .attr('fill', '#444')
        .text(title);


    // draw rectangles
    rect_g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', '0px')
        .attr('y', '0px')
        .attr('width', `${block_width-block_padding}px`)
        .attr('height', `${block_width-block_padding}px`)
        .attr('fill', d => color_scale(d['reactions']))
        .attr('stroke-width', '0px')
        .attr('stroke', d => color_scale(d['reactions']))
        .attr('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            if (+d.value === 0) return
            tooltip.style('display', 'inline')
            tooltip.html(() => get_tooltip_text(d))

            d3.select(this).attr('stroke-width', '4px')
        })
        .on('mousemove', (event) => {
            tooltip
                .style('left', `${event.pageX + 16}px`)
                .style('top', `${event.pageY + 16}px`)
        })
        .on('mouseout', function() {
            tooltip.style('display', 'none')

            d3.select(this).attr('stroke-width', '0px')
        })
        .on('click', (_, d) => {
            if(isMobile()) return;
            window.open(d['url'], '_blank')
        })

    return {
        'svg': rect_g
    }
}

export function animate(rect_g){
    rect_g.selectAll('rect')
        .transition()
        .duration(1000)
        .attr('x', (d, i) => `${i*block_width % width}px`)
        .attr('y', (d, i) => `${Math.floor(i*block_width/width)*block_width}px`)
}

export function clear(rect_g){
    rect_g.selectAll('rect')
        .attr('x', '0px')
        .attr('y', '0px')
}