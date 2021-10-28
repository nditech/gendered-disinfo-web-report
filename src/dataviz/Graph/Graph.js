'use strict'

// graph lib
import { DataLoader } from './DataLoader.js'
import { Renderer } from './Renderer.js'

export class Graph {
    constructor (data, canvas, tooltip, callback) {
        // load data
        this.dataLoader = new DataLoader(data)

        // render
        this.render = new Renderer(this.dataLoader, canvas, tooltip, callback)
    }

    filter (min_date, max_date) {
        this.render.graph.filter(min_date, max_date)
    }

    redraw_graph () {
        this.render.redraw_graph()
    }

    redraw_words () {
        this.render.redraw_words()
    }

    async run_physics () {
        await this.render.run_physics()
    }
}
