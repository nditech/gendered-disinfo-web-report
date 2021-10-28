<script>

    // properties
    export let lang;
    export const id = "interventions";

    // locale lib
    import { getString } from '../libs/locale.js';

    // components
    import TextBlock from '../components/TextBlock.svelte';



    // --- text ---
    const title = 'Interventions';

    const text_1 = `
    <p>
        A healthy information space requires the active involvement and collaboration of all
        stakeholders – government, media, civil society, and the population.
    </p>
    <p>
        It starts with civil society conducting continuous monitoring of state-affiliated actors on social media.
        They need to track the dynamics of suspect narratives and communicate their findings punctually and transparently to the population.
    </p>
    <p>
        Then, a set of interventions can be employed to rectify the discourse.
    </p>
    <ul>
        <li>Promotion of better digital practices. The population can be reached through targeted ads, social media campaigns and influencers.</li>
        <li>Meetings with government officials to present findings</li>
        <li>Press releases and conferences</li>
        <li>Meetup open to the public. Speakers can include academics, activists, media, ...</li>
    </ul>
    `
</script>


<section id={id}>

    <h1 class="subtitle">{title}</h1>

    <TextBlock html={text_1}/>

</section>


<style>

</style>