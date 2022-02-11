<script>

    // properties
    export let lang;

    // import config
    import { SUBDIRECTORY, EMAIL } from '../config.json';

    // load libs
    import { getString } from '../libs/translator.js';

</script>


<div>
    <p class="italic" style="margin-top: 8px; margin-bottom: 8px;">For inquiries contact us at <a href="mailto:{EMAIL}">{EMAIL}</a></p>
    <p style="padding-bottom: 8px;"><a href='{SUBDIRECTORY}assets/files/pgp.pub.txt' target='_blank'>PGP Public Key</a></p>
</div>


<style>

    div {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        text-align: center;
        margin: 0px auto;
        padding: 0px;
        border-top: 1px solid var(--black);
        background-color: var(--white);
        z-index: 999;
    }

    p {
        margin: 0px;
        padding: 0px;
        font-size: var(--font-size-very-very-small);
        font-weight: var(--font-weight-light);
    }

</style>