<script>

    // properties
    export let lang;

    const email = "info@charitableanalytics.org"

</script>


<div>
    <hr>
    <p class="italic">For any inquiries contact us at <a href="mailto:{email}" target="_blank" rel="noopener noreferrer">{email}</a></p>
    <p><a href="/assets/files/pgp.pub" target="_blank" rel="noopener noreferrer">PGP Public Key</a></p>
</div>



<style>

    div {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        text-align: center;
        margin: 0px auto;
        padding: 0px;
        z-index: 0;
        background-color: transparent;
    }

    hr {
        max-width: var(--max-width-large);
        margin: 0px auto;
        padding: 0px;
    }

    p {
        margin: 10px 0px;
        font-size: var(--font-size-small);
        font-weight: var(--font-weight-light);
        color: var(--black);
    }

    a {
        margin: 10px 0px;
        font-size: var(--font-size-small);
        font-weight: var(--font-weight-light);
        color: var(--black);        
    }

    a:hover {
        text-decoration: underline;
        color: var(--black-light);
    }


    @media (max-width : 599px) {
        /* styles for browsers smaller than 600px; */
        p {
            font-size: var(--font-size-very-small);
        }

        a {
            font-size: var(--font-size-very-small);
        }
    }

</style>