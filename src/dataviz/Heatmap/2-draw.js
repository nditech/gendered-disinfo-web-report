'use strict'

// prompt lib
import swal from 'sweetalert'

// import d3
import * as d3 from 'd3';

// import env
import {
 canvas_width, canvas_height, words_width, margin, click_disabled,
    block_half_padding, text_left_padding, color_a, color_b, color_c, text_color, text_font_family
} from './0-env.js'

// import system lib
import { url_to_platform_type, post_to_interactions } from '../../libs/socialmedia.js';
import { isMobile } from '../../libs/system.js';

function capitalize (str) {
    const splitStr = str.toLowerCase().split(' ')
    for (let i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
    // Directly return the joined string
    return splitStr.join(' ')
}

/**
 * Create the text associated with the infobubble
 *
 * @param d               The data associated with the selected element
 */
function get_tooltip_text (d) {
    return `
        <h2>${d.source_name}</h2>
        <p><b>${d.data.length} ${d.data.length > 1 ? 'posts' : 'post'}</b></p>
        ${d.data.map(post => {
            const source_type = url_to_platform_type(post['url'])
            const interactions = post_to_interactions(post);
            return `<p>${post.published_at}: ${source_type}, ${interactions['name']}: ${(+interactions['count']).toLocaleString()}</p>`
        }).join('')}
    `
}

function convert_data_to_df (matrix, source_mapping, color_scales, block_w, font_size) {
    // convert sources to dataframe
    const sources_df = []
    const inv_source_mapping = {}
    Object.keys(source_mapping).forEach(source => {
        // grab index
        const index = +source_mapping[source]

        // inverse source mapping
        inv_source_mapping[index] = source

        // grab y pos
        const y = index * (block_w + block_half_padding)

        // push to df
        sources_df.push({
            row_id: index,
            y: y + font_size - block_half_padding,
            text: capitalize(source)
        })
    })

    // convert matrix to dataframe
    const matrix_df = []
    matrix.forEach((row, i) => {
        row.forEach((element, j) => {
            // get source name
            const source_name = inv_source_mapping[i]

            // init var
            let _color = color_a;
            let max_count = 0;

            if (element.length > 0){
                element.forEach(el => {
                    const count = post_to_interactions(el)['count'];
                    if(count > max_count){
                        max_count = count;
                        _color = color_scales[url_to_platform_type(el['url'])](count);
                    }
                })
            }

            matrix_df.push({
                row_id: i,
                source_name: source_name,
                x: j * (block_w + block_half_padding),
                y: i * (block_w + block_half_padding),
                width: block_w,
                height: block_w,
                fill: _color,
                value: element.length,
                data: element
            })
        })
    })

    return {
        matrix_df: matrix_df,
        sources_df: sources_df
    }
}

function get_max_text_width (g) {
    let max_text_width = 0.0
    g.selectAll('text').each(function (d) {
        const _max_text_width = this.getBoundingClientRect().width
        if (_max_text_width > max_text_width) {
            max_text_width = _max_text_width
        }
    })
    return max_text_width
}

function draw_legend (g, color_scale, block_w, font_size, heatmap_height) {
    // get max number of posts in one rectangles
    const max_nbr_of_posts = color_scale.domain()[color_scale.domain().length-1]

    // create rectangles to display
    let legend_df = [0, max_nbr_of_posts]
    if (max_nbr_of_posts > 5) {
        const val_step = max_nbr_of_posts / 5.0
        for (let i = 0; i < 5; i++) {
            legend_df.push(i * val_step)
        }
    } else {
        for (let i = 0; i < max_nbr_of_posts; i++) {
            legend_df.push(i)
        }
    }
    legend_df = [...new Set(legend_df)].sort((a, b) => a - b)

    // create text to display
    const legend_text = [
        {
            x: `-${font_size}px`,
            y: `${font_size - block_half_padding}px`,
            text: '0'
        }
    ]
    if (legend_df.length > 1) {
        const end_i = legend_df.length - 1
        const value = `${legend_df[end_i]}`

        legend_text.push({
            x: `${(end_i + 1) * (block_w + block_half_padding) + block_half_padding}px`,
            text: value
        })
    }

    // legend width with side text
    const legend_width = (legend_df.length + 2) * block_w

    // translate the group
    const current_x = +g.attr('transform').split('(')[1].split(',')[0]
    g.attr('transform', 'translate(' + (current_x - legend_width / 2.0) + ',8)')

    // draw legend rectangles
    g.selectAll('rect')
        .data(legend_df)
        .enter()
        .append('rect')
        .attr('x', (d, i) => `${i * (block_w + block_half_padding)}px`)
        .attr('y', `${margin.top + 32 + heatmap_height}px`)
        .attr('width', block_w)
        .attr('height', block_w)
        .attr('fill', d => color_scale(d))

    // draw legend text
    g.selectAll('text')
        .data(legend_text)
        .enter()
        .append('text')
        .attr('font-size', `${block_w}px`)
        .attr('font-family', 'Roboto-Mono')
        .attr('letter-spacing', '0.3')
        .style('fill', text_color)
        .attr('x', d => d.x)
        .attr('y', `${margin.top + heatmap_height + 32 + font_size - block_half_padding}px`)
        .text(d => d.text)
}

function draw_timeline (g, time_scale, block_w) {
    // format of the dates
    const dateformatter = d3.timeFormat('%y/%m');

    // create axis
    const time_axis = isMobile() ? d3.axisBottom(time_scale).tickFormat(dateformatter).ticks(5) : d3.axisBottom(time_scale).tickFormat(dateformatter);

    // draw the timeline axis
    const axis = g.attr('class', 'axis').call(time_axis)

    // font size
    axis.style("font-size", block_w);
}

export function draw (matrix, source_mapping, time_scale, color_scales, canvas, tooltip, events) {

    // set colors
    Object.keys(color_scales).forEach(color_scale_key => {
        color_scales[color_scale_key] = color_scales[color_scale_key].range([color_a, color_b, color_c]);
    })

    // get number of row and columns
    const nbr_of_cols = 1.0 * matrix[0].length
    const nbr_of_rows = 1.0 * Object.keys(source_mapping).length

    // get block size
    const _block_w = (1.0 * canvas_width) / nbr_of_cols
    const _block_h = (1.0 * canvas_height) / nbr_of_rows
    const block_w = Math.floor(Math.min(...[_block_w, _block_h])) - block_half_padding

    // get heatmap size
    const heatmap_width = (block_w + block_half_padding) * nbr_of_cols
    const heatmap_height = (block_w + block_half_padding) * nbr_of_rows

    // font values
    const font_size = block_w

    // reorganize our data into a drawable dataframe
    const { matrix_df, sources_df } = convert_data_to_df(matrix, source_mapping, color_scales, block_w, font_size)

    // create svg
    const svg = canvas.append('svg')
        .attr('width', canvas_width + words_width + margin.left + margin.right)
        .attr('height', canvas_height + margin.top + margin.bottom)

    // create group in which we will append our objects
    const rect_g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        
    const events_g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const text_g = svg.append('g')
        .attr('transform', 'translate(' + (margin.left + heatmap_width + text_left_padding) + ',' + (margin.top) + ')')

    // create the groups for the timeline
    const timeline_g = svg.append('g')
        .attr('transform', 'translate(' + (margin.left) + ',' + (margin.top + heatmap_height) + ')')

    // draw rectangles
    rect_g.selectAll('rect')
        .data(matrix_df)
        .enter()
        .append('rect')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .attr('fill', d => d.fill)
        .attr('stroke', d => d.fill)
        .attr('stroke-width', '0')
        .attr('cursor', d => {
            return d.value > 0 ? 'pointer' : 'default'
        })
        .on('mouseover', function(event, d){
            if (+d.value === 0) return
            tooltip.style('display', 'inline')
            tooltip.html(() => get_tooltip_text(d))

            d3.select(this).attr('stroke-width', 3)
        })
        .on('mousemove', (event) => {
            tooltip
                .style('left', `${event.pageX + 16}px`)
                .style('top', `${event.pageY + 16}px`)
        })
        .on('mouseout', function(){
            tooltip.style('display', 'none')

            d3.select(this).attr('stroke-width', 0)
        })
        .on('click', (_, d) => {
            if(isMobile()) return;

            // get urls
            const urls = d.data.map(p => p.url)

            // if no urls
            if(urls.length === 0) return;

            // prompt user to open urls
            swal({
                title: 'Open URLs',
                text: `Pressing ok will open ${urls.length} ${urls.length > 1 ? 'posts' : 'post'} as new tabs`
            }).then(value => {
                if (value) {
                    // open urls
                    for (let i = 0; i < urls.length; i++) {
                        window.open(urls[i], '_blank')
                    }
                }
            })
        })

    // draw source names
    text_g.selectAll('text')
        .data(sources_df)
        .enter()
        .append('text')
        .attr('font-size', `${block_w}px`)
        .attr('font-family', text_font_family)
        .style('fill', text_color)
        .attr('x', '0px')
        .attr('y', d => `${d.y}px`)
        .text(d => d.text)

    // get text max width
    const max_text_width = get_max_text_width(text_g)

    // compute displacement to center our dataviz
    const actual_dataviz_width = heatmap_width + text_left_padding + max_text_width

    // resize svg
    svg.attr('width', `${(actual_dataviz_width + margin.left + margin.right)}px`)
    svg.attr('height', `${(heatmap_height + margin.bottom + margin.top)}px`)

    // create the group for the legend
    const legend_g = svg.append('g')
        .attr('transform', 'translate(' + (margin.left + actual_dataviz_width/2.0) + ',8)')

    // draw legend
    // draw_legend(legend_g, color_scale, block_w, font_size, heatmap_height)

    // resize the time scale to fit the bottom of the heatmap
    const _time_scale = time_scale.copy()
    _time_scale.range([0, heatmap_width - block_half_padding])

    // draw timeline
    draw_timeline(timeline_g, _time_scale, block_w)

    // if we dont have events, stop here
    if(Array.isArray(events) && events.length > 0) {

        // filter events if outside of timeline
        const _events = events.filter(d => {
            const x_pos = _time_scale(new Date(d.date));
            return x_pos > 0 && x_pos < heatmap_width - block_half_padding;
        })

        // draw vertical red lines for each event
        events_g.selectAll('rect')
            .data(_events)
            .enter()
            .append('rect')
            .attr('x', d => {
                return `${_time_scale(new Date(d.date))}px`;
            })
            .attr('y', `0px`)
            .attr('width', '1px')
            .attr('height', `${heatmap_height}px`)
            .attr('fill', text_color)
            .attr('opacity', 0.0)

        events_g.selectAll('text')
            .data(_events)
            .enter()
            .append('text')
            .attr('font-size', `${block_w}px`)
            .attr('letter-spacing', '0.3')
            .attr('fill', text_color)
            .attr('font-family', text_font_family)
            .attr('x', '0px')
            .attr('y', `0px`)
            .attr('transform', (d,i) => {
                // TODO
                const adjust = (i === 2) ? -2 : -6;
                return `translate(${_time_scale(new Date(d.date)) - 2}, ${adjust}), rotate(-20)`;
            })
            .text(d => d.title)
            .attr('opacity', 0.0)
    }

    return {
        'svg': events_g
    }
}

export function animate(svg){
    svg.selectAll("rect")
        .transition()
        .duration(1000)
        .attr('opacity', 1.0)
        .delay((d, i) => {
            return i*100;
        })
    svg.selectAll("text")
        .transition()
        .duration(1000)
        .attr('opacity', 1.0)
        .delay((d, i) => {
            return i*100;
        })
}

export function clear(svg){
    svg.selectAll("rect")
        .attr('opacity', 0)
    svg.selectAll("text")
        .attr('opacity', 0)
}