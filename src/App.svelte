<script>

    // load constants from json file
    import { SUPPORTED_LANGUAGES, URL_PREFIX } from './constants.json';

    // locale lib
    import { loadLangFromURL, getUrlParams } from './libs/url.js';

    // import Pages
    import Article from './Article.svelte';

    // grab params from url
    const params = getUrlParams();
    let { lang } = params;

    // set values
    lang = lang || 'eng';

    // locale lib
    import { getString } from './libs/locale.js';

    // check if on mobile
    import { isMobile } from './libs/system.js';

    function get_url(lang){
        const current = window.location.href;
        if (current.includes('lang=')){
            return `${current.split('?')[0]}?lang=${lang}`
        }else{
            return `${current}?lang=${lang}`
        }
    }

</script>

<!-- Set app name -->
<title>{getString(lang, `short_title`)}</title>

<!-- Header -->
{#if isMobile()}
    <div class="header">
        <div style="width: 50%; justify-content: flex-start; cursor: pointer" on:click={() => window.open("https://www.charitableanalytics.org/", '_blank')}>
            <img id="logo" alt="logo" src="{URL_PREFIX}/assets/logo.png">
        </div>
        <div style="width: 50%; justify-content: flex-end;">
            {#each SUPPORTED_LANGUAGES as language}
                <a href={get_url(language['key'])}>{language['mobile']}</a>
            {/each}
        </div>
    </div>
{:else}
    <div class="header">
        <div style="width: 25%; justify-content: flex-start; cursor: pointer" on:click={() => window.open("https://www.charitableanalytics.org/", '_blank')}>
            <img id="logo" alt="logo" src="{URL_PREFIX}/assets/logo.png">
        </div>
        <div style="width: 50%; justify-content: center; text-align: center;">
            <h3>{getString(lang, `short_title`)}</h3>
        </div>
        <div style="width: 25%; justify-content: flex-end;">
            {#each SUPPORTED_LANGUAGES as language}
                <a href={get_url(language['key'])}>{language['name']}</a>
            {/each}
        </div>
    </div>
{/if}


<!-- Where the content goes -->
<Article lang={lang}/>


<!-- Footer -->
<div class="footer">
    <hr>
    {@html getString(lang, 'footer')}
</div>


<style>

    .header {
        padding: 8px 16px;
        margin: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, .3);
        background-color: white;
        z-index: 999;
    }

    .header div {
        margin: 0px;
        padding: 0px;
        display: flex;
        align-items: center;
    }

    .header h3 {
        font-size: var(--font-size-very-very-very-small);
        font-weight: 300;
        margin: 0px;
        padding: 0px;
        color: var(--black);
    }

    .header a {
        color: var(--black);
        font-size: var(--font-size-very-small);
        margin-left: 16px;
    }

    .header img {
        max-width: 150px;
    }

    .footer {
        margin: 48px auto 0px;
        padding-bottom: 16px;
        max-width: var(--max-width-large);
        text-align: center;
        font-weight: 300;
        font-style: italic;
        font-size: var(--font-size-very-small);
        color: var(--black);
    }

</style>