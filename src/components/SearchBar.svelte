<script>

    // properties
    export let disable = false;
    export let onchange;
    export let onsubmit;
    export let placeholders;

    // internal variable
    let _value;
    let __value;

    // import constants
    import { SUBDIRECTORY } from '../constants.json';

    // locale lib
    import { clean_str } from '../libs/locale.js';

    // on value change, clean
    $: if(_value !== undefined && _value !== null){
        __value = clean_str(_value.trim().replaceAll('&nbsp;', ' '));
        _onchange();
    }

    // on change
    function _onchange(){
        if(disable) return;
        onchange(__value);
    }

    // on submit
    function _onsubmit(){
        if(disable) return;
        onsubmit(__value)
    }

    // animate placeholder
    let placeholder = 'Search';
    let placeholders_pointer = -1;
    let placeholder_letter_pointer = 0;
    const change_placeholder_delay_ms = 3500;
    const end_pause = 1500;

    // function to animate one iteration
    function run_iter(){
        if(!Array.isArray(placeholders) || placeholders.length === 0) return;

        // reset
        placeholder_letter_pointer = 0;

        // increment pointer
        placeholders_pointer = (placeholders_pointer + 1) % placeholders.length;

        // select placeholder
        const _placeholder = placeholders[placeholders_pointer];

        // add one letter at a time
        const delay = Math.floor((change_placeholder_delay_ms - end_pause)/(1.0*_placeholder.length));

        const next_letter = () => {

            // stop if we have reached the full word
            if(placeholder_letter_pointer > _placeholder.length) return;

            // set
            placeholder = _placeholder.substring(0, placeholder_letter_pointer++)

            // launch the next
            setTimeout(() => {
                next_letter();
            }, delay)
        }

        // start
        next_letter();
    }

    // run in loop
    setInterval(() => {
        run_iter();
    }, change_placeholder_delay_ms)

    // trigger now
    run_iter();

</script>


<div id="search-bar" style="margin: auto;">
    <input title="search-input" type="text" placeholder={placeholder} bind:value={_value}>
    <button disabled={disable} title="Search" on:click={_onsubmit}>
        <img alt="Search" src="{SUBDIRECTORY}assets/images/search.svg">
    </button>
</div>


<style>

    #search-bar {
        display: flex;
        max-width: var(--max-width-small);
    }

    #search-bar > input {
        text-align: left;
        line-height: 35px;
        padding: 0 10px;
        border: 1px solid #999;
        flex: 1;
        font-size: var(--font-size-very-small);
        letter-spacing: var(--letter-spacing);
        word-spacing: var(--word-spacing);
    }

    #search-bar > input:focus {
        outline: 0;
        -webkit-box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.075), 0 0 8px var(--main-color-light);
        box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.075), 0 0 8px var(--main-color-light);
    }

    #search-bar > button {
        background-color: var(--main-color);
        border: 1px solid #999;
        border-left: 0;
        outline: 0;
        flex-basis: 40px;
        cursor: pointer;
        width: auto;
        height: auto;
        float: center;
        border-radius: 0;
    }

    #search-bar > button:disabled,
    #search-bar > button[disabled] {
        background-color: var(--main-color-dark);
        opacity: 0.7;
    }

    #search-bar > button:hover {
        background-color: var(--main-color-dark);
    }

    #search-bar > button img {
        height: 18px;
    }


</style>