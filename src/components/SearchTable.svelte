<script>

    // properties
    export let word_mapping;
    export let documents;
    export let placeholders;

    // variables
    let searchbar_disable = false;
    let table_disable = false;
    let results, info = '', _results = [];

    // onchange max nbr of results
    const max_nbr_results_onchange = 20;
    const max_nbr_results_onsubmit = 3000;
    const headers = ['Source', 'Keyword', 'Published On', 'Link'];

    // locale lib
    import { clean_str } from '../libs/locale.js';

    // import components
    import SearchBar from './SearchBar.svelte';
    import Table from './Table.svelte';


    // create an object mapping word ids to documents
    let word_id_to_documents = {};
    Object.values(word_mapping).forEach(word_id => {
        word_id_to_documents[word_id] = [];
    });
    documents.forEach((document, i) => {
        document['wv'].forEach(word_id => {
            word_id_to_documents[word_id].push(i)
        })
    })
    Object.keys(word_id_to_documents).forEach(word_id => {
        word_id_to_documents[word_id] = [...new Set(word_id_to_documents[word_id])]
    })


    // sources
    // documents.map()


    // inverse word mapping
    let inv_word_mapping = {}
    Object.keys(word_mapping).forEach(word => {
        inv_word_mapping[word_mapping[word]] = word;
    })


    function source_lookup(value){
        if(value === undefined || value === null || value.length === 0) return [];

        // convert words to ids using mapping
        let words = value.split(' ').map(word => clean_str(word));

        return ''
    }

    function document_lookup(value){
        if(value === undefined || value === null || value.length === 0) return [];

        // convert words to ids using mapping
        let word_ids = value.split(' ').map(word => word_mapping[clean_str(word)])

        // remove undefined
        word_ids = word_ids.filter(d => d !== undefined);

        // remove duplicates
        word_ids = [...new Set(word_ids)];

        // if no
        if(word_ids.length === 0) return [];

        // map word ids to documents containing these words
        let document_ids = word_ids.map(word_id => word_id_to_documents[word_id]);

        // keep the intersection of documents
        document_ids = document_ids.reduce((p,c) => p.filter(e => c.includes(e)));

        return document_ids.map(document_id => {
            const document = documents[document_id];
            const words = word_ids.map(wid => inv_word_mapping[wid.toString()]).join(';');
            return [document['source_name'], words, document['t'], document['l']]
        })
    }


    // searchbar callbacks
    function onchange(value){
        // reduce opacity of table
        table_disable = true;

        _results = document_lookup(value).splice(0, max_nbr_results_onchange);

        // add headers
        _results.unshift(headers)

        // set
        info = '';
        results = _results;
    }

    function onsubmit(value){
        // disable search bar
        searchbar_disable = true;

        // need to add this if not disable doesnt work
        setTimeout(() => {
            // search document
            _results = document_lookup(value).splice(0, max_nbr_results_onsubmit);

            // add headers
            _results.unshift(headers)

            // set
            info = `${_results.length-1 === max_nbr_results_onsubmit ? 'max ' : ''}${_results.length-1} ${_results.length-1 > 1 ? 'results' : 'result'}`;
            results = _results;

            // enable search bar
            searchbar_disable = false;

            // enable table
            table_disable = false;
        }, 50)
    }

    // add headers
    _results.unshift(headers)

    // set
    results = _results;

</script>


<SearchBar bind:disable={searchbar_disable} onchange={onchange} onsubmit={onsubmit} placeholders={placeholders}/>
<div class="separator"></div>
<Table bind:disable={table_disable} bind:data={results}/>
{#if results.length-1 >= max_nbr_results_onsubmit}
    <p style='color:red;'>{info}</p>
{:else}
    <p>{info}</p>
{/if}


<style>

    .separator {
        margin: 0px;
        padding: 0px;
        margin-top: 16px;
    }

    p {
        margin: auto;
        margin-top: -26px;
        font-size: var(--font-size-very-very-small);
        color: var(--black)
    }

</style>