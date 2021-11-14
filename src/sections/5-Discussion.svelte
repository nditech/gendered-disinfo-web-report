<script>

    // properties
    export let lang;
    export const id = "discussion";

    // components
    import TextBlock from '../components/TextBlock.svelte';


    // ---
    const title = 'Discussion';
    const html = `
    <p>
        One of two alternatives could explain our findings. First, active state-based gendered disinformation did occur and the 
        methodology or its implementation failed to detect it. Second, given the definitions and parameters of the study, the 
        phenomenon did not occur. 
    </p>
    <p>
        Our analysis and experience suggests that of the two options, the second is the most plausible. To substantiate our proposition, 
        here are some precautions that were taken . 
    </p>
    <ol>
        <li>
            Implementation was designed to require the involvement of the in-situ team at each step
        </li>
        <li>
            All tools were designed to be exploratory (high false positive rate) and be narrowed later. 
            The lexicon initially included generic invectives, the shock timeline incorporated minor events, 
            and the political network was expensively mapped. 
        </li>
        <li>
            Annotation of the social media posts was sliced into many small increments. Results would be reviewed 
            and tools would be tuned after each completed chunk. Unearthed during the review, keywords are added 
            to the lexicon, events to the timeline, and political insiders to the network map.
        </li>
        <li>
            Flagging a social media post as containing disinformation is a judgement call. To curb subjectivity, 
            a fraction of the posts were sent to multiple independent participants. If they returned different answers, 
            the post would be reviewed by the in-country project managers.
        </li>
        <li>
            Posts flagged as containing gendered disinformation were meticulously reviewed by all project stakeholders to 
            distill overarching themes. 
        </li>
        <li>
            Findings were examined through a qualitative and quantitative lens. 
        </li>
    </ol>
    <p>
        More important, are the factors that can explain the absence of gendered disinformation campaigns. Workshops with 
        in-country participants and the data collected surfaced a number of important insights around the information ecosystems 
        of Brazil and Lebanon. 
    </p>
    <p>
        Strong gendered beliefs are mainstream and are regularly part of the public discourse and women lived experience. 
        However, political elites are careful with the content they post to avoid a public record of overtly gendered attacks. 
    </p>
    <p>
        In Bolsonaro's Brazil and the sectarian Lebanese society, information published by the political network is weaponized 
        on creation. The population is accustomed and desensitized to deceit, calumny, or inveracity. In this context, disinformation 
        blends in with the rest of the information landscape and is often impossible to distinguish. 
    </p>
    `;

</script>

    <h1 class="subtitle">{title}</h1>
    <TextBlock html={html}/>

<style>

</style>