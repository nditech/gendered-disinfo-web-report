'use strict'

// computes the pythagorean distance between two points
export function distance_between_2_points (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

// checks if two circles overlap
export function does_circles_overlap (cx_1, cy_1, cx_2, cy_2, radius_1, radius_2, padding_in_px) {
    // get distance between their two centers
    const distance = distance_between_2_points(cx_1, cy_1, cx_2, cy_2)

    // check if distance is less than their two radius and some padding
    return distance < (radius_1 + radius_2 + padding_in_px)
}

// check if circle is outside canvas
export function is_circle_outside_of_canvas (cx, cy, radius, canvas_width, canvas_height) {
    return (cx - radius) < 0 || (cx + radius) > canvas_width || (cy - radius) < 0 || (cy + radius) > canvas_height
}

// returns a random [dx, dy] to move circles
export function random_displacement () {
    // generate a random angle
    const angle_rad = Math.random() * Math.PI / 2.0
    let dy = 0.1 * Math.cos(angle_rad) * (180 / Math.PI)
    let dx = 0.1 * Math.sin(angle_rad) * (180 / Math.PI)

    // generate a random quadrant
    const direction = Math.random()
    if (direction < 0.25) {
        dy = -dy
        dx = -dx
    } else if (direction < 0.5) {
        dx = -dx
    } else if (direction < 0.75) {
        dy = -dy
    }

    return [dx, dy]
}

export function vector_sum (forces) {
    // forces[0] = [f_0_x, f_0_y]
    return [
        forces.map(f => +f[0]).reduce((a, b) => a + b, 0),
        forces.map(f => +f[1]).reduce((a, b) => a + b, 0)
    ]
}
