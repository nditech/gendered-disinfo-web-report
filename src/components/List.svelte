<script>

    // properties
    export let elements;


</script>


<div class="content">
    <ol type="i">
        {#each elements as element}
        <li>
            {element}
        </li>
        {/each}
    </ol>
</div>


<style>

    div.content {
        text-align: justify;
        margin: auto;
        font-weight: var(--font-weight-normal);
        max-width: var(--max-width);
        color: var(--black);
        font-size: var(--font-size-small);
    }

    ol {
        margin-left: 32px;
        margin-right: 32px
    }

</style>