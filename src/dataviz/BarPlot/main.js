'use strict'

// import d3
import * as d3 from 'd3';

// import env
import { width, height, margin } from './env.js';

function get_tooltip_text(d){
    return `
    <h2>${d['name']}</h2>
    <p>Number of social media posts : ${d['value']}</p>
    `;
}

export function init(data, canvas, tooltip) {

    // append the svg object to the body of the page
    var svg = canvas.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d['name']; }))
        .padding(0.2);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, Math.round(1.1*Math.max(...data.map(d => d['value'])))])
        .range([ height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr('class', 'myrect')
        .attr("x", d => { return x(d['name']); })
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .on('mouseover', (event, d) => {
            if (+d.value === 0) return
            tooltip.style('display', 'inline')
            tooltip.html(() => get_tooltip_text(d))
        })
        .on('mousemove', (event) => {
            tooltip
                .style('left', `${event.pageX + 16}px`)
                .style('top', `${event.pageY + 16}px`)
        })
        .on('mouseout', () => {
            tooltip.style('display', 'none')
        })
        .attr('opacity', 0.7);

    return {
        'y': y,
        'svg': svg
    }
}

export function animate(svg, y){
    svg.selectAll("rect")
        .transition()
        .duration(2000)
        .attr("y", d => { return y(d['value']); })
        .attr("height", d => { return height - y(d['value']); })
}

export function clear(svg){
    svg.selectAll("rect")
        .attr("y", height)
        .attr("height", 0)
}