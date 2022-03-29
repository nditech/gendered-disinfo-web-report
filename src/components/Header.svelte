<script>

    // properties
    export let lang;
    export let isMobile;

    // import config
    import { SUPPORTED_LANGUAGES, SUBDIRECTORY, TITLE, AUTHOR_DOMAIN } from '../config.json';

    // change url
    function get_language_url(lang){
        const current = window.location.href;
        if (current.includes('lang=')){
            return `${current.split('?')[0]}?lang=${lang}`
        }else{
            return `${current}?lang=${lang}`
        }
    }

</script>


<nav>
    <div id="logo" on:click={() => window.open(AUTHOR_DOMAIN, '_blank')}>
        <img alt="logo" src="{SUBDIRECTORY}assets/ndi-logo.svg">
    </div>

    {#if isMobile}
        <li id="languages">
            {#each SUPPORTED_LANGUAGES as language}
                <a href={get_language_url(language['key'])}>{language['mobile']}</a>
            {/each}
        </li>
    {:else}
        <p id="title">{TITLE}</p>

        <li id="languages">
            {#each SUPPORTED_LANGUAGES as language}
                <a href={get_language_url(language['key'])}>{language['name']}</a>
            {/each}
        </li>
    {/if}

</nav>


<style>


    nav {
        position: absolute;
        display: flex;
        align-items: center;
        top: 0px;
        left: 0px;
        right: 0px;
        padding: 8px;
        background: var(--white);
        border-bottom: 1px solid var(--black);
        z-index: 9;
    }

    #title {
        position: absolute;
        left: 0px;
        right: 0px;
        text-align: center;
        max-width: 30vw; 
        margin: 0px auto;
        display: inline;
        color: var(--black);
        font-size: var(--font-size-very-very-very-small);
        font-weight: var(--font-weight-normal);
    }

    #languages {
        position: absolute;
        max-width: 30vw;
        right: 0px;
        display: inline;
        padding: 0px;
        margin: 0px;
    }

    #languages a {
        display: inline;
        font-size: var(--font-size-very-very-small);
        font-weight: var(--font-weight-normal);
        cursor: pointer;
        padding: 0px;
        margin: 0px;
        padding-right: 24px;
    }


    #logo {
        float: left;
        margin: 0px;
        padding: 0px;
    }

    #logo img {
        height: 36px;
        width: auto;
    }



    /* adjust variables if screen is small */
    @media (max-width: 518px) {
        #languages { 
            max-width: 80vw;
        }
    }

</style>