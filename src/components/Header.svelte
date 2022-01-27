<script>

    // properties
    export let lang;

    // load constants from json file
    import { SUPPORTED_LANGUAGES, SUBDIRECTORY, TITLE } from '../constants.json';

    // load libs
    import { isMobile } from '../libs/system.js';
    import { getString } from '../libs/translator.js';

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

<!-- Header -->
<div class="header">
    {#if isMobile()}
        <div class="center-container">
            <div style="left: 16px; cursor: pointer" on:click={() => window.open("https://www.charitableanalytics.org/", '_blank')}>
                <img id="logo" alt="logo" src="{SUBDIRECTORY}assets/logo.png">
            </div>
            <div style="right: 16px; max-width: 50vw; margin: 0px auto;">
                {#each SUPPORTED_LANGUAGES as language}
                    <a href={get_language_url(language['key'])}>{language['mobile']}</a>
                {/each}
            </div>
        </div>
    {:else}
        <div class="center-container">
            <div style="left: 16px; cursor: pointer" on:click={() => window.open("https://www.charitableanalytics.org/", '_blank')}>
                <img id="logo" alt="logo" src="{SUBDIRECTORY}assets/logo.png">
            </div>
            <div style="left: 0px; right: 0px; text-align: center;">
                <p style="max-width: 30vw; margin: 0px auto;">{TITLE}</p>
            </div>
            <div style="right: 16px; max-width: 30vw;">
                {#each SUPPORTED_LANGUAGES as language}
                    <a href={get_language_url(language['key'])}>{language['name']}</a>
                {/each}
            </div>
        </div>
    {/if}
</div>


<style>

    .header {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        height: var(--header-height);
        padding: 0px;
        margin: 0px;
        border-bottom: 1px solid var(--black);
        background-color: var(--white);
        z-index: 999;
    }

    .center-container {
        position: absolute;
        display: inline-flex;
        left: 0px;
        right: 0px;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
    }

    .center-container div {
        position: absolute;
    }

    .header p {
        font-size: var(--font-size-very-very-very-small);
        font-weight: var(--font-weight-normal);
    }

    .header a {
        font-size: var(--font-size-very-small);
        margin-left: 16px;
    }

    .header img {
        max-width: 150px;
    }


</style>