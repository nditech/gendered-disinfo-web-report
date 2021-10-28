'use strict'

// import libs
import { remove_px } from './libs.js'

// import d3
import * as d3 from 'd3'

export class Timeline {
    constructor (slider_1, slider_2, connector, track, ondrag, ondragend) {
        this.slider_1 = slider_1
        this.slider_2 = slider_2
        this.connector = connector
        this.timelineOffset = remove_px(track.style('left'))
        this.timelineWidth = remove_px(track.style('width'))
        this.frozen = false

        // callbacks
        this.ondrag = ondrag
        this.ondragend = ondragend

        // grab this
        const mThis = this

        // set sliders callback
        this.slider_1.ondrag = () => {
            mThis.redrawConnector()
            mThis.ondrag()
        }
        this.slider_1.ondragend = () => {
            mThis.redrawConnector()
            mThis.ondragend()
        }
        this.slider_2.ondrag = () => {
            mThis.redrawConnector()
            mThis.ondrag()
        }
        this.slider_2.ondragend = () => {
            mThis.redrawConnector()
            mThis.ondragend()
        }

        // drag event for connector
        this.connector_start_x = null
        this.click_start_x = null
        const drag = d3.drag()
            .on('start', function (event) {
                if (mThis.frozen) return
                mThis.select()
                mThis.click_start_x = event.x
                mThis.connector_start_x = remove_px(mThis.connector.style('x'))
            })
            .on('drag', function (event) {
                if (mThis.frozen) return
                mThis.setXPos(mThis.connector_start_x, mThis.click_start_x, event.x)

                // trigger callback
                mThis.ondrag()
            })
            .on('end', function () {
                if (mThis.frozen) return
                mThis.deselect()

                // trigger callback
                mThis.ondragend()
            })
        this.connector.call(drag)
    }

    freeze () {
        this.frozen = true
        this.slider_1.frozen = true
        this.slider_2.frozen = true
    }

    unfreeze () {
        this.frozen = false
        this.slider_1.frozen = false
        this.slider_2.frozen = false
    }

    getDates () {
        // grab dates from sliders
        const dates = [this.slider_1.getDate(), this.slider_2.getDate()]

        // sort in ascending order
        dates.sort((a, b) => a - b)

        return dates
    }

    redrawConnector () {
        // grab the positions of our sliders
        const positions = [this.slider_1.getXPos(), this.slider_2.getXPos()]
        positions.sort((a, b) => a - b)

        // set line between the two
        this.connector.style('x', `${positions[0]}px`)
        this.connector.style('width', `${positions[1] - positions[0]}px`)
    }

    setXPos (connector_start_x, click_start_x, new_x) {
        // get connector's position
        const connectorWidth = remove_px(this.connector.style('width'))

        // slider width
        const slider_halfwidth = 7

        // displacement
        const delta_x = (new_x - click_start_x)

        // Get new position for slider
        const newpos = connector_start_x + delta_x

        // Make sure this position is inside of the track
        if (newpos < this.timelineOffset + slider_halfwidth) {
            // too left
            return
        } else if (newpos + connectorWidth > this.timelineOffset + this.timelineWidth) {
            // too right
            return
        }

        // Set position
        this.connector.style('x', `${newpos}px`)


        // set sliders
        this.slider_1.setXPos(newpos - slider_halfwidth)
        this.slider_2.setXPos(newpos + connectorWidth - slider_halfwidth)
    }

    select () {
        this.connector.style('opacity', '0.5')
        this.slider_1.select()
        this.slider_2.select()
    }

    deselect () {
        this.connector.style('opacity', '1.0')
        this.slider_1.deselect()
        this.slider_2.deselect()
    }
}
