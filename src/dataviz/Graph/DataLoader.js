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
    constructor (data) {
        // set data
        this.data = data

        // processed data
        this.nodes = null
        this.links = null
        this.lexicon = null

        this._nodes = null
        this._links = null
        this._lexicon = null

        // array of all the unique source names - the name of our nodes
        this.data.forEach(d => d['source_name'] = d['source_name'].replace(/[^a-zA-Z ]/g, ""))
        this.source_names = [...new Set(data.map(datum => datum.source_name))]

        // compute graph elements
        this.compute_nodes()
        this.compute_links()
        this.lexicon = this.compute_ranked_lexicon(this.nodes)
        this.compute_centrality(this.nodes, this.links)
    }

    deepcopy () {
        this._nodes = JSON.parse(JSON.stringify(this.nodes))
        this._links = JSON.parse(JSON.stringify(this.links))
        this._lexicon = JSON.parse(JSON.stringify(this.lexicon))
        this.nodes = JSON.parse(JSON.stringify(this.nodes))
        this.links = JSON.parse(JSON.stringify(this.links))
        this.lexicon = JSON.parse(JSON.stringify(this.lexicon))
    }

    compute_node_max_engagement (node_data) {
        // map the engagement statistics for each datum
        const engagement = node_data.map(datum => {
            return {
                views: (datum.engagement.views === undefined || datum.engagement.views === null) ? 0 : +datum.engagement.views,
                reactions: (datum.engagement.reactions === undefined || datum.engagement.reactions === null) ? 0 : +datum.engagement.reactions,
                shares: (datum.engagement.shares === undefined || datum.engagement.shares === null) ? 0 : +datum.engagement.shares,
                comments: (datum.engagement.comments === undefined || datum.engagement.comments === null) ? 0 : +datum.engagement.comments
            }
        })

        // compute the max engagement
        const max_views = Math.max(...engagement.map(d => d.views))
        const max_reactions = Math.max(...engagement.map(d => d.reactions))
        const max_shares = Math.max(...engagement.map(d => d.shares))
        const max_comments = Math.max(...engagement.map(d => d.comments))

        return {
            views: max_views,
            reactions: max_reactions,
            shares: max_shares,
            comments: max_comments
        }
    }

    compute_nodes_weight (nodes) {
        // get the max of all nodes
        const max_views = Math.max(...nodes.map(node => node.max_engagement.views))
        const max_reactions = Math.max(...nodes.map(node => node.max_engagement.reactions))
        const max_shares = Math.max(...nodes.map(node => node.max_engagement.shares))
        const max_comments = Math.max(...nodes.map(node => node.max_engagement.comments))

        // convert the nodes max engagement to a weight
        nodes.forEach((node, i) => {
            // grab all the non-zero engagement metrics
            const fractions = [
                (max_views === 0) ? 0 : node.max_engagement.views / (1.0 * max_views),
                (max_reactions === 0) ? 0 : node.max_engagement.reactions / (1.0 * max_reactions),
                (max_shares === 0) ? 0 : node.max_engagement.shares / (1.0 * max_shares),
                (max_comments === 0) ? 0 : node.max_engagement.comments / (1.0 * max_comments)
            ].filter(val => val !== 0)

            // take the average of these fractions
            const average = fractions.length > 0 ? fractions.reduce((a, b) => a + b, 0) / (1.0 * fractions.length) : 0.001;

            // update node with weight
            nodes[i].weight = average
        })

        // sort the nodes by their weight in descending order
        nodes.sort((a, b) => b.weight - a.weight)
    }

    compute_nodes () {
        // reset nodes
        this.nodes = []

        // go through the source names
        this.source_names.forEach(source_name => {
            // filter the data for this source name
            const _data = this.data.filter(datum => {
                return datum.source_name === source_name
            })

            // map the engagement statistics for each datum
            const max_engagement = this.compute_node_max_engagement(_data)

            // sort data
            _data.sort((a, b) => new Date(a.published_at) - new Date(b.published_at))

            // extract all the unique lexicon_match
            const lexicon_matches = [...new Set([].concat.apply([], _data.map(d => d.lexicon_match)))]

            // push node
            this.nodes.push({
                source_name: source_name,
                data: _data,
                max_engagement: max_engagement,
                lexicon_matches: lexicon_matches
            })
        })

        // compute the weight of each node
        this.compute_nodes_weight(this.nodes)

        // set the id nodes
        this.nodes.forEach((_, i) => {
            this.nodes[i].id = i
        })
    }

    compute_links () {
        // reset links
        this.links = []

        // get the number of nodes
        const nbr_of_nodes = this.nodes.length

        // create all combinations of nodes pair
        const _potential_links = []
        for (let i = 0; i < nbr_of_nodes; i++) {
            for (let j = i + 1; j < nbr_of_nodes; j++) {
                _potential_links.push({
                    node_id_1: i,
                    node_id_2: j,
                    data: []
                })
            }
        }

        // go through candidates
        _potential_links.forEach(link => {
            // grab link data
            const node_1_id = link.node_id_1
            const node_2_id = link.node_id_2

            // grab our nodes
            const node_1 = this.nodes.filter(node => node.id === node_1_id)[0]
            const node_2 = this.nodes.filter(node => node.id === node_2_id)[0]

            // get our nodes lexicon_matches
            const node_1_lexicon_matches = node_1.lexicon_matches
            const node_2_lexicon_matches = node_2.lexicon_matches

            // check if we have an intersection of the lexicon_match attribute
            const intersection = node_1_lexicon_matches.filter(x => node_2_lexicon_matches.includes(x))

            // if we have no overlap, we stop
            if (intersection.length === 0) {
                return
            }

            // init our data
            const _data = []

            // go through intersecting lexicon_matches
            intersection.forEach(lexicon_match => {
                // grab all datum that have this lexicon_match
                const node_1_matching_data = node_1.data.filter(datum => {
                    return datum.lexicon_match.includes(lexicon_match)
                })
                const node_2_matching_data = node_2.data.filter(datum => {
                    return datum.lexicon_match.includes(lexicon_match)
                })

                // sort data by publish date in ascending order
                node_1_matching_data.sort((a, b) => new Date(a.published_at) - new Date(b.published_at))
                node_2_matching_data.sort((a, b) => new Date(a.published_at) - new Date(b.published_at))

                // push to our link
                _data.push({
                    lexicon_match: lexicon_match,
                    node_1: node_1_matching_data,
                    node_2: node_2_matching_data
                })
            })

            // push our temporary link
            this.links.push({
                node_1_id: node_1_id,
                node_2_id: node_2_id,
                data: _data,
                weight: _data.length
            })
        })

        // set the displayed links
        this._links = this.links
    }

    compute_ranked_lexicon (nodes) {
        // array of all the unique lexicon matches
        let all_lexicon_matches = [].concat.apply([], nodes.map(node => [].concat.apply([], node.data.map(datum => datum.lexicon_match))))

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

    compute_normalized_adjacency_matrix (links) {
        // init
        const adj_mat = []

        // get the number of nodes
        const nbr_of_nodes = this.nodes.length

        // populate matrix with empty rows
        for (let i = 0; i < nbr_of_nodes; i++) {
            adj_mat.push(new Array(nbr_of_nodes).fill(0))
        }

        // populate with link data
        links.forEach(link => {
            // grab node ids
            const node_1_id = +link.node_1_id
            const node_2_id = +link.node_2_id

            // grab the link weight
            const link_weight = link.weight

            // set
            adj_mat[node_1_id][node_2_id] += link_weight
            adj_mat[node_2_id][node_1_id] += link_weight
        })

        return adj_mat
    }

    compute_centrality (nodes, links) {
        // compute adjacency matrix
        const adjacency_matrix = this.compute_normalized_adjacency_matrix(links)

        // compute centrality
        const centrality = degree(adjacency_matrix)

        // update nodes
        nodes.forEach((node, i) => {
            nodes[i].centrality = centrality[+node.id]
        })
    }

    filter (min_date, max_date) {
        // deep copy the source data
        const nodes = JSON.parse(JSON.stringify(this.nodes))
        const links = JSON.parse(JSON.stringify(this.links))

        // --- filter nodes ---
        this._nodes = nodes.filter(node => {
            // get overlaping data
            const _data = node.data.filter(d => {
                const published_at = new Date(d.published_at)
                return published_at >= min_date && published_at <= max_date
            })

            // check
            if (_data.length === 0) return false

            // get intersecting words
            let lexicon_matches = [].concat.apply([], _data.map(datum => datum.lexicon_match))
            lexicon_matches = [...new Set(lexicon_matches)]

            // check
            if (lexicon_matches.length === 0) return false

            // keep
            return true
        })

        // update data
        this._nodes.forEach((node, i) => {
            // get overlaping data
            const _data = node.data.filter(d => {
                const published_at = new Date(d.published_at)
                return published_at >= min_date && published_at <= max_date
            })

            // sort data
            _data.sort((a, b) => new Date(a.published_at) - new Date(b.published_at))

            // get intersecting words
            let lexicon_matches = [].concat.apply([], _data.map(datum => datum.lexicon_match))
            lexicon_matches = [...new Set(lexicon_matches)]

            // set
            this._nodes[i].data = _data
            this._nodes[i].lexicon_matches = lexicon_matches
            this._nodes[i].max_engagement = this.compute_node_max_engagement(_data)
        })

        // update nodes weights
        this.compute_nodes_weight(this._nodes)

        // --- filter links ---
        this._links = links.filter(link => {
            // init data
            const _data = []

            // go through data
            link.data.forEach(datum => {
                // filter data of node 1
                const _node_1 = datum.node_1.filter(d => {
                    const published_at = new Date(d.published_at)
                    return published_at >= min_date && published_at <= max_date
                })
                if (_node_1.length === 0) return

                // filter data of node 2
                const _node_2 = datum.node_2.filter(d => {
                    const published_at = new Date(d.published_at)
                    return published_at >= min_date && published_at <= max_date
                })
                if (_node_2.length === 0) return

                // push
                _data.push({
                    node_1: _node_1,
                    node_2: _node_2,
                    lexicon_match: datum.lexicon_match
                })
            })

            // check for data
            if (_data.length === 0) return false

            // keep
            return true
        })

        // update data
        this._links.forEach((link, i) => {
            // init data
            const _data = []

            // go through data
            link.data.forEach(datum => {
                // filter data of node 1
                const _node_1 = datum.node_1.filter(d => {
                    const published_at = new Date(d.published_at)
                    return published_at >= min_date && published_at <= max_date
                })
                if (_node_1.length === 0) return

                // filter data of node 2
                const _node_2 = datum.node_2.filter(d => {
                    const published_at = new Date(d.published_at)
                    return published_at >= min_date && published_at <= max_date
                })
                if (_node_2.length === 0) return

                // push
                _data.push({
                    node_1: _node_1,
                    node_2: _node_2,
                    lexicon_match: datum.lexicon_match
                })
            })

            // set
            this._links[i].data = _data
            this._links[i].weight = _data.length
        })

        // --- centrality ---
        this.compute_centrality(this._nodes, this._links)

        // --- filter lexicon ---
        this._lexicon = this.compute_ranked_lexicon(this._nodes)
    }
}
