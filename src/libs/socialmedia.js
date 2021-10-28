'use strict';

export function post_to_url (type, endpoint, post_id) {
    if (type === 'facebook') {
        return `https://mobile.facebook.com/${endpoint}/posts/${post_id}`
    } else if (type === 'youtube') {
        return `https://www.youtube.com/watch?v=${post_id}`
    } else if (type === 'twitter') {
        return `https://twitter.com/${endpoint}/status/${post_id}`
    } else if (type === 'telegram') {
        return `https://t.me/s/${endpoint}/${post_id}`
    }

    return null
}

export function url_to_platform_type(url){
    if (url.includes('facebook')){
        return 'facebook'
    }else if (url.includes('t.me')){
        return 'telegram'
    }else if (url.includes('twitter')){
        return 'twitter'
    }else if (url.includes('youtube')){
        return 'youtube'
    }else{
        return null;
    }
}