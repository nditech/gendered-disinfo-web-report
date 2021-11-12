<script>

    // properties
    export let html;

</script>


<div class="content">
    {@html html}
</div>


<style>

    div.content {
        text-align: justify;
        margin: 0px auto;
        padding: 0px;
        font-weight: var(--font-weight-normal);
        max-width: var(--max-width);
        color: var(--black);
        background-color: rgba(255, 255, 255, 0.7);
        box-shadow: 0px 0px 8px 4px rgba(255, 255, 255, 0.3);
    }

    @media (max-width : 599px) {
        /* styles for browsers smaller than 600px; */
        div.content {
            font-size: var(--font-size-very-small);
            word-spacing: var(--word-spacing-small);
            letter-spacing: var(--letter-spacing-small);
        }

        /* enumerations have less left padding */
        :global(ul) {
            padding-left: 24px;
        }
    }
    @media (min-width: 600px) {
        /* styles for browsers larger than 600px; */
        div.content {
            font-size: var(--font-size-small);
        }
    }

</style>