'use strict';

// import env
import { margin, plot_height, line_width, padding_between_plot_and_labels, bar_width, words_width,
    circle_radius, circles_padding, labels_text_left_padding, color_true, color_false } from './0-env.js';

// import from lib
import { generateBinaryStates } from './libs.js';

// import d3
import * as d3 from 'd3';



function get_tooltip_text (value) {
    return `
        <p><b>${value}</b> ${value > 1 ? 'posts' : 'post'}</p>
    `
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


export function drawUpset(canvas, dataframe, tooltip){

    // get all unique labels
    const labels = [...new Set([].concat.apply([], dataframe.map(d => d['sets'])))];

    // create all the binary combinations for our number of labels
    const all_binary_states = generateBinaryStates(labels.length);

    // create a mapping of the binary to a set
    const binary_mapping = {}
    all_binary_states.forEach(binary => {
        binary_mapping[binary] = binary.split('').map((d,i) => d === '0' ? '' : labels[i]).filter(d => d !== '')
    })

    // update binary for our dataframe
    dataframe.forEach(datum => {

        // init binary state
        let binary = new Array(labels.length).fill(0)

        // set binary state
        datum['sets'].forEach(key => {
            const index = labels.indexOf(key);
            if(index === -1) return;
            binary[index] = 1;
        })

        // convert to string
        binary = binary.join('')

        // update
        datum['binary'] = binary;
    })

    // get the number of labels
    const nbr_of_labels = labels.length;
    const nbr_of_labels_combinations = 2**nbr_of_labels;

    // get the full dataviz dimensions
    const plot_width = (circle_radius*2 + circles_padding*2)*nbr_of_labels_combinations;
    const height = plot_height + padding_between_plot_and_labels + (circle_radius*2 + circles_padding*2)*nbr_of_labels;
    const width = plot_width + labels_text_left_padding + words_width

    // create svg
    const svg = canvas.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    // create groups in which we will append our objects
    const barplot_g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const barplot_axis_g = svg.append('g')
        .attr('transform', 'translate(' + (margin.left + plot_width) + ',' + (margin.top) + ')')

    const labels_circles_g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top + plot_height + padding_between_plot_and_labels) + ')')

    const labels_texts_g = svg.append('g')
        .attr('transform', 'translate(' + (margin.left + plot_width + labels_text_left_padding) + ',' + (margin.top + plot_height + padding_between_plot_and_labels) + ')')


    // compute barplot data
    let barplot_df = [];
    dataframe.forEach(datum => {

        // find index
        let binary_states_index = -1;
        for(let i=0 ; i<all_binary_states.length ; i++){
            if(all_binary_states[i] === datum['binary']){
                binary_states_index = i;
                break;
            }
        }

        // push
        barplot_df.push({
            'binary_states_index': binary_states_index,
            'size': datum['size'],
            'sets': datum['sets'],
            'x': `${binary_states_index*(circle_radius*2 + circles_padding*2) + circles_padding + circle_radius - bar_width/2.0}px`,
            'width': `${bar_width}px`,
            'binary': datum['binary']
        })
    })

    // get max size
    const max_size = Math.max(...barplot_df.map(d => d['size']));

    // create a scale
    const scale = d3.scaleLinear().range([plot_height, 0]).domain([0, max_size*1.05])

    // create axis
    const axis = d3.axisRight(scale)

    // draw bars
    barplot_g.selectAll('rect')
        .data(barplot_df)
        .enter()
        .append('rect')
        .attr('cursor', 'pointer')
        .attr('x', d => d['x'])
        .attr('y', d => `${scale(d['size'])}px`)
        .attr('width', d => d['width'])
        .attr('height', d => `${plot_height - scale(d['size'])}px`)
        .attr('fill', color_true)
        .on('mouseover', (event, d) => {
            tooltip.style('display', 'inline')
            tooltip.html(() => get_tooltip_text(d.size))

            // show / hide labels
            barplot_g.selectAll('rect').attr('opacity', (rect_d) => {
                return d['binary'] === rect_d['binary'] ? 1.0 : 0.3
            })
            labels_circles_g.selectAll('circle').attr('opacity', circle_d => {
                return d['binary'] === circle_d['binary'] ? 1.0 : 0.3
            })
            labels_circles_g.selectAll('rect').attr('opacity', rect_d => {
                return d['binary'] === rect_d ? 1.0 : 0.0
            })
            labels_texts_g.selectAll('text').attr('opacity', text_d => {
                return d['sets'].includes(text_d) ? 1.0 : 0.3
            })
        })
        .on('mousemove', (event) => {
            tooltip
                .style('left', `${event.pageX + 16}px`)
                .style('top', `${event.pageY + 16}px`)
        })
        .on('mouseout', () => {
            tooltip.style('display', 'none')

            barplot_g.selectAll('rect').attr('opacity', 1.0);
            labels_circles_g.selectAll('circle').attr('opacity', 1.0);
            labels_circles_g.selectAll('rect').attr('opacity', 1.0);
            labels_texts_g.selectAll('text').attr('opacity', 1.0);
        })

    // draw axis
    barplot_axis_g.attr('class', 'axis').call(axis)
    barplot_axis_g.append('rect')
        .attr('x', `-${width}px`)
        .attr('y', `${plot_height-0.5}px`)
        .attr('width', `${width}px`)
        .attr('height', '1px')
        .attr('fill', '#000')



    // build circles dataframe
    let circles_df = [];
    for(let j=0 ; j<all_binary_states.length ; j++){
        for(let i=0 ; i<labels.length ; i++){
            circles_df.push({
                'cx': `${j*(circle_radius*2 + circles_padding*2) + circles_padding + circle_radius}px`,
                'cy': `${i*(circle_radius*2 + circles_padding*2) + circles_padding + circle_radius}px`,
                'value': +all_binary_states[j][i] === 1,
                'binary': all_binary_states[j],
                'sets': binary_mapping[all_binary_states[j]]
            })
        }
    }

    // draw labels circles
    labels_circles_g.selectAll('circle')
        .data(circles_df)
        .enter()
        .append('circle')
        .attr('cursor', 'pointer')
        .attr('cx', d => d['cx'])
        .attr('cy', d => d['cy'])
        .attr('r', `${circle_radius}px`)
        .attr('fill', d => d['value'] ? color_true : color_false)
        .on('mouseover', (event, d) => {

            // get the barplot datum for this
            const barplot_datum = barplot_df.filter(datum => datum['binary'] === d['binary'])[0];
            const size = barplot_datum !== undefined ? barplot_datum['size'] : 0;

            // display tooltip
            tooltip.style('display', 'inline')
            tooltip.html(() => get_tooltip_text(size))

            // show / hide labels
            barplot_g.selectAll('rect').attr('opacity', rect_d => {
                return d['binary'] === rect_d['binary'] ? 1.0 : 0.3
            })
            labels_circles_g.selectAll('circle').attr('opacity', circle_d => {
                return d['binary'] === circle_d['binary'] ? 1.0 : 0.3
            })
            labels_circles_g.selectAll('rect').attr('opacity', rect_d => {
                return d['binary'] === rect_d ? 1.0 : 0.0
            })
            labels_texts_g.selectAll('text').attr('opacity', text_d => {
                return d['sets'].includes(text_d) ? 1.0 : 0.3
            })
        })
        .on('mousemove', (event) => {
            tooltip
                .style('left', `${event.pageX + 16}px`)
                .style('top', `${event.pageY + 16}px`)
        })
        .on('mouseout', () => {
            tooltip.style('display', 'none')

            barplot_g.selectAll('rect').attr('opacity', 1.0);
            labels_circles_g.selectAll('circle').attr('opacity', 1.0);
            labels_circles_g.selectAll('rect').attr('opacity', 1.0);
            labels_texts_g.selectAll('text').attr('opacity', 1.0);
        })


    // draw labels connecting lines
    labels_circles_g.selectAll('rect')
        .data(all_binary_states)
        .enter()
        .append('rect')
        .attr('cursor', 'pointer')
        .attr('fill', color_true)
        .attr('x', (d, i) => {
            return `${i*(circle_radius*2 + circles_padding*2) + circles_padding + circle_radius - line_width/2.0}px`
        })
        .attr('y', d => {
            const firstIndex = d.indexOf('1');
            if(firstIndex === -1) return '0px';
            return `${firstIndex*(circle_radius*2 + circles_padding*2) + circles_padding + circle_radius}px`;
        })
        .attr('width', `${line_width}px`)
        .attr('height', d => {
            const firstIndex = d.indexOf('1');
            const lastIndex = d.lastIndexOf('1');

            if(firstIndex === -1) return '0px';
            if(firstIndex === lastIndex) return '0px';

            const startY = firstIndex*(circle_radius*2 + circles_padding*2) + circles_padding + circle_radius;
            const endY = lastIndex*(circle_radius*2 + circles_padding*2) + circles_padding + circle_radius;

            return `${endY - startY}px`
        })
        .on('mouseover', (event, binary) => {

            // get the barplot datum for this
            const barplot_datum = barplot_df.filter(datum => datum['binary'] === binary)[0];
            const size = barplot_datum !== undefined ? barplot_datum['size'] : 0;

            // display tooltip
            tooltip.style('display', 'inline')
            tooltip.html(() => get_tooltip_text(size))

            // show / hide labels
            barplot_g.selectAll('rect').attr('opacity', rect_d => {
                return binary === rect_d['binary'] ? 1.0 : 0.3
            })
            labels_circles_g.selectAll('circle').attr('opacity', circle_d => {
                return binary === circle_d['binary'] ? 1.0 : 0.3
            })
            labels_circles_g.selectAll('rect').attr('opacity', rect_d => {
                return binary === rect_d ? 1.0 : 0.0
            })
            labels_texts_g.selectAll('text').attr('opacity', text_d => {
                return binary_mapping[binary].includes(text_d) ? 1.0 : 0.3
            })
        })
        .on('mousemove', (event) => {
            tooltip
                .style('left', `${event.pageX + 16}px`)
                .style('top', `${event.pageY + 16}px`)
        })
        .on('mouseout', () => {
            tooltip.style('display', 'none')

            barplot_g.selectAll('rect').attr('opacity', 1.0);
            labels_circles_g.selectAll('circle').attr('opacity', 1.0);
            labels_circles_g.selectAll('rect').attr('opacity', 1.0);
            labels_texts_g.selectAll('text').attr('opacity', 1.0);
        })



    // draw labels text
    labels_texts_g.selectAll('text')
        .data(labels)
        .enter()
        .append('text')
        .attr('font-size', `${circle_radius*2}px`)
        .attr('cursor', 'pointer')
        .attr('x', `0px`)
        .attr('y', (d, i) => `${i*(circle_radius*2 + circles_padding*2) + circles_padding/2.0 + circle_radius*2}px`)
        .text(d => `${d}`)
        .on('mouseover', (event, d) => {

            // compute the sum of posts that have this label
            const sum = dataframe.filter(datum => datum['sets'].includes(d)).map(datum => +datum['size']).reduce((a, b) => a + b, 0)

            // show tooltip
            tooltip.style('display', 'inline')
            tooltip.html(() => get_tooltip_text(sum))

            // show / hide labels
            labels_texts_g.selectAll('text').attr('opacity', (text_d, j) => {
                return d === text_d ? 1.0 : 0.3
            })
            barplot_g.selectAll('rect').attr('opacity', rect_d => {
                return rect_d['sets'].includes(d) ? 1.0 : 0.3
            })
            labels_circles_g.selectAll('circle').attr('opacity', circle_d => {
                return circle_d['sets'].includes(d) ? 1.0 : 0.3
            })
            labels_circles_g.selectAll('rect').attr('opacity', binary => {
                return binary_mapping[binary].includes(d) ? 1.0 : 0.0
            })
        })
        .on('mousemove', (event) => {
            tooltip
                .style('left', `${event.pageX + 16}px`)
                .style('top', `${event.pageY + 16}px`)
        })
        .on('mouseout', () => {
            tooltip.style('display', 'none')

            barplot_g.selectAll('rect').attr('opacity', 1.0);
            labels_circles_g.selectAll('circle').attr('opacity', 1.0);
            labels_circles_g.selectAll('rect').attr('opacity', 1.0);
            labels_texts_g.selectAll('text').attr('opacity', 1.0);
        })


    // get text max width
    const max_text_width = get_max_text_width(labels_texts_g)

    // compute displacement to center our dataviz
    const actual_width = plot_width + labels_text_left_padding + max_text_width

    // resize svg
    svg.attr('width', actual_width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
}
