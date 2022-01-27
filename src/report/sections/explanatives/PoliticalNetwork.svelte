<script>

    // load constants
    import { SUBDIRECTORY } from '../../../constants.json';

</script>


<div id="political-network-container" class="container">
    <div class="political-network">
        <img alt="institutions" src="{SUBDIRECTORY}assets/images/institutions.png">
        <h1>Institutions</h1>
        <p>Bureaucrats/Technocrats</p>
        <p>State Affiliated Financial Actors</p>
        <p>Business Leaders (private sector)</p>
    </div>
    <div class="political-network">
        <img alt="politics" src="{SUBDIRECTORY}assets/images/politics.png">
        <h1>Politics</h1>
        <p>Elected Officials</p>
        <p>Staff of Elected Officials</p>
        <p>Political Operatives</p>
    </div>
    <div class="political-network">
        <img alt="society" src="{SUBDIRECTORY}assets/images/society.png">
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
        padding: 32px;
        display: inline-block;
        align-items: center;
        text-align: center;
        max-width: 220px;
    }

    .political-network h1{
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-very-small);
        margin: 0px;
        padding: 0px;
        color: var(--black);
    }

    .political-network p{
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-very-very-very-small);
        word-spacing: var(--word-spacing-small);
        margin: 0px;
        padding: 0px;
        line-height: var(--line-height-small);
        color: var(--black);
        background-color: var(--white-transparent);
        box-shadow: var(--white-box-shadow);
    }

    img {
        height: 80px;
        width: auto;
        padding: 4px;
        margin: 0px;
        /* filter: brightness(0) invert(1); */
        opacity: 0.7;
    }

</style>