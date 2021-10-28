'use strict';

/*
 * Returns true if we are on a mobile device
*/
export function isMobile() {
    try {
        if(/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    } catch(e){
        console.log("Error in isMobile"); return false;
    }
}

export function delay (delay_in_ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2)
        }, delay_in_ms)
    })
}
