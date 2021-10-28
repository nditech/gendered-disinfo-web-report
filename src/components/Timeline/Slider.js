'use strict'

// import libs
import { remove_px } from './libs.js'

// import d3
import * as d3 from 'd3'

export class Slider {
    constructor (slider, track, timelineScale) {
        this.slider = slider
        this.timelineScale = timelineScale
        this.timelineOffset = remove_px(track.style('left'))
        this.timelineWidth = remove_px(track.style('width'))
        this.dateformatter = d3.timeFormat('%Y-%m-%d')
        this.frozen = false
        this.ondrag = null
        this.ondragend = null

        // grab this
        const mThis = this

        // Add Mouse event to Time Slider
        const drag = d3.drag()
            .on('start', function () {
                if (mThis.frozen) return
                mThis.select()
            })
            .on('drag', function (event) {
                if (mThis.frozen) return
                mThis.setXPos(event.x)

                // trigger callback
                mThis.ondrag()
            })
            .on('end', function () {
                if (mThis.frozen) return
                mThis.deselect()

                // trigger callback
                mThis.ondragend()
            })

        // Set drag event handle on sliders
        mThis.slider.call(drag)
    }

    // Getter
    getXPos () {
        const sliderWidth = remove_px(this.slider.style('width'))
        const sliderOffset = remove_px(this.slider.style('left'))

        return sliderOffset - this.timelineOffset + sliderWidth / 2.0
    }

    // Getter
    getDate () {
        return this.timelineScale.invert(this.getXPos())
    }

    // Setter
    setXPos (x_pos) {
        // Get new position for slider
        const newpos = x_pos

        // Make sure this position is inside of the track
        if (newpos < this.timelineOffset) {
            // too left
            return
        } else if (newpos > this.timelineOffset + this.timelineWidth) {
            // too right
            return
        }

        // Set position
        this.slider.style('left', `${newpos}px`)

        // Set the date under the slider
        const parsedDate = this.getDate()
        this.slider.select('p').text(this.dateformatter(parsedDate))
    }

    select () {
        this.slider.style('opacity', '0.5')
    }

    deselect () {
        this.slider.style('opacity', '1.0')
    }
}
