<script>

    // import constants
    import { URL_PREFIX } from '../../constants.json'

</script>


<div id="political-network-container" class="container">
    <div class="political-network">
        <img alt="institutions" src="{URL_PREFIX}/assets/explanatives/institutions.png">
        <h1>Institutions</h1>
        <p>Bureaucrats/Technocrats</p>
        <p>State Affiliated Financial Actors</p>
        <p>Business Leaders (private sector)</p>
    </div>
    <div class="political-network">
        <img alt="politics" src="{URL_PREFIX}/assets/explanatives/politics.png">
        <h1>Politics</h1>
        <p>Elected Officials</p>
        <p>Staff of Elected Officials</p>
        <p>Political Operatives</p>
    </div>
    <div class="political-network">
        <img alt="society" src="{URL_PREFIX}/assets/explanatives/society.png">
        <h1>Society</h1>
        <p>Political Families</p>
        <p>Traditional and Religious Leaders</p>
        <p>Cultural Leaders</p>
    </div>
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
    }

    .political-network{
        margin: 0px;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 16px;
        padding-bottom: 16px;
        display: inline-block;
        align-items: center;
        text-align: center;
        max-width: 200px;
    }

    .political-network h1{
        font-weight: var(--font-bold);
        font-size: var(--font-size-very-small);
        color: var(--black);
        margin: 0px;
        padding: 0px;
    }

    .political-network p{
        font-weight: var(--font-normal);
        font-size: var(--font-size-very-very-very-small);
        color: var(--black);
        word-spacing: var(--word-spacing-small);
        margin: 0px;
        padding: 0px;
        line-height: var(--line-height-small);
    }

    img {
        width: 80px;
        padding: 0px;
        margin: 0px;
        height: auto;
        opacity: 0.6;
    }


</style>