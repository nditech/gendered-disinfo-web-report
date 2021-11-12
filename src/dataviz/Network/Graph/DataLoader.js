'use strict'

// import graph centrality lib
import { degree } from './libs/centrality.js'

export class DataLoader {
    /**
     * Class to compute all our graph info
     *
     * data : array of objects
     *      schema can be found above
     */
    constructor (nodes, vertices) {

        // source data
        this.nodes = nodes
        this.vertices = vertices
        this.lexicon = this.compute_ranked_lexicon(nodes)

        // displayed data
        this._nodes = null
        this._vertices = null
        this._lexicon = null

        // array of all the unique source names - the name of our nodes
        this.keys = [...new Set(this.nodes.map(node => node.key))]

        // compute graph elements
        this.compute_centrality(this.nodes, this.vertices)
    }

    deepcopy () {
        this._nodes = JSON.parse(JSON.stringify(this.nodes))
        this._vertices = JSON.parse(JSON.stringify(this.vertices))
        this._lexicon = JSON.parse(JSON.stringify(this.lexicon))
        this.nodes = JSON.parse(JSON.stringify(this.nodes))
        this.vertices = JSON.parse(JSON.stringify(this.vertices))
        this.lexicon = JSON.parse(JSON.stringify(this.lexicon))
    }

    compute_normalized_adjacency_matrix (vertices) {
        // init
        const adj_mat = []

        // get the number of nodes
        const nbr_of_nodes = this.nodes.length

        // populate matrix with empty rows
        for (let i = 0; i < nbr_of_nodes; i++) {
            adj_mat.push(new Array(nbr_of_nodes).fill(0))
        }

        // populate with vertice data
        vertices.forEach(vertice => {
            // grab node ids
            const node_1_id = +vertice.node_1_id
            const node_2_id = +vertice.node_2_id

            // grab the vertice weight
            const vertice_weight = vertice.weight

            // set
            adj_mat[node_1_id][node_2_id] += vertice_weight
            adj_mat[node_2_id][node_1_id] += vertice_weight
        })

        return adj_mat
    }

    compute_centrality (nodes, vertices) {
        // compute adjacency matrix
        const adjacency_matrix = this.compute_normalized_adjacency_matrix(vertices)

        // compute centrality
        const centrality = degree(adjacency_matrix)

        // update nodes
        nodes.forEach((node, i) => {
            nodes[i].centrality = centrality[+node.id]
        })
    }

    compute_ranked_lexicon (nodes) {
        // array of all the unique lexicon matches
        let all_lexicon_matches = [].concat.apply([], nodes.map(node => [].concat.apply([], node.posts.map(post => post.lexicon_match))))
        
        // create a dict of the word count
        const all_lexicon_matches_dict = {}
        all_lexicon_matches.forEach(w => {
            all_lexicon_matches_dict[w] = 0
        })
        all_lexicon_matches.forEach(w => {
            all_lexicon_matches_dict[w] += 1
        })

        // remove duplicates
        all_lexicon_matches = [...new Set(all_lexicon_matches)]

        // sort in descending order using count
        all_lexicon_matches.sort((a, b) => all_lexicon_matches_dict[b] - all_lexicon_matches_dict[a])

        // set
        return all_lexicon_matches
    }

}
