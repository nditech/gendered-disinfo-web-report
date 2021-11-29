<script>

    // properties
    export let elements;


</script>


<div class="content">
    <ol type="i">
        {#each elements as element}
        <li>
            {@html element}
        </li>
        {/each}
    </ol>
</div>


<style>

    div.content {
        text-align: justify;
        margin: 0px auto;
        padding: 0px;
        font-weight: var(--font-weight-normal);
        max-width: var(--max-width);
        color: var(--black);
        font-size: var(--font-size-small);
    }

    ol {
        margin-left: 32px;
        margin-right: 32px
    }

    li {
        background-color: rgba(255, 255, 255, 0.7);
        box-shadow: 0px 0px 12px 4px rgba(255, 255, 255, 0.7);
    }

</style>