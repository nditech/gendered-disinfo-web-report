<script>

    // constants
    import { TITLE, DESCRIPTION } from './constants.json';

    // load libs
    import { getUrlParams } from './libs/url.js';
    import { getString } from './libs/translator.js';
    import { isMobile } from './libs/system.js';
    import { onMount } from 'svelte';

    // grab params from url
    const params = getUrlParams();
    let { lang } = params;

    // set values
    lang = lang || 'eng';

    // import components
    import Header from './components/Header.svelte';
    import Footer from './components/Footer.svelte';

    // import background
    import Background from './report/Background.svelte';

    // import report
    import CoverPage from './report/CoverPage.svelte';
    import Report from './report/Report.svelte';

    // init variables
    let _scrollTop = 0;
    let _screenHeight = 0;
    let hide_cover = false

    onMount(() => {

        // set screen height
        _screenHeight = window.innerHeight;

        // wait for the whole UI to have loaded
        setTimeout(() => {

            // grab main
            const main = document.querySelector('main');

            // monitor scrolling
            main.addEventListener('scroll', function(e){
                _scrollTop = main.scrollTop;
                hide_cover = _scrollTop > _screenHeight*0.1;
            })

        }, 200);
    })

</script>


<!-- Set app name -->
<title>{TITLE}</title>

<!-- Header -->
<Header bind:lang={lang}/>


<!-- Background (not on mobile) -->
<Background/>


<!-- Cover page -->
<CoverPage bind:scrollTop={_scrollTop} bind:lang={lang}/>


<!-- Report -->
<Report bind:lang={lang}/>


<!-- Footer -->
{#if hide_cover}
    <Footer bind:lang={lang}/>
{/if}


<style>

    /* --- CSS variables --- */
    :global(:root) {
        --black-dark: #000;
        --black: #222;
        --black-light: #555;
        --black-very-light: #777;
        --black-transparent: rgba(34, 34, 34, 0.8);
        --white: #fff;
        --white-dark: #999;
        --red: #e44e4e;
        --green: #009900;
        --black-box-shadow: 0px 0px 12px 4px var(--black-transparent);
        --white-transparent: rgba(255, 255, 255, 0.7);
        --white-box-shadow: 0px 0px 12px 4px rgba(255, 255, 255, 0.7);
        --main-color: var(--black);
        --main-color-dark: var(--black-dark);
        --main-color-light: var(--black-light);
        --header-height: 64px;
        --footer-height: 64px;
        --max-width-small: 40vw;
        --max-width: 60vw;
        --max-width-large: 75vw;
        --max-width-very-large: 85vw;
        --section-padding: 32px;
        --section-padding-small: 16px;
        --font-size-very-very-very-small: 0.65em;
        --font-size-very-very-small: 0.8em;
        --font-size-very-small: 0.9em;
        --font-size-small: 1.0em;
        --font-size-normal: 1.3em;
        --font-size-large: 1.8em;
        --font-size-very-large: 2em;
        --font-weight-bold: 600;
        --font-weight-normal: 400;
        --font-weight-light: 200;
    }

    /* adjust variables if screen is small */
    @media (max-width: 518px) {
        :global(:root) {
            --footer-height: 83px;
            --max-width-small: 70vw;
        }
    }


    /* --- General elements --- */    
    :global(body) {
        background-color: var(--white);
        font-family: 'Roboto-Mono';
        padding-top: var(--header-height);
        /* position: relative; */
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin: 0;
        padding: 0px;
        box-sizing: border-box;
    }

    :global(input){
        font-family: 'Roboto-Mono';
    }

    :global(p){
        color: var(--black);
        margin: 0px;
        padding: 0px;
    }

    :global(::selection){
        background-color: var(--white-dark);
    }

    :global(a){
        color: var(--black);
        margin: 0px;
        padding: 0px;
    }

    :global(a:hover) {
        text-decoration: underline;
        color: var(--black-light);
    }

    :global(hr) {
        max-width: var(--max-width);
        margin: 0px auto;
        padding: 0px;
        opacity: 0.5;
        border-width: 0px;
        border-bottom: 1px solid var(--white);
    }

    :global(li) {
        margin: 0px;
        padding: 0px;
        margin-bottom: 8px;
    }

    /* --- General classes */
    :global(.red) {
        color: var(--red);
    }
    
    :global(.italic) {
        font-style: italic;
    }

    :global(.underline) {
        text-decoration: underline;
        margin-bottom: 4px;
    }

    :global(.title) {
        text-align: left;
        margin: 0em auto 0.5em;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-very-large);
        max-width: var(--max-width);
    }

    :global(.subtitle) {
        text-align: left;
        margin: 1.0em auto 0.5em;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-large);
        max-width: var(--max-width);
    }

    :global(.subsubtitle) {
        text-align: left;
        margin: 1.0em auto 0.5em;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-normal);
        max-width: var(--max-width);
    }

    :global(section) {
        margin: 32px auto 0px;
        padding: var(--section-padding);
        font-weight: var(--font-weight-normal);
        max-width: var(--max-width);
        color: var(--black);
        background-color: var(--white-transparent);
        box-shadow: var(--white-box-shadow);
        font-size: var(--font-size-small);
        border-width: 0px;
        border: 1px solid var(--white);
        text-align: justify;
    }

    /* styles for browsers smaller than 600px; */
    @media (max-width : 599px) {
        :global(section) {
            font-size: var(--font-size-very-small);
            max-width: var(--max-width-very-large);
            padding: var(--section-padding-small);
            word-spacing: -2px;
        }

        :global(.title) {
            max-width: var(--max-width-very-large);
        }

        :global(.subtitle) {
            max-width: var(--max-width-very-large);
        }

        /* enumerations have less left padding */
        :global(ul) {
            padding-left: 24px;
        }
    }
    

    /* --- Fonts --- */
    @font-face {
        font-family: 'Abel';
        font-style: normal;
        font-weight: 400;
        src: url('/assets/fonts/Abel/Abel-Regular.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto-Mono';
        src: url('/assets/fonts/Roboto_Mono/RobotoMono-VariableFont_wght.ttf') format('truetype');
    }


    /* --- Prompt (sweet alert) --- */
    :global(.swal-footer){
        text-align: center;
    }

    :global(.swal-button){
        background-color: var(--black-light);
        border-width: 0px;
        border: 1px solid var(--white);
        box-shadow: none;
    }

    :global(.swal-button:focus){
        box-shadow: none;
    }

    :global(.swal-button:not([disabled]):hover){
        background-color: var(--black-very-light);
    }

    :global(.swal-modal) {
        background-color: var(--black);
        border-width: 0px;
        border: 1px solid var(--white);
    }

    :global(.swal-title){
        color: var(--white);
        margin: 0px;
        padding: 0px;
    }

    :global(.swal-text){
        color: var(--white);
        margin: 0px;
        padding: 0px;
    }


    /* --- Transtions --- */
    :global(.fade-in) {
        animation: fadeIn 0.3s;
        -webkit-animation: fadeIn 0.3s;
        -moz-animation: fadeIn 0.3s;
        -o-animation: fadeIn 0.3s;
        -ms-animation: fadeIn 0.3s;
        opacity: 1.0;
    }

    :global(.fade-in-long) {
        animation: fadeIn 3.0s;
        -webkit-animation: fadeIn 3.0s;
        -moz-animation: fadeIn 3.0s;
        -o-animation: fadeIn 3.0s;
        -ms-animation: fadeIn 3.0s;
        opacity: 1.0;
    }

    :global(.fade-out) {
        animation: fadeOut 0.5s;
        -webkit-animation: fadeOut 0.5s;
        -moz-animation: fadeOut 0.5s;
        -o-animation: fadeOut 0.5s;
        -ms-animation: fadeOut 0.5s;
        opacity: 0.0;
    }

    :global(.footer-up) {
        animation: moveUp 0.5s;
        -webkit-animation: moveUp 0.5s;
        -moz-animation: moveUp 0.5s;
        -o-animation: moveUp 0.5s;
        -ms-animation: moveUp 0.5s;
        height: var(--footer-height);
    }


    /* D3 tooltip */
    :global(.tooltip) {
        display: none;
        position: fixed;
        text-align: left;
        border: 1px solid var(--black);
        background: var(--white);
        color: var(--black);
        text-transform: capitalize;
        margin: 0px;
        padding: 8px;
        z-index: 998;
        line-height: 1.2em;
        max-width: 350px;
    }

    :global(.tooltip h1) {
        font-size: var(--font-size-normal);
        margin: 0px;
        padding: 0px;
    }

    :global(.tooltip h2) {
        font-size: var(--font-size-small);
        margin: 0px;
        margin-bottom: 4px;
        padding: 0px;
    }

    :global(.tooltip p) {
        font-size: var(--font-size-very-small);
        margin: 0px;
        padding: 0px;
    }


    /* D3 function */
    :global(.hidden){
        visibility: hidden;
    }

    

    /* --- Fade in --- */
    @keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }

    @-moz-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }

    @-webkit-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }

    @-o-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }

    @-ms-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
    }


    /* --- Move Up --- */
    @keyframes moveUp {
        0% {height: 0px}
        100% {height: var(--footer-height);}
    }

    @-moz-keyframes moveUp {
        0% {height: 0px}
        100% {height: var(--footer-height);}
    }

    @-webkit-keyframes moveUp {
        0% {height: 0px}
        100% {height: var(--footer-height);}
    }

    @-o-keyframes moveUp {
        0% {height: 0px}
        100% {height: var(--footer-height);}
    }

    @-ms-keyframes moveUp {
        0% {height: 0px}
        100% {height: var(--footer-height);}
    }


    /* --- Fade Out --- */
    @keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
    }

    @-moz-keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
    }

    @-webkit-keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
    }

    @-o-keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
    }

    @-ms-keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
    }

</style>