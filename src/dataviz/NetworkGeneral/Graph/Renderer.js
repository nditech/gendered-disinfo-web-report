'use strict'

// import d3 stuff
import * as d3 from 'd3'

// prompt lib
import swal from 'sweetalert'

// import graph physics lib
import { Physics } from './Physics.js'

// import system lib
import { isMobile } from '../../../libs/system.js';

// import env
import {
    margin, graph_width, canvas_height, default_node_color,
    max_circle_radius, circle_padding, min_lines_width, max_lines_width,
    max_nbr_of_steps_init, max_nbr_of_steps_drag,
    default_link_opacity, default_link_non_opacity, default_node_opacity, default_node_non_opacity
} from './env.js'

// import lib
import { distance_between_2_points, does_circles_overlap, is_circle_outside_of_canvas, random_displacement } from './libs/geometry.js'


export class Renderer {
    constructor (graph, canvas, tooltip, callback) {
        // callback to be triggered once the physics engine has completed
        this.callback = callback === undefined || callback === null ? () => {} : callback;

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
        this.max_circle_radius = max_circle_radius

        // init UI
        this.init()
    }

    async init () {
        // create pointer
        const m_this = this

        // clear
        this.canvas.selectAll("*").remove();

        // append svg object to the body
        const graph_svg = this.canvas.append('svg')
            .attr('width', graph_width + margin.left + margin.right)
            .attr('height', canvas_height + margin.top + margin.bottom)
            .style('border', '1px solid #ccc')
            .style('background-color', 'white')

        // append our groups to the svg
        this.g_graph = graph_svg.append('g');

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

        // link width scale
        const max_link_width = Math.max(...this.graph.vertices.map(l => l.weight))
        this.scale_links_width = d3.scaleLinear()
            .domain([1, max_link_width])
            .range([min_lines_width, max_lines_width])

        // draw
        this.init_draw()

        // run physics
        await this.run_physics(true)

        // copy the nodes to displayed nodes
        this.graph.deepcopy()

        // callback
        this.callback()
    }

    async run_physics (init = false) {
        // set text
        // this.info.text('optimizing...')

        if (init) {
            this.physics.load_data(this.graph.nodes, this.graph.vertices)
            await this.physics.run(max_nbr_of_steps_init, 10)
        } else {
            this.physics.load_data(this.graph._nodes, this.graph._vertices)
            await this.physics.run(max_nbr_of_steps_drag, 20)
        }

        // set text
        // this.info.text('')
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
        this.graph._vertices.filter(l => {
            return l.node_1_id === node_id || l.node_2_id === node_id
        }).forEach(l => {
            linked_node_ids.push(l.node_1_id === node_id ? l.node_2_id : l.node_1_id)
        })

        // remove duplicates
        linked_node_ids = [...new Set(linked_node_ids)]

        return linked_node_ids
    }

    get_max_text_width (g) {
        let max_text_width = 0.0
        g.selectAll('text').each(function (d) {
            const _max_text_width = this.getBoundingClientRect().width
            if (_max_text_width > max_text_width) {
                max_text_width = _max_text_width
            }
        })
        return max_text_width
    }

    init_draw () {
        // deep copy
        const vertices = this.graph.vertices
        const nodes = this.graph.nodes

        // convert nodes to dict
        const nodes_dict = {}
        nodes.forEach(node => {
            nodes_dict[node.id] = {
                cx: node.cx,
                cy: node.cy,
                radius: node.radius
            }
        })

        // draw vertices
        this.g_graph.selectAll('line')
            .data(vertices)
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
                return `${this.scale_links_width(d.weight)}px`
            })
            .on('mouseover', (_, d) => {
                // get node ids
                const node_1_id = d.node_1_id
                const node_2_id = d.node_2_id
                const node_ids = [node_1_id, node_2_id]

                // show tooltip
                this.tooltip.style('display', 'inline')
                this.tooltip.html(() => d['tooltip'])

                // show/hide nodes
                this.g_graph.selectAll('circle').attr('opacity', (circle_d) => {
                    return node_ids.includes(circle_d.id) ? default_node_opacity : default_node_non_opacity
                })

                // show/hide vertices
                this.g_graph.selectAll('line').attr('opacity', (line_d) => {
                    return node_1_id === line_d.node_1_id && node_2_id === line_d.node_2_id ? default_link_opacity : default_link_non_opacity
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
            })
            .on('click', (e, d) => {
                if(isMobile()) return;

                // grab urls
                const { urls } = d;

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
            });

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
            .attr('fill', default_node_color)
            .on('mouseover', (event, d) => {
                // get node id
                const node_id = d.id

                // show tooltip
                this.tooltip.style('display', 'inline')
                this.tooltip.html(() => d['tooltip'])

                // get all the source names linked to this node
                const linked_node_ids = this.get_nodes_linked_to_this_node(node_id)

                // show/hide nodes
                this.g_graph.selectAll('circle').attr('opacity', (circle_d, i) => {
                    return node_id === circle_d.id || linked_node_ids.includes(circle_d.id) ? default_node_opacity : default_node_non_opacity
                })

                // show/hide vertices
                this.g_graph.selectAll('line').attr('opacity', (line_d) => {
                    return [line_d.node_1_id, line_d.node_2_id].includes(node_id) ? default_link_opacity : default_link_non_opacity
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
            })
            .on('click', (e, d) => {
                if(isMobile()) return;

                // grab urls
                const urls = d['posts'].map(p => p['url']);

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
            });


        // draw titles
        this.g_graph.selectAll('text')
            .data(nodes)
            .enter()
            .append('text')
            .attr('font-size', `96px`)
            .style('text-transform', 'capitalize')
            .attr('text-anchor', 'middle')
            .attr('x', d => {
                return d.cx
            })
            .attr('y', d => {
                return d.cy - d.radius - 32
            })
            .text(d => d['key'])
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
}
