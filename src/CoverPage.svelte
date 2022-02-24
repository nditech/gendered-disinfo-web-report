<script>

    // properties
    export let lang;

    // import config
    import { SUBDIRECTORY, AUTHOR, AUTHOR_DOMAIN } from './config.json';

    // import strings
    import { title, subtitle } from './strings.json';

</script>

<!-- Cover Page -->
<div id="cover">

    <!-- Image -->
    <div id="top-img-container">
        <img alt="cover photo" src="{SUBDIRECTORY}assets/images/cover.jpg" />
    </div>

    <!-- Title Box -->
    <div class="top-title-container">
        <br>
        <div>
            <p class="top-title">{title[lang]}</p>
            <p class="top-subtitle">{subtitle[lang]}</p>
        </div>
        <br>
        <div>
            <p style="margin-bottom: 0px;">by</p>
            <p class="authors"><a href={AUTHOR_DOMAIN} target="_blank">{AUTHOR}</a></p>
        </div>
        <br>
    </div>
    
</div>


<style>

    #cover {
        width: 100vw;
        height: 100vh;
        margin: 0px;
        padding: 0px;
        text-align: center;
    }
    
    /* Image */
    #top-img-container {
        height: 100vh;
    }

    #top-img-container img {
        height: 100%;
        width: auto;
        padding: 0px;
        margin: 0px;
        border-right: 1px solid var(--black);
        border-bottom: 1px solid var(--black);
    }

    #top-img-container p {
        bottom: 0vh;
        margin: 0px 8px;
        color: var(--black);
        font-size: var(--font-size-very-very-small);
    }

    /* Title */
    .top-title-container {
        position: relative;
        right: -50vw;
        bottom: 50vh;
        flex-direction: column;
        overflow: hidden;
        padding: 8px 32px;
        max-width: 40vw;
        min-width: 30vw;
        background-color: var(--white);
        opacity: 1;
        border: 1px solid var(--black);
        align-items: center;
    }

    /* styles for browsers smaller than 600px; */
    @media (max-width : 599px) {
        #top-img-container {
            right: 0px;
            text-align: right;
        }
    }
    @media (min-width : 599px) {
        #top-img-container {
            left: 0px;
            text-align: left;
        }
    }
    
    .authors {
        font-size: var(--font-size-small);
    }
    
    .top-title {
        margin: 0px;
        padding: 0px;
        margin-bottom: 8px;
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-large);
    }

    .top-subtitle {
        margin: 0px;
        padding: 0px;
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-small);
    }

    /* styles for browsers smaller than 600px; */
    @media (max-width : 599px) {
        .top-title-container {
            top: -80vh;
            left: 0px;
            right: 0px;
            margin: 0px auto;
        }
        .top-title {
            font-size: var(--font-size-normal);
        }
    }
</style>