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

    <h1 class="title">{methods['title'][lang] !== undefined ? methods['title'][lang] : methods['title']['eng']}</h1>
    {@html methods['1'][lang] !== undefined ? methods['1'][lang] : methods['1']['eng']}
    {@html methods['2'][lang] !== undefined ? methods['2'][lang] : methods['2']['eng']}
    {@html methods['3'][lang] !== undefined ? methods['3'][lang] : methods['3']['eng']}


    <h1 class="subtitle">{methods['subtitle_1'][lang] !== undefined ? methods['subtitle_1'][lang] : methods['subtitle_1']['eng']}</h1>
    {@html methods['4'][lang] !== undefined ? methods['4'][lang] : methods['4']['eng']}
    {@html methods['5'][lang] !== undefined ? methods['5'][lang] : methods['5']['eng']}


    <h1 class="subtitle">{methods['subtitle_2'][lang] !== undefined ? methods['subtitle_2'][lang] : methods['subtitle_2']['eng']}</h1>
    {@html methods['6'][lang] !== undefined ? methods['6'][lang] : methods['6']['eng']}
    {@html methods['7'][lang] !== undefined ? methods['7'][lang] : methods['7']['eng']}
    {@html methods['8'][lang] !== undefined ? methods['8'][lang] : methods['8']['eng']}
    {@html methods['9'][lang] !== undefined ? methods['9'][lang] : methods['9']['eng']}
    {@html methods['10'][lang] !== undefined ? methods['10'][lang] : methods['10']['eng']}


        <h1 class="subtitle">{methods['subsubtitle_1'][lang] !== undefined ? methods['subsubtitle_1'][lang] : methods['subsubtitle_1']['eng']}</h1>
        {@html methods['11'][lang] !== undefined ? methods['11'][lang] : methods['11']['eng']}
        <InformationDisorder bind:lang={lang}/>


        <h1 class="subtitle">{methods['subsubtitle_2'][lang] !== undefined ? methods['subsubtitle_2'][lang] : methods['subsubtitle_2']['eng']}</h1>
        {@html methods['12'][lang] !== undefined ? methods['12'][lang] : methods['12']['eng']}


        <h1 class="subtitle">{methods['subsubtitle_3'][lang] !== undefined ? methods['subsubtitle_3'][lang] : methods['subsubtitle_3']['eng']}</h1>
        {@html methods['13'][lang] !== undefined ? methods['13'][lang] : methods['13']['eng']}
        <PoliticalNetwork bind:lang={lang}/>
        {@html methods['14'][lang] !== undefined ? methods['14'][lang] : methods['14']['eng']}


        <h1 class="subtitle">{methods['subsubtitle_4'][lang] !== undefined ? methods['subsubtitle_4'][lang] : methods['subsubtitle_4']['eng']}</h1>
        {@html methods['15'][lang] !== undefined ? methods['15'][lang] : methods['15']['eng']}
        <Lexicon posts={posts}/>


        <h1 class="subtitle">{methods['subsubtitle_5'][lang] !== undefined ? methods['subsubtitle_5'][lang] : methods['subsubtitle_5']['eng']}</h1>
        {@html methods['16'][lang] !== undefined ? methods['16'][lang] : methods['16']['eng']}
        {@html methods['17'][lang] !== undefined ? methods['17'][lang] : methods['17']['eng']}
        {@html methods['18'][lang] !== undefined ? methods['18'][lang] : methods['18']['eng']}
        {@html methods['19'][lang] !== undefined ? methods['19'][lang] : methods['19']['eng']}
        <DataCollection/>


        <h1 class="subtitle">{methods['subsubtitle_6'][lang] !== undefined ? methods['subsubtitle_6'][lang] : methods['subsubtitle_6']['eng']}</h1>
        {@html methods['20'][lang] !== undefined ? methods['20'][lang] : methods['20']['eng']}
        {@html methods['21'][lang] !== undefined ? methods['21'][lang] : methods['21']['eng']}
        {@html methods['22'][lang] !== undefined ? methods['22'][lang] : methods['22']['eng']}
        <ContentAnnotation/>


    <h1 class="subtitle">{methods['subtitle_3'][lang] !== undefined ? methods['subtitle_3'][lang] : methods['subtitle_3']['eng']}</h1>
    {@html methods['23'][lang] !== undefined ? methods['23'][lang] : methods['23']['eng']}
    {@html methods['24'][lang] !== undefined ? methods['24'][lang] : methods['24']['eng']}

</section>


<style>


</style>