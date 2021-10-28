<script>

    // properties
    export let lang;
    export let string_key;
    export let disabled;

    // locale lib
    import { getString } from '../libs/locale.js';

</script>

<div>
    <button on:click disabled={disabled}>{getString(lang, string_key)}</button>
</div>

<style>

    div{
        text-align: center;
    }

    button{
        cursor: pointer;
    }

</style>