'use strict'

// cookie lib
import { getCookie } from './cookie.js'

// locale lib
import { getString } from './locale.js'

// prompt lib
import swal from 'sweetalert'

// Constants
const httpTimeout = 40000

/**
* A GET request using XMLHttpRequest
*
* @param url           The target url
*/
export function request_GET (url, responseType = 'json') {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest()

        // Setup our listener to process compeleted requests
        xhr.onload = function () {
            // check for message
            let message
            if (xhr.response) {
                message = xhr.response.message
            }

            // Process the response
            if (xhr.status >= 200 && xhr.status < 300) {
                // If successful
                resolve(xhr.response)
            } else if (+xhr.status === 401) {
                // NEED TO REDIRECT TO LOGIN
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    message: message
                })
            } else {
                // If failed
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    message: message
                })
            }
        }

        // On error
        xhr.onerror = function (e) {
            // If failed
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            })
        }

        // Setup our HTTP request
        xhr.open('GET', url, true)
        xhr.responseType = responseType

        // time in milliseconds
        xhr.timeout = httpTimeout

        // Timeout function
        xhr.ontimeout = function (e) {
            console.log('ERROR: Internet not working')

            // If failed
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            })
        }

        // Set session id
        const sid = getCookie('sid')
        xhr.setRequestHeader('sid', sid)

        // Send the request
        xhr.send()
    })
}

/**
* A POST request using XMLHttpRequest
*
* @param url           The target url
* @param payload       The request body in JSON format, e.g. {"email": "hey@mail.com", "password": "101010"}
*/
export function request_POST (url, payload = {}) {
    // payload must be in the format : {"email": "hey@mail.com", "password": "101010"}

    // JSON stringify the payload
    payload = JSON.stringify(payload)

    return new Promise(function (resolve, reject) {
        // Create a request
        const xhr = new XMLHttpRequest()

        // Setup our listener to process compeleted requests
        xhr.onload = function () {
            // check for message
            let message
            if (xhr.response) {
                message = xhr.response.message
            }

            // Process the response
            if (xhr.status >= 200 && xhr.status < 300) {
                // If successful
                resolve(xhr.response)
            } else if (+xhr.status === 401) {
                // NEED TO REDIRECT TO LOGIN
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    message: message
                })
            } else {
                // If failed
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    message: message
                })
            }
        }

        // On error
        xhr.onerror = function (e) {
            // If failed
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            })
        }

        // Setup our HTTP request
        xhr.open('POST', url, true)
        xhr.responseType = 'json'

        // time in milliseconds
        xhr.timeout = httpTimeout

        // Timeout function
        xhr.ontimeout = function (e) {
            console.log('ERROR: Internet not working')

            // If failed
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            })
        }

        // Send the proper header information along with the request
        xhr.setRequestHeader('Content-Type', 'application/json')

        // Set session id
        const sid = getCookie('sid')
        xhr.setRequestHeader('sid', sid)

        // Send the request
        xhr.send(payload)
    })
}

export async function getRequestWrapper (endpoint, lang, type = 'json') {
    // init returned var
    let res

    await new Promise((resolve, reject) => {
        request_GET(endpoint, type).catch(error => {
            // grab info
            const { status, statusText, message } = error
            const swal_text = (typeof message === 'string') ? message : statusText

            // if unauthorized, reload page
            if (+status === 401) {
                location.reload()
            }

            // prompt user
            swal({
                title: `${getString(lang, 'error')} ${status}`,
                text: swal_text
            })

            return null
        }).then(result => {
            res = result
            resolve()
        })
    })

    return res
}
