<script>

    // properties
    export let lang;
    export const id = "interventions";

    // import constants
    import { URL_PREFIX } from '../constants.json'

    // locale lib
    import { getString } from '../libs/locale.js';

    // components
    import TextBlock from '../components/TextBlock.svelte';


    // --- text ---
    const title = 'Interventions';
    const text_1 = `
    <p>
        The rationale for conducting this research stems from the conviction that we can't tackle what we don't know or 
        can't measure. In this section, we discuss the strategies that can be employed to counter the spread of harmful narratives. 
    </p>
    <p>
        Countering narratives can feel like a sisyphean task. Narratives do not have a face, they live in 
        the <i>zeitgeist</i>. People are carriers.
    </p>
    <p>
        Achieving a healthy information space requires the benevolent involvement and collaboration of all 
        stakeholders – government, media, civil society, international community, diaspora, and local population.
    </p>
    `

    const subtitle_2 = 'Preventive care';
    const text_2 = `
    <ul>
        <li>
            Resilience is strengthened through promotion of better digital practices (critical thinking, sources verification, ...)
        </li>
        <li>
            Screening for information disorders is conducted through continuous monitoring of forums
        </li>
    </ul>
    `;

    const subtitle_3 = 'Easing of symptoms';
    const text_3 = `
    <ul>
        <li>
            Addressing the narratives through compelling negotiative or mediative content. Should contain clear call to actions to share and build on the message
        </li>
        <li>
            Engaging with credible influencers to share the content
        </li>
        <li>
            Identification, profiling and reporting of fake, inauthentic and hateful accounts to platform moderators
        </li>
    </ul>
    `;

    const subtitle_4 = 'Curative care';
    const text_4 = `
    <ul>
        <li>
            Processes that punctually and transparently communicate any suspect narratives to all stakeholders
        </li>
        <li>
            Incentive alignment so that every stakeholder equally feels the cost of negative feedback and the benefit of positive feedback
        </li>
    </ul>
    `;

    const subtitle_5 = 'Palliative care';
    const text_5 = `
    <p style="margin-top: 8px;">
        If hate is festering, containment might be necessary before it metastasizes. 
    </p>
    <ul>
        <li>
            Resources should be deployed to mend affected communities
        </li>
        <li>
            Thought leaders should be held accountable
        </li>
        <li>
            Surgical banning of accounts
        </li>
    </ul>
    `;


</script>


<section id={id}>

    <h1 class="subtitle">{title}</h1>
    <TextBlock html={text_1}/>

    <h1 class="subsubtitle">{subtitle_2}</h1>
    <TextBlock html={text_2}/>

    <h1 class="subsubtitle">{subtitle_3}</h1>
    <TextBlock html={text_3}/>

    <h1 class="subsubtitle">{subtitle_4}</h1>
    <TextBlock html={text_4}/>

    <h1 class="subsubtitle">{subtitle_5}</h1>
    <TextBlock html={text_5}/>


    <div>
        <img alt="hate speech" src="{URL_PREFIX}/assets/explanatives/hate_speech.png"/>
        <p class="caption">by Cara Zwibel & Evan Balgord</p>
    </div>

</section>


<style>

    div {
        margin: 0px;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 16px;
        padding-bottom: 16px;
        display: inline-block;
        align-items: center;
        text-align: center;
    }

    img {
        border: 1px solid var(--black);
        max-width: var(--max-width-small);
    }

    .caption {
        margin: 0px;
        padding: 0px;
        font-size: var(--font-size-very-small);
    }

</style>