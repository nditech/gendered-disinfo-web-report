<script>

</script>

<div id="container">
    <div id="loader"></div>
</div>

<style>

    #container { 
        overflow: hidden;
        text-align: center;
        padding-top: 108px;
        padding-bottom: 32px;
        margin-top: 64px;
        margin-bottom: 64px;
    }

    #loader {
        margin: auto;
        text-align: center;
        display: inline-block;
        margin-left: -76px;
        margin-top: -76px;
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid var(--main-color); /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        z-index: 11;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

</style>