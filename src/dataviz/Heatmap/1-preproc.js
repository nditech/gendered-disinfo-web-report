'use strict'

// import d3
import * as d3 from 'd3'

import { url_to_platform_type, post_to_interactions } from '../../libs/socialmedia.js';

function get_min_max_dates(data, padding_in_days = 30, key = 'published_at'){
    // get data min and max date (with a N day padding)
    const dates = data.map(d => new Date(d[key]))
    const min_date = Math.min(...dates) - padding_in_days * 24 * 60 * 60 * 1000
    const max_date = Math.max(...dates) + padding_in_days * 24 * 60 * 60 * 1000
    return [min_date, max_date]
}


/**
 * Arranges the submissions in a matrix with
 *  row : source
 *  col : date
 *  value : nbr of submissions
 */
export function matrixify (submissions, sources, nbr_time_steps) {
    // get submissions' min/max date
    const padding_in_days = 2
    const [min_date, max_date] = get_min_max_dates(submissions, padding_in_days)

    // create a d3 time scale to map a date to an index
    const time_scale = d3.scaleTime().rangeRound([0, nbr_time_steps - 1]).domain([min_date, max_date])

    // get all the source names
    const submission_source_names = [...new Set(submissions.map(submission => submission.source_name))]
    const source_names = [...new Set(sources.map(source => source.name))].filter(source_name => submission_source_names.includes(source_name))

    // get all the source types
    let source_types = new Set();
    sources.map(source => Object.keys(source['endpoint'])).forEach(_source_types => _source_types.forEach(source_type => source_types.add(source_type)));
    source_types = [...source_types];

    // create an object mapping a source name to an index
    const source_mapping = {}
    const inv_source_mapping = {}
    source_names.forEach((source_name, i) => {
        source_mapping[source_name] = i
        inv_source_mapping[i] = source_name
    })

    // init matrix
    const matrix = [...Array(source_names.length)].map(e => Array(nbr_time_steps).fill([]))

    // populate with submissions
    submissions.forEach(submission => {
        // grab data
        const source_name = submission.source_name
        const date = new Date(submission.published_at)

        // get source name index
        const source_index = source_mapping[source_name]
        if (source_index === undefined) return;

        // get date index
        const date_index = time_scale(date)

        // push to matrix
        matrix[source_index][date_index] = matrix[source_index][date_index].concat([submission])
    })

    // get max value per source types
    let source_type_max_value = {}
    source_types.forEach(source_type => {
        submissions.filter(submission => url_to_platform_type(submission['url']) === source_type).forEach(_submission => {
            const interactions = post_to_interactions(_submission);
            const current_max = source_type_max_value[source_type];
            if(current_max === undefined || +interactions['count'] > current_max){
                source_type_max_value[source_type] = +interactions['count'];
            }
        })
    })
    
    // get max number of posts per row
    let max_value = 0
    matrix.forEach((row, row_id) => {
        const _max_value = Math.max(...row.map(el => el.length))

        // update max
        if (_max_value > max_value) {
            max_value = _max_value
        }
    })

    // create a d3 color scale
    let color_scales = {}
    source_types.forEach(source_type => {
        color_scales[source_type] = d3.scalePow().domain([0, source_type_max_value[source_type]])
    })

    return {
        matrix: matrix,
        source_mapping: source_mapping,
        time_scale: time_scale,
        color_scales: color_scales
    }
}
