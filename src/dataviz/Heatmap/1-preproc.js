'use strict'

// import d3
import * as d3 from 'd3'


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
export function matrixify (submissions, nbr_time_steps) {
    // get submissions' min/max date
    const padding_in_days = 2
    const [min_date, max_date] = get_min_max_dates(submissions, padding_in_days)

    // create a d3 time scale to map a date to an index
    const time_scale = d3.scaleTime().rangeRound([0, nbr_time_steps - 1]).domain([min_date, max_date])

    // get all the source names
    const source_names = [...new Set(submissions.map(submission => submission.source_name))]

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

        // get date index
        const date_index = time_scale(date)

        // push to matrix
        matrix[source_index][date_index] = matrix[source_index][date_index].concat([submission])
    })

    // sort in descending order of the most
    const _arr = []
    let max_value = 0
    matrix.forEach((row, row_id) => {
        // get max number of posts in this row
        const _max_value = Math.max(...row.map(el => el.length))

        // update max
        if (_max_value > max_value) {
            max_value = _max_value
        }

        // sum the nbr of posts in this row
        const total = row.map(el => el.length).reduce((a, b) => a + b, 0)

        // push
        _arr.push({
            row_id: row_id,
            total: total
        })
    })
    _arr.sort((a, b) => b.total - a.total)

    // reorder
    const _matrix = []
    const _source_mapping = {}
    _arr.forEach((d, new_row_id) => {
        // get data
        const { row_id } = d

        // get source name
        const source_name = inv_source_mapping[row_id]

        // set source name
        _source_mapping[source_name] = new_row_id

        // push row
        _matrix.push(matrix[row_id])
    })

    // create a d3 color scale
    const color_scale = d3.scalePow().domain([-0.3, max_value, Math.round(Math.ceil(max_value/10.0)*10.0)])

    return {
        matrix: _matrix,
        source_mapping: _source_mapping,
        time_scale: time_scale,
        color_scale: color_scale
    }
}
