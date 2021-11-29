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
            In the wake of shocks, people want answers but facts have yet to emerge. As a result, deliberate and spontaneous falsehoods can proliferate with incredible velocity. Forums, digital and non-digital, are plagued with opportunistic and perverse ideologies. In charge of managing the response to the shock, the State and institutions can take steps to inform and guide a concerned public. Opportunistic leaders can leverage their position for power consolidation. They overlook, condone, or amplify false information to undermine the integrity of the information space for their own political advantage. In extremis, they employ propaganda to manipulate public opinion. To achieve their goal, they must somehow disguise the deceit in an appealing, disarming veneer that will encourage its intended audience to accept it uncritically. Familiar ideas and widely-held beliefs, including established cultural norms, can provide such “packaging”.
        </p>

        <p>
            In societies in which there are entrenched perceptions and stereotypes around gender, claims around gender can be used as the delivery mechanism for disinformation. This is the focus of this current study. While much work has been done on disinformation, very little is known about the ways in which gendered norms, perceptions, and stereotypes are deliberately leveraged to enhance the uptake of disinformation, particularly during society-scale shocks during which populations can be the most vulnerable to the spread of such falsehoods. We term this particular brand of deception “gendered disinformation” - and when it is employed intentionally by a particular group (e.g., a political party or civil society organization), we refer to it as “gendered disinformation campaigns.”
        </p>

        <p>
            In this study, undertaken in partnership with the National Democratic Institute (NDI), we seek to establish the prevalence and nature of gendered disinformation campaigns during periods of society-scale shock. To do this, we conduct parallel investigations in two different countries: Brazil and Lebanon. The studies are methodologically identical - which enables us to make comparisons between the two country contexts. Further, our choice of Brazil and Lebanon provides the opportunity to examine disinformation in quite different societies - permitting this first study to provide a broad characterization of disinformation campaigns as they may exist.
        </p>

        <p>
            The purpose of this focus is to enhance the understanding of what measures are needed to ensure that women are empowered to participate in leadership and decision making in the response to and recovery from shocks, such as pandemics, natural disasters, and conflict/violence. Our hope is that these findings will inform democratic governance program guidance and interventions aimed at countering the impact of these tactics.
        </p>

        <p>
            We looked for disinformation campaigns in the places where they are often most widespread and easiest to find: social media. More specifically, we looked at 4 social media platforms – Telegram, Youtube, Facebook and Twitter. In both country contexts, we expected substantial evidence of gendered disinformation. Surprisingly, we discovered that, within the studied time frame, virtually no evidence of gendered disinformation campaigns appeared. Although harmful gendered narratives published by political insiders were discovered, prevalence, and characteristic display of coordination was not. Moreover the use of gendered frames to propagate disinformation was rare.
        </p>

        <p>
            In the following sections, we provide a detailed account and assessment of this study. First we will discuss the methods we used to conduct the investigation in each study. Then we will discuss results from each country. Finally, we will discuss our findings around gendered disinformation campaigns in each country - as well as what we can learn about these campaigns by comparing and contrasting our observations and findings between the two cultural contexts.
        </p>
    `;


</script>

<section id={id}>

    <h1 class="subtitle">{title}</h1>
    <TextBlock html={html}/>


</section>


<style>

</style>