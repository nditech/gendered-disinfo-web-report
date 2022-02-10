<script>

    // load constants
    import { TITLE, DESCRIPTION, SUBDIRECTORY, AUTHOR, AUTHOR_DOMAIN } from './constants.json';

</script>

<!-- Cover Page -->
<div id="cover">

    <!-- Image -->
    <div id="top-img-container">
        <img alt="cover photo" src="{SUBDIRECTORY}assets/images/cover.jpg" />
        <p>by Cara Zwibel & Evan Balgord</p>
    </div>

    <!-- Title Box -->
    <div class="top-title-container">
        <div class="vert-cell"></div>
        <div class="vert-cell">
            <p class="top-title">{TITLE}</p>
            <p class="top-subtitle">{DESCRIPTION}</p>
        </div>
        <div class="vert-cell"></div>
        <div class="vert-cell">
            <p style="margin-bottom: 0px;">by</p>
            <p class="authors"><a href={AUTHOR_DOMAIN} target="_blank">{AUTHOR}</a></p>
        </div>
        <div class="vert-cell"></div>
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
    /* Title */
    .top-title-container {
        position: relative;
        height: 33vh;
        bottom: 40vh;
        right: 5vw;
        display: flex;
        float: right;
        flex-direction: column;
        overflow: hidden;
        padding: 8px 32px;
        max-width: 40vw;
        min-width: 30vw;
        background-color: var(--white);
        opacity: 1;
        border: 1px solid var(--black);
        align-items: center;
        justify-content: space-between;
    }

    .authors {
        font-size: var(--font-size-small);
    }
    
    .vert-cell{
        height: 100%;
    }
    
    .top-title {
        margin: 0px;
        padding: 0px;
        margin-bottom: 8px;
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-very-large);
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
            height: 66vh;
            top: 17vh;
            left: 0px;
            right: 0px;
            margin: 0px auto;
        }
        .top-title {
            font-size: var(--font-size-large);
        }
    }
</style>