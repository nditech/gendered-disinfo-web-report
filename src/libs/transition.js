'use strict';

export function add_scroll_fade_transition(el, delay=0, scroll_padding=0){
    // IMPORTANT : el cannot have a class

    // check
    if(el === null) {
        console.error('could not apply transition, element is null');
        return;
    }

    // grab main
    const main = document.querySelector('main');

    // grab screen height
    const screen_height = window.screen.height;

    // init to fade out
    el.classList.add('fade-out');

    // scroll fade in/out
    main.addEventListener('scroll', () => {

        // grab positions
        const { top, bottom } = el.getBoundingClientRect();

        // fade in/out if in view or out of view
        if(top > scroll_padding && top < screen_height - scroll_padding){
            setTimeout(() => {
                if(el.classList.contains('fade-out')) el.classList.remove('fade-out');
                el.classList.add('fade-in');
            }, delay)
        }else if(bottom > scroll_padding && bottom < screen_height - scroll_padding){
            setTimeout(() => {
                if(el.classList.contains('fade-out')) el.classList.remove('fade-out');
                el.classList.add('fade-in');
            }, delay)
        }else if(top < 0 && bottom > screen_height){
            setTimeout(() => {
                if(el.classList.contains('fade-out')) el.classList.remove('fade-out');
                el.classList.add('fade-in');
            }, delay)
        }else if(bottom < -scroll_padding){
            setTimeout(() => {
                if(el.classList.contains('fade-in')) el.classList.remove('fade-in');
                el.classList.add('fade-out');
            }, delay)
        }else if(top > screen_height + scroll_padding){
            setTimeout(() => {
                if(el.classList.contains('fade-in')) el.classList.remove('fade-in');
                el.classList.add('fade-out');
            }, delay)
        }
    });
}