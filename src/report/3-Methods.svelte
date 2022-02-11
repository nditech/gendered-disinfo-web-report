<script>

    // properties
    export let lang;
    export let posts;
    export const id = "methods";

    // import strings
    import { methods } from '../strings.json';

    // explanatives
    import InformationDisorder from './explanatives/InformationDisorders.svelte';
    import PoliticalNetwork from './explanatives/PoliticalNetwork.svelte';
    import Lexicon from './explanatives/Lexicon.svelte';
    import ContentAnnotation from './explanatives/Annotation.svelte';
    import DataCollection from './explanatives/DataCollection.svelte';

</script>

<section id={id}>

    <h1 class="title">{methods['title'][lang]}</h1>
    
    {@html methods['1'][lang]}
    {@html methods['2'][lang]}
    {@html methods['3'][lang]}

    <h1 class="subtitle">{methods['subtitle_1'][lang]}</h1>

    {@html methods['4'][lang]}
    {@html methods['5'][lang]}

    <h1 class="subtitle">{methods['subtitle_2'][lang]}</h1>

    {@html methods['6'][lang]}
    {@html methods['7'][lang]}
    {@html methods['8'][lang]}
    {@html methods['9'][lang]}
    {@html methods['10'][lang]}

    <h1 class="subtitle">{methods['subsubtitle_1'][lang]}</h1>

    {@html methods['11'][lang]}
    <InformationDisorder/>

    <h1 class="subtitle">{methods['subsubtitle_2'][lang]}</h1>

    {@html methods['12'][lang]}

    <h1 class="subtitle">{methods['subsubtitle_3'][lang]}</h1>

    {@html methods['13'][lang]}
    <PoliticalNetwork/>
    {@html methods['14'][lang]}

    <h1 class="subtitle">{methods['subsubtitle_4'][lang]}</h1>

    {@html methods['15'][lang]}
    <Lexicon posts={posts}/>

    <h1 class="subtitle">{methods['subsubtitle_5'][lang]}</h1>

    {@html methods['16'][lang]}
    {@html methods['17'][lang]}
    {@html methods['18'][lang]}
    {@html methods['19'][lang]}
    <DataCollection/>

    <h1 class="subtitle">{methods['subsubtitle_6'][lang]}</h1>
    {@html methods['20'][lang]}
    {@html methods['21'][lang]}
    {@html methods['22'][lang]}
    <ContentAnnotation/>


    <h1 class="subtitle">{methods['subtitle_3'][lang]}</h1>
    {@html methods['23'][lang]}
    {@html methods['24'][lang]}


</section>


<style>


</style>