<script>

    // properties
    export let lang;
    export const id = "introduction";

    // locale lib
    import { getString } from '../libs/locale.js';

    // components
    import TextBlock from '../components/TextBlock.svelte';


    // ---
    const title = 'Introduction';

    const html = `
        <p>
            In the wake of shocks, people want answers but facts have yet to emerge. As a result, falsehoods proliferate with incredible velocity.
            Forums, digital and non-digital, become a capharnaum. In charge of managing the response, the State and institutions take steps to
            inform and guide a concerned public. Opportunistic leaders can leverage their position for power consolidation. They overlook,
            condone, or amplify inveracities to undermine the integrity of the information space. <i>In extremis</i>, they employ propaganda
            to manipulate public opinion. To achieve their goal, they must somehow disguise the deceit in an appealing, disarming veneer that
            will encourage its intended audience to accept it uncritically. Familiar ideas and widely-held beliefs, including established
            cultural norms, can provide such “packaging”.
        </p>

        <p>
            In this study, we seek to establish the prevalence and nature of disinformation campaigns during periods of society-scale shock.
            To do this, we conduct parallel investigations in two different countries: Brazil and Lebanon. The studies are methodologically
            identical - which enables us to make comparisons between the two country contexts. Further, our choice of Brazil and Lebanon
            provides the opportunity to examine the prevalence of disinformation in quite different societies - permitting this first study
            to provide a broad characterization of disinformation campaigns as they may exist. We look for disinformation campaigns in the
            places where they are often most prevalent and easiest to find: social media.
        </p>

        <p>
            Our hope is that these findings will inform democratic governance program guidance and interventions aimed at countering the impact
            of these tactics.
        </p>

        <p>
            This report provides a detailed account and assessment of this study. First we will discuss the methods we used to conduct the
            investigation in each study. Then we will discuss results from each country. Finally, we will discuss our findings around
            disinformation campaigns in each country - as well as what we can learn about these campaigns by comparing and contrasting our observations
            and findings between the two cultural contexts.
        </p>
    `;


</script>

<section id={id}>

    <h1 class="subtitle">{title}</h1>
    <TextBlock html={html}/>


</section>


<style>

</style>