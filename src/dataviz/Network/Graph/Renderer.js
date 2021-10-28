'use strict'

// import d3 stuff
import * as d3 from 'd3'

// prompt lib
import swal from 'sweetalert'

// import graph physics lib
import { Physics } from './Physics.js'

// import env
import {
 margin, graph_width, words_width, canvas_height,
    max_circle_radius, circle_padding, min_lines_width, max_lines_width,
    max_nbr_of_steps_init, max_nbr_of_steps_drag, max_font_size,
    default_link_opacity, default_link_non_opacity, default_node_opacity, default_node_non_opacity,
    default_word_opacity, default_word_non_opacity, default_word_move_transition_in_ms
} from './env.js'

// import lib
import { distance_between_2_points, does_circles_overlap, is_circle_outside_of_canvas, random_displacement } from './libs/geometry.js'
import { capitalize } from './libs/strings.js'

/**
 * Create the text associated with the infobubble
 *
 * @param d               The data associated with the selected element
 */
function get_node_tool_tip_text (d) {
    const lexicon_match_str = (lexicon_match) => {
        return lexicon_match.length > 0 ? lexicon_match.join(', ') : '<i>Of interest, no lexicon match</i>'
    }

    return `
        <h2>${d.source_name}</h2>
        <p><b>${d.data.length} ${d.data.length > 1 ? 'posts' : 'post'}</b></p>
        ${d.data.map(p => `<p>${p.published_at} : ${lexicon_match_str(p.lexicon_match)}</p>`).join('')}
    `
}

/**
 * Create the text associated with the infobubble
 *
 * @param d               The data associated with the selected element
 */
function get_link_tool_tip_text (link) {
    // get source names
    const source_name_1 = link.data[0].node_1[0].source_name
    const source_name_2 = link.data[0].node_2[0].source_name

    // title
    const title = `${source_name_1} - ${source_name_2}`

    // join posts
    let html = []
    link.data.forEach(d => {
        // grab data
        const lexicon_match = d.lexicon_match
        const node_1_data = d.node_1
        const node_2_data = d.node_2

        // sort data in ascending chronological order
        const data = node_1_data.concat(node_2_data)
        data.sort((a, b) => new Date(a.published_at) - new Date(b.published_at))

        // convert
        html.push(`
            <p><b>${lexicon_match}</b></p>
            ${data.map(p => `<p>${p.published_at} : ${p.source_name}</p>`).join('')}
        `)
    })
    html = html.join('<br>')

    return `<h2>${title}</h2>${html}`
}

export class Renderer {
    constructor (graph, canvas, tooltip, callback) {
        // callback to be triggered once the physics engine has completed
        this.callback = callback

        // our data
        this.graph = graph

        // physics
        this.physics = new Physics((nodes) => { this.update_positions(nodes) })

        // our ui elements
        this.canvas = canvas
        this.tooltip = tooltip
        this.info = null
        this.g_graph = null
        this.g_graph = null
        this.g_words = null
        this.max_circle_radius = max_circle_radius

        // our dynamic scales
        this.scale_colors = null
        this.scale_links_width = null

        // words variables
        this.font_size = null

        // init UI
        this.init()
    }

    async init () {
        // create pointer
        const m_this = this

        // append svg object to the body
        const graph_svg = this.canvas.append('svg')
            .attr('width', graph_width + margin.left + margin.right)
            .attr('height', canvas_height + margin.top + margin.bottom)
            .style('border', '1px solid black')

        const words_svg = this.canvas.append('svg')
            .attr('width', words_width + margin.left + margin.right)
            .attr('height', canvas_height + margin.top + margin.bottom)

        // font size for the words
        this.font_size = ((canvas_height + margin.top + margin.bottom) / (this.graph.lexicon.length + 1.0))
        if(this.font_size > max_font_size){
            this.font_size = max_font_size;
        }

        // append our groups to the svg
        this.g_graph = graph_svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        this.g_words = words_svg.append('g').attr('transform', 'translate(' + margin.left + ',' + 0 + ')')

        // make graph zoomable & draggable
        const drag_zoom = d3.zoom()
            .on('zoom', function (event) {
                m_this.g_graph.attr('transform', `translate(${event.transform.x},${event.transform.y}), scale(${event.transform.k})`)
            })
        graph_svg.call(drag_zoom)
            .call(drag_zoom.transform, d3.zoomIdentity.translate(graph_width/2.0, canvas_height/2.0).scale(0.1))

        // append an info box
        this.info = graph_svg.append('text').attr('transform', 'translate(' + ((graph_width + margin.left + margin.right) / 2.0 - 16) + ',' + (canvas_height + margin.top) + ')')

        // find the maximum circle radius to fit all circles inside the canvas
        let _ignition = true
        while (_ignition || this.are_there_nodes_outside_canvas()) {
            _ignition = false

            // lower the max radius
            this.max_circle_radius -= 3

            // map nodes -> (cx, cy, radius)
            this.map_nodes()
        }

        // color scale
        this.scale_colors = d3.scaleSequential(d3.interpolateCividis).domain([0, 1.0])

        // link width scale
        const max_nbr_of_links = Math.max(...this.graph._links.map(l => l.data.length))
        this.scale_links_width = d3.scaleLinear()
            .domain([1, max_nbr_of_links])
            .range([min_lines_width, max_lines_width])

        // set keyboard listener
        d3.select('body')
        .on('keydown', (event) => {
            if (event.key === 'Escape') {
                graph_svg.transition().duration(1000)
                    .call(drag_zoom.transform, d3.zoomIdentity)
            }
        })

        // draw
        this.init_draw()

        // run physics
        await this.run_physics(true)

        // copy the nodes to displayed nodes
        this.graph.deepcopy()

        // callback
        // this.callback()
    }

    async run_physics (init = false) {
        // set text
        this.info.text('optimizing...')

        if (init) {
            this.physics.load_data(this.graph.nodes, this.graph.links)
            await this.physics.run(max_nbr_of_steps_init, 100)
        } else {
            this.physics.load_data(this.graph._nodes, this.graph._links)
            await this.physics.run(max_nbr_of_steps_drag, 20)
        }

        // set text
        this.info.text('')
    }

    are_there_nodes_outside_canvas () {
        for (let i = 0; i < this.graph.nodes.length; i++) {
            const cx = this.graph.nodes[i].cx
            const cy = this.graph.nodes[i].cy
            const radius = this.graph.nodes[i].radius

            if (is_circle_outside_of_canvas(cx, cy, radius, graph_width, canvas_height)) {
                return true
            }
        }
        return false
    }

    // function to check if a node overlaps with another one
    does_node_overlap_with_others (id, cx, cy, radius) {
        for (let i = 0; i < this.graph.nodes.length; i++) {
            const _id = this.graph.nodes[i].id
            const _cx = this.graph.nodes[i].cx
            const _cy = this.graph.nodes[i].cy
            const _radius = this.graph.nodes[i].radius

            // skip if same
            if (_id === id) {
                continue
            }

            // check if overlaps
            if (does_circles_overlap(cx, cy, _cx, _cy, radius, _radius, circle_padding)) {
                return true
            }
        }
        return false
    }

    map_nodes () {
        // set scale
        const scale_circle_radius = d3.scaleSqrt().domain([0.0, 1.0]).range([0, this.max_circle_radius])

        // set the radius of each node based on their weight
        this.graph.nodes.forEach(node => {
            node.radius = scale_circle_radius(node.weight)
            node.cx = graph_width / 2.0
            node.cy = canvas_height / 2.0
        })

        // go through nodes
        this.graph.nodes.forEach((node, i) => {
            // leave the first node at the center
            if (i === 0) return

            // grab node data
            const _id = node.id
            const radius = node.radius

            // we move the circle from (0,0) to a non-overlapping position a few times to get the best one
            let closest_cx = Infinity
            let closest_cy = Infinity
            let closest_dist_from_origin = Infinity
            for (let j = 0; j < 10; j++) {
                // init position
                let cx = graph_width / 2.0
                let cy = canvas_height / 2.0

                // generate a random displacement
                const [dx, dy] = random_displacement()

                // move circle incrementally and stop when it no longer overlaps with other circles
                while (this.does_node_overlap_with_others(_id, cx, cy, radius)) {
                    cx += dx
                    cy += dy
                }

                // check for the distance from the center
                const dist_from_origin = distance_between_2_points(cx, cy, graph_width / 2.0, canvas_height / 2.0)

                // if closer than the previous try, update
                if (dist_from_origin < closest_dist_from_origin) {
                    closest_dist_from_origin = dist_from_origin
                    closest_cx = cx
                    closest_cy = cy
                }
            }

            // push the values
            this.graph.nodes[i].cx = closest_cx
            this.graph.nodes[i].cy = closest_cy
        })
    }

    // for a prettier graph we draw lines, not from the center of their source circles, but from the circles' edge
    compute_link_coordinates (node_1, node_2) {
        // grab data from nodes
        const cx_1 = node_1.cx
        const cy_1 = node_1.cy
        const radius_1 = node_1.radius
        const cx_2 = node_2.cx
        const cy_2 = node_2.cy
        const radius_2 = node_2.radius

        // equation for line distance
        const d = Math.sqrt(Math.pow(cx_1 - cx_2, 2) + Math.pow(cy_1 - cy_2, 2))

        // radius d'
        const d1_t = radius_1 / (1.0 * d)
        const d2_t = (d - radius_2) / (1.0 * d)

        // get coordinates of the points
        const cx_1_t = (1 - d1_t) * cx_1 + d1_t * cx_2
        const cy_1_t = (1 - d1_t) * cy_1 + d1_t * cy_2
        const cx_2_t = (1 - d2_t) * cx_1 + d2_t * cx_2
        const cy_2_t = (1 - d2_t) * cy_1 + d2_t * cy_2

        return {
            x1_t: cx_1_t,
            y1_t: cy_1_t,
            x2_t: cx_2_t,
            y2_t: cy_2_t
        }
    }

    get_nodes_linked_to_this_node (node_id) {
        // push all
        let linked_node_ids = []
        this.graph._links.filter(l => {
            return l.node_1_id === node_id || l.node_2_id === node_id
        }).forEach(l => {
            linked_node_ids.push(l.node_1_id === node_id ? l.node_2_id : l.node_1_id)
        })

        // remove duplicates
        linked_node_ids = [...new Set(linked_node_ids)]

        return linked_node_ids
    }

    init_draw () {
        // deep copy
        const links = this.graph.links
        const nodes = this.graph.nodes
        const lexicon = this.graph.lexicon

        // convert nodes to dict
        const nodes_dict = {}
        nodes.forEach(node => {
            nodes_dict[node.id] = {
                cx: node.cx,
                cy: node.cy,
                radius: node.radius
            }
        })

        // draw links
        this.g_graph.selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('x1', d => {
                const { x1_t } = this.compute_link_coordinates(nodes_dict[d.node_1_id], nodes_dict[d.node_2_id])
                return x1_t
            })
            .attr('y1', d => {
                const { y1_t } = this.compute_link_coordinates(nodes_dict[d.node_1_id], nodes_dict[d.node_2_id])
                return y1_t
            })
            .attr('x2', d => {
                const { x2_t } = this.compute_link_coordinates(nodes_dict[d.node_1_id], nodes_dict[d.node_2_id])
                return x2_t
            })
            .attr('y2', d => {
                const { y2_t } = this.compute_link_coordinates(nodes_dict[d.node_1_id], nodes_dict[d.node_2_id])
                return y2_t
            })
            .attr('opacity', default_link_opacity)
            .attr('stroke', '#3d5c94')
            .attr('stroke-width', d => {
                return `${this.scale_links_width(d.data.length)}px`
            })
            .on('mouseover', (_, d) => {
                // get node ids
                const node_1_id = d.node_1_id
                const node_2_id = d.node_2_id
                const node_ids = [node_1_id, node_2_id]

                // get all lexicon matches for this link
                const lexicon_matches = d.data.map(d => d.lexicon_match)

                // show tooltip
                this.tooltip.style('display', 'inline')
                this.tooltip.html(() => get_link_tool_tip_text(d))

                // show/hide nodes
                this.g_graph.selectAll('circle').attr('opacity', (circle_d) => {
                    return node_ids.includes(circle_d.id) ? default_node_opacity : default_node_non_opacity
                })
                this.g_graph.selectAll('text').attr('opacity', circle_d => {
                    return node_ids.includes(circle_d.id) ? default_word_opacity : default_word_non_opacity
                })

                // show/hide links
                this.g_graph.selectAll('line').attr('opacity', (line_d) => {
                    return node_1_id === line_d.node_1_id && node_2_id === line_d.node_2_id ? default_link_opacity : default_link_non_opacity
                })

                // show/hide words
                this.g_words.selectAll('text').attr('opacity', (text_d) => {
                    return lexicon_matches.includes(text_d) ? default_word_opacity : default_word_non_opacity
                })
            })
            .on('mousemove', (event) => {
                // move tooltip
                this.tooltip
                    .style('left', `${event.pageX + 16}px`)
                    .style('top', `${event.pageY + 16}px`)
            })
            .on('mouseout', () => {
                // hide tooltip
                this.tooltip.style('display', 'none')

                // show all nodes
                this.g_graph.selectAll('circle').attr('opacity', default_node_opacity)
                this.g_graph.selectAll('line').attr('opacity', default_link_opacity)
                this.g_words.selectAll('text').attr('opacity', default_word_opacity)
                this.g_graph.selectAll('text').attr('opacity', default_word_opacity)
            })
            .on('click', (_, d) => {
                // init
                const urls = []

                // add urls
                d.data.forEach(d => {
                    d.node_1.map(p => p.url).forEach(url => urls.push(url))
                    d.node_2.map(p => p.url).forEach(url => urls.push(url))
                })

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

        // draw circles
        this.g_graph.selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('opacity', default_node_opacity)
            .attr('r', d => {
                return d.radius
            })
            .attr('cx', d => {
                return d.cx
            })
            .attr('cy', d => {
                return d.cy
            })
            .attr('fill', d => {
                return this.scale_colors(d.centrality)
            })
            .on('mouseover', (event, d) => {
                // get node id
                const node_id = d.id

                // show tooltip
                this.tooltip.style('display', 'inline')
                this.tooltip.html(() => get_node_tool_tip_text(d))

                // get all the source names linked to this node
                const linked_node_ids = this.get_nodes_linked_to_this_node(node_id)

                // show/hide nodes
                this.g_graph.selectAll('circle').attr('opacity', (circle_d, i) => {
                    return node_id === circle_d.id || linked_node_ids.includes(circle_d.id) ? default_node_opacity : default_node_non_opacity
                })
                this.g_graph.selectAll('text').attr('opacity', circle_d => {
                    return node_id === circle_d.id || linked_node_ids.includes(circle_d.id) ? default_word_opacity : default_word_non_opacity
                })

                // show/hide links
                this.g_graph.selectAll('line').attr('opacity', (line_d) => {
                    return [line_d.node_1_id, line_d.node_2_id].includes(node_id) ? default_link_opacity : default_link_non_opacity
                })

                // show/hide words
                this.g_words.selectAll('text').attr('opacity', (text_d) => {
                    return d.lexicon_matches.includes(text_d) ? default_word_opacity : default_word_non_opacity
                })
            })
            .on('mousemove', (event) => {
                // move tooltip
                this.tooltip
                    .style('left', `${event.pageX + 16}px`)
                    .style('top', `${event.pageY + 16}px`)
            })
            .on('mouseout', () => {
                // hide tooltip
                this.tooltip.style('display', 'none')

                // show all nodes
                this.g_graph.selectAll('circle').attr('opacity', default_node_opacity)
                this.g_graph.selectAll('line').attr('opacity', default_link_opacity)
                this.g_words.selectAll('text').attr('opacity', default_word_opacity)
                this.g_graph.selectAll('text').attr('opacity', default_word_opacity)
            })
            .on('click', (_, d) => {
                // get urls
                const urls = d.data.map(p => p.url)

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

        // draw titles
        this.g_graph.selectAll('text')
            .data(nodes)
            .enter()
            .append('text')
            .attr('font-size', `64px`)
            .style('text-transform', 'capitalize')
            .attr('text-anchor', 'middle')
            .attr('x', d => {
                return d.cx
            })
            .attr('y', d => {
                return d.cy - d.radius - 32
            })
            .text(d => d['source_name'])


        // draw words
        this.g_words.selectAll('text')
            .data(lexicon)
            .enter()
            .append('text')
            .attr('cursor', 'pointer')
            .attr('opacity', default_word_opacity)
            .attr('font-size', `${this.font_size}px`)
            .attr('y', (d, i) => {
                return `${(i+1) * this.font_size}px`
            })
            .text(d => {
                return `${capitalize(d)}`
            })
            .on('mouseover', (_, d) => {
                // show/hide words
                this.g_words.selectAll('text').attr('opacity', (text_d) => {
                    return d === text_d ? default_word_opacity : default_word_non_opacity
                })

                // show/hide links
                this.g_graph.selectAll('line').attr('opacity', line_d => {
                    return line_d.data.map(p => p.lexicon_match).includes(d) ? default_link_opacity : default_link_non_opacity
                })

                // show/hide nodes
                this.g_graph.selectAll('circle').attr('opacity', circle_d => {
                    return circle_d.lexicon_matches.includes(d) ? default_node_opacity : default_node_non_opacity
                })
                this.g_graph.selectAll('text').attr('opacity', circle_d => {
                    return circle_d.lexicon_matches.includes(d) ? default_word_opacity : default_word_non_opacity
                })
            })
            .on('mouseout', () => {
                this.g_graph.selectAll('circle').attr('opacity', default_node_opacity)
                this.g_graph.selectAll('text').attr('opacity', default_word_opacity)
                this.g_graph.selectAll('line').attr('opacity', default_link_opacity)
                this.g_words.selectAll('text').attr('opacity', default_word_opacity)
            })
    }

    update_positions (nodes) {
        // init position dit
        const nodes_dict = {}

        // populate with original positions
        this.graph.nodes.forEach(node => {
            nodes_dict[node.id] = {
                cx: node.cx,
                cy: node.cy,
                radius: node.radius
            }
        })

        // update with new positions
        nodes.forEach(node => {
            nodes_dict[node.id] = {
                cx: node.cx,
                cy: node.cy,
                radius: node.radius
            }
        })

        // update to new positions
        this.g_graph.selectAll('line')
            .attr('x1', d => {
                const { x1_t } = this.compute_link_coordinates(nodes_dict[d.node_1_id], nodes_dict[d.node_2_id])
                return x1_t
            })
            .attr('y1', d => {
                const { y1_t } = this.compute_link_coordinates(nodes_dict[d.node_1_id], nodes_dict[d.node_2_id])
                return y1_t
            })
            .attr('x2', d => {
                const { x2_t } = this.compute_link_coordinates(nodes_dict[d.node_1_id], nodes_dict[d.node_2_id])
                return x2_t
            })
            .attr('y2', d => {
                const { y2_t } = this.compute_link_coordinates(nodes_dict[d.node_1_id], nodes_dict[d.node_2_id])
                return y2_t
            })

        this.g_graph.selectAll('circle')
            .attr('r', d => {
                return nodes_dict[d.id].radius
            })
            .attr('cx', d => {
                return nodes_dict[d.id].cx
            })
            .attr('cy', d => {
                return nodes_dict[d.id].cy
            })


        this.g_graph.selectAll('text')
            .attr('x', d => {
                return nodes_dict[d.id].cx
            })
            .attr('y', d => {
                return nodes_dict[d.id].cy - nodes_dict[d.id].radius - 32
            })
    }

    redraw_graph () {
        // deep copy
        const links = this.graph._links
        const nodes = this.graph._nodes

        // positions
        this.update_positions(nodes)

        // convert nodes to dict
        const nodes_dict = {}
        for (let i = 0; i < this.graph.nodes.length; i++) {
            nodes_dict[i] = {
                data: [],
                lexicon_matches: [],
                centrality: 0.0
            }
        }
        nodes.forEach(node => {
            nodes_dict[node.id] = {
                data: node.data,
                lexicon_matches: node.lexicon_matches,
                centrality: node.centrality
            }
        })

        // show / hide links
        this.g_graph.selectAll('line')
            .classed('hidden', d => {
                return links.map(l => [l.node_1_id, l.node_2_id]).filter(l => {
                    if ((+l[0] === +d.node_1_id && +l[1] === +d.node_2_id) ||
                        (+l[1] === +d.node_1_id && +l[2] === +d.node_2_id)) return true
                    return false
                }).length === 0
            })

        // show / hide nodes
        this.g_graph.selectAll('circle')
            .classed('hidden', d => {
                return !nodes.map(n => n.id).includes(d.id)
            })

        // update node data
        this.g_graph.selectAll('circle').each(function (d) {
            d.data = nodes_dict[d.id].data
            d.lexicon_matches = nodes_dict[d.id].lexicon_matches
            d.centrality = nodes_dict[d.id].centrality
        })

        // update link data
        this.g_graph.selectAll('line').each(function (d) {
            const link = links.filter(l => {
                return (l.node_1_id === d.node_1_id && l.node_2_id === d.node_2_id) || (l.node_1_id === d.node_2_id && l.node_2_id === d.node_1_id)
            })
            d.data = link.length === 0 ? [] : link[0].data
        })

        // update link width
        this.g_graph.selectAll('line')
            .attr('stroke-width', d => {
                return `${this.scale_links_width(d.data.length)}px`
            })

        // update circle color width
        this.g_graph.selectAll('circle')
            .attr('fill', d => {
                return this.scale_colors(d.centrality)
            })
    }

    redraw_words () {
        // show / hide words
        let extra_word_counter = 0
        const new_words_positions = {}
        this.graph.lexicon.forEach(d => {
            const new_pos = this.graph._lexicon.indexOf(d)
            new_words_positions[d] = new_pos >= 0 ? new_pos * this.font_size : (this.graph._lexicon.length + 1 + extra_word_counter++) * this.font_size
        })

        this.g_words.selectAll('text')
            .classed('hidden', d => {
                return !this.graph._lexicon.includes(d)
            })
        this.g_words.selectAll('text').transition().duration(default_word_move_transition_in_ms)
            .attr('y', (d) => {
                return `${new_words_positions[d] + this.font_size}px`
            })
    }
}
