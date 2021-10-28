'use strict'

// import env
import {
 t_step_delay_ms, displacement_constant, displacement_to_stop,
            c_attr, c_repu, circle_padding
} from './env.js'

// import lib
import { distance_between_2_points, vector_sum } from './libs/geometry.js'
import { delay } from './libs/system.js'

export class Physics {
    constructor (callback) {
        this.nodes = null
        this.links = null
        this.callback = callback
    }

    load_data (nodes, links) {
        this.nodes = nodes
        this.links = links
    }

    get_link (node_1_id, node_2_id) {
        for (let i = 0; i < this.links.length; i++) {
            if ((this.links[i].node_1_id === node_1_id && this.links[i].node_2_id === node_2_id) ||
                (this.links[i].node_1_id === node_2_id && this.links[i].node_2_id === node_1_id)) {
                return this.links[i]
            }
        }
        return null
    }

    get_link_weight (link) {
        // the link weight is proportionnal to the number of common words
        if (link === null) return 0.0
        return link.weight
    }

    compute_force (node_1, node_2) {
        // get link
        const link = this.get_link(node_1.id, node_2.id)

        // get node data
        const x_1 = node_1.cx
        const y_1 = node_1.cy
        const radius_1 = node_1.radius
        const x_2 = node_2.cx
        const y_2 = node_2.cy
        const radius_2 = node_2.radius

        // get relationship data
        const d_x = x_2 - x_1
        const d_y = y_2 - y_1
        const d = 1.0 * distance_between_2_points(x_1, y_1, x_2, y_2)
        const weight = this.get_link_weight(link)

        // get attractive force
        const f_attr = link === null ? 0.5 * Math.sqrt(d) : weight * Math.sqrt(d)

        // get repulsive force
        const f_repu = (radius_1 + radius_2 + circle_padding) / (1.0 * d)

        // apply force equation
        return [
            (c_attr * f_attr - c_repu * f_repu) * (d_x / d),
            (c_attr * f_attr - c_repu * f_repu) * (d_y / d)
        ]
    }

    /**
     * Given an initialized graph composed of,
     *
     *  nodes (id, cx, cy, radius)
     *  links (node_id_1, node_id_2, width)
     *
     * We iteratively have the graph elements move into
     * an optimal position based on the following forces,
     *
     *  F = c_0 * ( m_1 * m_2 / d^2 )
     *
     */
    async run (max_nbr_of_steps, step_count_modulo=100) {
        // init process var
        let step_count = 0
        let total_displacement = Infinity

        while (true) {
            // check if need to stop
            if (total_displacement < displacement_to_stop) {
                console.log(`stopped optimizer due to displacement goal (step count : ${step_count})`)
                break
            }

            if (step_count > max_nbr_of_steps) {
                console.log('stopped optimizer due to step ceiling')
                break
            }

            // increment step count
            step_count += 1

            // reset displacement
            total_displacement = 0.0

            // init displacement arr
            const displacements = {}

            for (let i = 0; i < this.nodes.length; i++) {
                // get node
                const node_i = this.nodes[i]

                // init force arr
                const forces = []

                // get force vector from all the surrounding nodes
                for (let j = 0; j < this.nodes.length; j++) {
                    // get node
                    const node_j = this.nodes[j]
                    if (node_j.id === node_i.id) continue

                    // compute force between these two nodes
                    const f = this.compute_force(node_i, node_j)
                    if (f === null) continue

                    // push to arr
                    forces.push(f)
                }

                // sum the force vectors to find the net force
                const net_force = vector_sum(forces)

                // convert to displacement using constant
                const displacement = [
                    net_force[0] * displacement_constant,
                    net_force[1] * displacement_constant
                ]

                // push
                displacements[node_i.id] = displacement
            }

            // move nodes
            this.nodes.forEach(node => {
                // move node
                const displacement = displacements[node.id]
                node.cx += displacement[0]
                node.cy += displacement[1]

                // accumulate displacement
                total_displacement += Math.sqrt(Math.pow(displacement[0], 2) + Math.pow(displacement[1], 2))
            })

            // if no callback
            if(step_count % step_count_modulo !== 0) continue;

            // trigger callback
            this.callback(this.nodes)

            // wait for drawing
            if (t_step_delay_ms >= 0) {
                await delay(t_step_delay_ms)
            }
        }

        // trigger callback
        this.callback(this.nodes)
    }
}
