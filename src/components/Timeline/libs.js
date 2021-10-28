'use strict'

/**
* Convert position string to integer, ex. 42px -> 42
*
* @param attr_str  The string of a value followed by px
*/
export function remove_px (attr_str) {
    return +attr_str.substring(0, attr_str.length - 2)
}
