<script>

    // properties
    export let posts, dictionary, params;

    // import components
    import SearchTable from '../../../components/SearchTable.svelte';

</script>


<section>

    <SearchTable placeholders={params['examples']['queries']} documents={posts} word_mapping={dictionary}/>

</section>


<style>

</style>