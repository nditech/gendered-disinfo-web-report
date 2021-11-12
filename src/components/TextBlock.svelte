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
        margin: auto;
        font-weight: var(--font-weight-normal);
        max-width: var(--max-width);
        color: var(--black);
        hyphens: auto;
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