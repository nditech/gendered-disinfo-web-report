<script>

    // load constants
    import { SUBDIRECTORY } from '../../constants.json';

</script>


<div id="information-disorder-container" class="container">
    <div class="information-disorder">
        <img alt="satire" src="{SUBDIRECTORY}assets/images/satire.png">
        <h1>Satire or Parody</h1>
        <p>The use of humor, irony, exaggeration, or ridicule to expose and criticize. Has the potential to fool.</p>
    </div>
    <div class="information-disorder">
        <img alt="misleading content" src="{SUBDIRECTORY}assets/images/misleading_content.png">
        <h1>Misleading Content</h1>
        <p>Misleading use of information to frame an issue or individual</p>
    </div>
    <div class="information-disorder">
        <img alt="imposter content" src="{SUBDIRECTORY}assets/images/imposter_content.png">
        <h1>Imposter Content</h1>
        <p>When genuine sources are impersonated</p>
    </div>
    <div class="information-disorder">
        <img alt="fabricated content" src="{SUBDIRECTORY}assets/images/fabricated_content.png">
        <h1>Fabricated Content</h1>
        <p>New content is 100% false, designed to deceive and do harm</p>
    </div>
    <div class="information-disorder">
        <img alt="false connection" src="{SUBDIRECTORY}assets/images/false_connection.png">
        <h1>False Connection</h1>
        <p>When headlines, visuals or captions don't support the content</p>
    </div>
    <div class="information-disorder">
        <img alt="false context" src="{SUBDIRECTORY}assets/images/false_context.png">
        <h1>False Context</h1>
        <p>When genuine content is shared with contextual information</p>
    </div>
    <div class="information-disorder">
        <img alt="manipulated content" src="{SUBDIRECTORY}assets/images/manipulated_content.png">
        <h1>Manipulated Content</h1>
        <p>When genuine information or imagery is manipulated to deceive</p>
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

    .information-disorder{
        margin: 0px;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 16px;
        padding-bottom: 16px;
        display: inline-block;
        align-items: center;
        text-align: center;
        max-width: 150px;
    }

    .information-disorder h1{
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-very-small);
        margin: 0px;
        padding: 0px;
        color: var(--black);
    }

    .information-disorder p{
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-very-very-very-small);
        word-spacing: var(--word-spacing-small);
        margin: 0px;
        padding: 0px;
        line-height: var(--line-height-small);
        color: var(--black);
        background-color: var(--white-transparent);
        box-shadow: var(--white-box-shadow);
    }

    img {
        width: 80px;
        padding: 0px;
        margin: 0px;
        height: auto;
        /* filter: brightness(0) invert(1); */
        opacity: 0.7;
    }

</style>