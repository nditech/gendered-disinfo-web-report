<script>

    // import config
    import { SUBDIRECTORY } from '../../config.json';

</script>


<div id="data-collection-container" class="container">
    <div class="data-collection">
        <img alt="institutions" src="{SUBDIRECTORY}assets/images/twitter.png">
        <!-- <h1>Twitter</h1> -->
    </div>
    <div class="data-collection">
        <img alt="politics" src="{SUBDIRECTORY}assets/images/facebook.png">
        <!-- <h1>Facebook</h1> -->
    </div>
    <div class="data-collection">
        <img alt="society" src="{SUBDIRECTORY}assets/images/youtube.png">
        <!-- <h1>Youtube</h1> -->
    </div>
    <div class="data-collection">
        <img alt="society" src="{SUBDIRECTORY}assets/images/telegram.png">
        <!-- <h1>Telegram</h1> -->
    </div>
</div>


<style>

    .container {
        text-align: center;
        margin: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: var(--max-width-large);
        padding: 0px;
    }

    .data-collection{
        margin: 0px;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 16px;
        padding-bottom: 16px;
        display: inline-block;
        align-items: center;
        text-align: center;
        max-width: 200px;
    }

    img {
        width: 60px;
        padding: 0px;
        margin: 0px;
        height: auto;
        opacity: 0.7;
    }


</style>