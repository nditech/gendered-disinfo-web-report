'use strict'

// graph lib
import { DataLoader } from './DataLoader.js'
import { Renderer } from './Renderer.js'

export class Graph {
    constructor (nodes, vertices, canvas, tooltip, callback) {

        // set data
        this.canvas = canvas;
        this.tooltip = tooltip;
        this.callback = callback;

        // load data
        this.dataLoader = new DataLoader(nodes, vertices)

        // render
        this.render = new Renderer(this.dataLoader, this.canvas, this.tooltip, this.callback)
    }

    update(nodes, vertices){

        // load data
        this.dataLoader = new DataLoader(nodes, vertices)

        // render
        this.render = new Renderer(this.dataLoader, this.canvas, this.tooltip, this.callback)
    }

    async run_physics () {
        await this.render.run_physics()
    }
}
