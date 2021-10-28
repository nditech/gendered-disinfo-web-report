<script>

    // properties
    export let lang;
    export const id = "discussion";

    // components
    import TextBlock from '../components/TextBlock.svelte';


    // ---
    const title = 'Discussion';
    const html = `
        <p>
            ...
        </p>
    `;

</script>

    <h1 class="subtitle">{title}</h1>
    <TextBlock html={html}/>

<style>

</style>