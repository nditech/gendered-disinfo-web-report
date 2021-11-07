<script>

    // Properties
    export let data;
    export let cell_func;
    export let table_id = `mtable-${Math.floor(Math.random()*10000)}`;
    export let disable = false;

    // import libs
    import { getFormattedDateTime } from '../libs/dt.js';

    // import constants
    import { URL_PREFIX } from '../constants.json';

    // ids
    const table_id_values = `${table_id}-values`;
    const table_id_headers = `${table_id}-headers`;

    // Variable storing the data to display
    let _headers = null;
    let _values = null;


    // applies something to each cell
    function iterate_through_cells(){
        // applies cell_func(cell, val, row_id, col_id)

        // grab all cells
        const cells = document.getElementById(table_id_values).getElementsByTagName('th');

        // iterate over
        for(let cell of cells){

            // grab value
            const val = cell.innerText;

            // grab position
            const { row_id, col_id } = cell.dataset;

            // apply
            if(typeof(cell_func) === 'function'){
                cell_func(cell, val, row_id, col_id);
            }
        }
    }

    // download content of table
    function download(){

        // create the filename using current time
        const filename = 'cai_' + getFormattedDateTime(0) + '.csv';

        // format data
        const _data = data.map(row => {
            return row.map(cell => `"${cell}"`).join(',')
        }).join('\n')

        // instantiate a blob using our tabular data
        const blob = new Blob([_data], { type: 'text/csv' })

        // Prompt the user to download
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename)
        } else {
            const elem = window.document.createElement('a')
            elem.href = window.URL.createObjectURL(blob)
            elem.download = filename
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
        }
    }


    // validation func
    function validate(df){

        if (!Array.isArray(df)){
            return false;
        }

        if (df.length < 1){
            console.error('invalid data for table - array of length < 1');
            return false;
        }

        if(!Array.isArray(df[0])){
            console.error('invalid data for table - first element not an array');
            return false;
        }

        if(df[0].length === 0){
            console.error('invalid data for table - first element of length 0');
            return false;
        }

        // init process var
        let _previous_length = df[0].length;

        // go through data
        for(let i=1 ; i<df.length ; i++){

            // check that each element is an array
            if(!Array.isArray(df[i])){
                console.error(`invalid data for table - ${i}th element not an array`);
                return false;
            }

            // check that each element has the same
            if(df[i].length !== _previous_length){
                console.error(`invalid data for table - ${i}th element not of same length`);
                return false;
            }
        }

        return true;
    }

    function set_column_width(){

        // get values' table
        const table_values = document.getElementById(table_id_values);
        if(table_values === null) return;

        // get headers' table
        const table_headers = document.getElementById(table_id_headers);
        if(table_headers === null) return;

        // get first row
        let first_tr = table_values.querySelectorAll("tr")[0];
        if(first_tr === undefined) return;

        // get values' table columns width
        let ths = first_tr.querySelectorAll("th");
        let column_widths_sum = 0.0;
        let column_widths = Array.from(ths, th => {
            const w = 1.0*th.getBoundingClientRect().width;
            column_widths_sum += w;
            return w;
        });

        // convert to percentage
        column_widths = column_widths.map(c => Math.round((100.0*c)/column_widths_sum))

        // check if we have 100%
        column_widths_sum = column_widths.reduce((a, b) => a + b, 0);
        if(column_widths_sum !== 100){
            column_widths[0] = (100-column_widths_sum) + column_widths[0];
        }

        // set column widths
        ths = table_headers.querySelectorAll("tr")[0].querySelectorAll("th");
        for (let i = 0; i < ths.length; i++){
            ths[i].style.width = `${column_widths[i]}%`;
        }

        let trs = table_values.querySelectorAll("tr");
        for (let j = 0; j < trs.length; j++){
            ths = trs[j].querySelectorAll("th");
            for (let i = 0; i < ths.length; i++){
                ths[i].style.width = `${column_widths[i]}%`;
            }
        }
    }

    // if all test passed
    $: if(validate(data)){

        // set values
        _values = data.filter((_, i) => {
            return i !== 0;
        });

        // set headers
        _headers = data[0];

        // update column width
        setTimeout(() => {
            set_column_width();

            // apply something to each cell
            iterate_through_cells();
        }, 100);

    }


</script>

{#if _headers !== null }
    <!-- Headers -->
    <div class="table-headers" id="{table_id_headers}" >
        <table>
            <tr>
                {#each _headers as d}
                    <th class='header'>{d}</th>
                {/each}
            </tr>
        </table>
    </div>
{/if}

{#if _values !== null && Array.isArray(_values) && _values.length > 0 }
    <!-- Values -->
    <div class="table-values" id="{table_id_values}">
        <table class={disable ? 'disabled' : 'enabled'}>
            {#each _values as row, row_id}
                <tr>
                    {#each row as value, col_id}
                        <th class='value' data-row_id='{row_id}' data-col_id='{col_id}'>
                            {#if value.length > 4 && value.substring(0, 4) === 'http'}
                                <a href={value} target="_blank">{value}</a>
                            {:else}
                                {value}
                            {/if}
                        </th>
                    {/each}
                </tr>
            {/each}
        </table>
    </div>

    <!-- Download -->
    <div class="download">
        <img alt="download" on:click={() => { download() }} src='{URL_PREFIX}/assets/imgs/download.png' width=30 height=30/>
    </div>
{/if}


<style>

    .disabled {
        opacity: 0.3;
    }

    .enabled {
        opacity: 1.0;
    }

    div {
        margin-left: auto;
        margin-right: auto;
        margin-top: -4px;
        margin-bottom: 0px;
        max-width: var(--max-width-small);
        max-height: 177px;
        overflow-y: scroll;
        padding-left: 8px;
        padding-right: 8px;
    }

    div.download {
        margin: auto;
        width: 100%;
        max-width: var(--max-width-small);
    }

    img {
        padding-top: 4px;
        opacity: 0.4;
        cursor: pointer;
        float: right;
    }

    img:hover {
        opacity: 0.2;
    }

    table, th {
        border-collapse: collapse;
        table-layout: fixed;
    }

    table {
        width: 100%;
    }

    tr {
        width: 100%;
    }

    th {
        padding: 8px;
        overflow: hidden;
        word-wrap:break-word;
        background-color: white;
        line-height: var(--line-height-small);
    }

    tr:not(:last-child) {
        border-bottom: 1px solid #ddd;
    }

    .table-headers {
        z-index: 900;
        padding-bottom: 8px;
        background-color: white;
        border: 1px solid #999;
    }

    .table-values {
        z-index: 800;
        background-color: white;
        border: 1px solid #999;
    }

    .value {
        font-weight: var(--font-normal);
        font-size: var(--font-size-very-very-very-small);
        text-transform: lowercase;
    }

    .header {
        font-weight: var(--font-bold);
        font-size: var(--font-size-very-very-small);
    }

    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 7px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(0, 0, 0, .5);
        box-shadow: 0 0 1px rgba(255, 255, 255, .5);
    }

</style>