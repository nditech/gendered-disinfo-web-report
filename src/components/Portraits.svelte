<script>

    // properties
    export let data;

    // import constants
    import { SUBDIRECTORY } from '../constants.json';

    function nFormatter(num){
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num;
    }

    // process
    const portraits = data.map(source => {

        // get all the endpoints key as an array & sorted in increasing alphabetical order (e.g ['facebook', 'telegram'])
        const endpoints = Object.keys(source['endpoint']).sort();

        // map the endpoints to an HTML block 
        const elements = endpoints.map(key => {
            return `
                <a target="_blank" href="${source['endpoint'][key]['url']}"" style="margin: 8px; width: 25%">
                    <img src="${SUBDIRECTORY}assets/images/${key}.png" width=16 height=16>
                    <p style="font-size:12px;margin:0px;padding:0px">
                        ${nFormatter(source['endpoint'][key]['followers'])}
                    </p>
                </a>
            `
        })

        const html = `<div style="display: flex; justify-content: center;">${elements.join('')}</div>`

        return {
            'name': source['name'],
            'description': source['description'],
            'endpoint': source['endpoint'],
            'src': `${SUBDIRECTORY}assets/portraits/${source['name'].replaceAll(' ', '_')}.jpg`,
            'html': html
        }
    })

</script>

<div class="container">
    {#each portraits as datum}
        <div class='portraits'>
            <img alt={datum['name']} src={datum['src']}>
            <h1>{datum['name']}</h1>
            <p>{datum['description']}</p>
            {@html datum['html']}
        </div>
    {/each}
</div>


<style>

    .container {
        text-align: center;
        margin: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: var(--max-width-large);
        padding: 0px;
        max-height: 400px;
        overflow-y: scroll;
        border: 0.5px solid var(--white-dark);
    }

    .portraits{
        margin: 0px;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 16px;
        padding-bottom: 16px;
        display: inline-block;
        align-items: center;
        text-align: center;
        max-width: 150px;
    }

    .portraits h1{
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-very-small);
        color: var(--black);
        margin: 0px;
        padding: 0px;
        text-transform: capitalize;
    }

    .portraits p{
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-very-very-very-small);
        color: var(--black);
        word-spacing: var(--word-spacing-small);
        margin: 0px;
        padding: 0px;
        line-height: var(--line-height-small);
    }

    img {
        width: 100px;
        padding: 0px;
        margin: 0px;
        height: auto;
        opacity: 0.75;
        filter: grayscale(100%);
        border-radius: 50%;
        border: 1px solid var(--black);
    }

</style>

