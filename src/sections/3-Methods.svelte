<script>

    // properties
    export let lang;
    export let posts;
    export const id = "methods";

    // components
    import TextBlock from '../components/TextBlock.svelte';

    // explanatives
    import InformationDisorder from './explanatives/InformationDisorders.svelte';
    import PoliticalNetwork from './explanatives/PoliticalNetwork.svelte';
    import Lexicon from './explanatives/Lexicon.svelte';
    import ContentAnnotation from './explanatives/ContentAnnotation.svelte';
    import DataCollection from './explanatives/DataCollection.svelte';

    // constants
    const n_hours = 18;
    const average_review_time_seconds = 15;
    const nbr_of_posts_in_n_hours = n_hours*3600/15;

    // --- text ---
    const title = 'Methods';

    const html_0 = `
        <p>
            The objective of this study was to identify and characterize gendered disinformation campaigns on social media that 
            happened around society-scale shocks. Each investigation was carried out in three phases:
        </p>

        <ol>
            <li>
                Select a country-specific shock. This would provide the time and context for the content we would collect.
            </li>
            <li>
                Collect social media content containing gendered disinformation campaigns pertaining to the shock identified.
            </li>
            <li>
                Analyze the social media content to compile a body of evidence and then assess its convergence and impact.
            </li>
        </ol>

        <p>
            Here we explain the methods employed in these different phases of the project.
        </p>
    `;

    const subtitle_1 = `Phase 1: Selecting a country-specific shock`;
    const html_1 = `
        <p>
            Working with in-country participants, we identified candidate society-scale shocks that had happened within the past year. Our
            definition of “society-scale shock” was inclusive - we asked participants to identify events that had created prolonged
            disruption of normal life. From this list, we then collectively identified 1-2 shocks as the focus for the investigation.
        </p>
        <p>
            The year timeframe was informed by the fact that it can often be difficult to collect social media content further back than a year.
        </p>
    `;



    const subtitle_2 = `Phase 2: Collecting social media content`;
    const html_2 = `
        <p>
            In this phase, we had to solve a challenging data collection problem. Specifically, we needed a way to find the specific social
            media accounts and posts that had been weaponized within a vast sea of social media content.
        </p>
        <p>
            While the rise of AI-powered systems might suggest this a promising avenue for detecting this kind of content at scale, the reality is
            that automated methods - whether standard keyword-based natural language processing techniques or cutting edge intelligent systems
            - are presently unable to perform this task. Disinformation identification is an intensely culturally-grounded and nuanced activity
            - the facts are that, to find, engage with, and understand it, we depend on people who have a deep working
            knowledge of the culture. The approach we use here involves combining their knowledge and efforts with computational 
            methods. We designed this study with this guiding principle in mind. We designed this study with this guiding principle in mind.
        </p>
        <p>
            The remainder of this subsection is focused on explaining the approach we took to gather a dataset of social media data that
            provided a representative picture of disinformation campaigns within a particular national-cultural context. At a high-level,
            this approach involved highly-interactive work with a dedicated group of in-country participants. Data collection consisted of the
            following steps:
        </p>

        <ol>
            <li>
                Orientation workshop: we developed a shared understanding of gendered disinformation, particularly as the participants experienced and
                observed it in their own media ecosystem.
            </li>

            <li>
                Shock timeline workshop: participants dissected the society-scale shock into a series of upsetting events that
                triggered counter information campaigns by political groups.
            </li>

            <li>
                Political network mapping workshop: participants identified social media actors and personalities with political influence.
                Attention was given to accounts and channels that were known to share disinformation.
            </li>

            <li>
                Lexicon building workshop: participants built a list of words that were strongly related to (1) the shock selected for the study,
                (2) the narratives identified in step #1.
            </li>

            <li>
                Automated data collection: using the accounts from step #3 and the lexicon from step #4, we collected social media data that
                was enriched for gendered disinformation campaign content.
            </li>

            <li>
                Data annotation: participants reviewed each post obtained in step #5 and manually coded its disinformation properties -
                this included flagging those posts which, in fact, were not disinformation.
            </li>
        </ol>
        <p>
            By the end of step #6, we had produced an annotated dataset of social media posts in which specific features had been
            identified for each post, allowing analysis in phase 3. Before discussing phase 3, we provide below details about
            several of the steps above.
        </p>
    `;



    const html_2_1 = `
        <h1 class="subsubsubtitle-underline">
            Step #1 - Orientation
        </h1>

        <p>
            Information comes in different flavours. Participants were asked to go on social media and find examples for each type
            – <a href="https://firstdraftnews.org/articles/information-disorder-the-techniques-we-saw-in-2016-have-evolved/" target="_blank"><i>ref.</i></a>
            Throughout the exercise, we provided guidance on how to effectively use the search tool of each social media platform.
            During this workshop, we collectively identified narratives (both positive and negative) that are established within the culture.
        </p>
    `;


    const html_2_2 = `
        <h1 class="subsubsubtitle-underline">
            Step #2 - Timeline
        </h1>

        <p>
            Moments of shocks are transient states following an upsetting event – health pandemic, conflict & violence, natural disaster.
            They shape or instigate new narratives, some of which are disinformative. Participants were tasked with laying out the arborescence
            of the shock down to the events known to have triggered a counter media response from political groups.
        </p>
    `;

    const html_2_3_1 = `
        <h1 class="subsubsubtitle-underline">
            Step #3 - Political network mapping
        </h1>

        <p>
            Political Network: <i>"outlets where the state exercises control over editorial content through financial resources, direct or indirect political pressures, and/or control over production and distribution"
             – <a href="https://blog.twitter.com/en_us/topics/product/2020/new-labels-for-government-and-state-affiliated-media-accounts" target="_blank">ref.</i></a>
        </p>

        <p>
            Participants were instructed to go on social media and identify political Twitter accounts, Youtube channels, Telegram,
            and Facebook public pages – with a focus on accounts probable of disseminating mis-, dis-, strongly opinionated information.
            As was flagged in earlier sections, many accounts and individuals have political impact without being explicitly political.
            For example, musicians can advocate for political positions - making them political actors. To this end, we instructed participants
            to consider three kinds accounts:
        </p>
    `;
    const html_2_3_2 = `
        <p>
            When identifying accounts, participants included additional information such as political affiliation and level of partisanship.
        </p>
    `;


    const html_2_4 = `
        <h1 class="subsubsubtitle-underline">
            Step #4 - Lexicon building
        </h1>

        <p>
            The lexicon was built with two parts. The first part contained a list of popular idioms, keywords or expressions that
            characterized the events shortlisted during step #2. The second part contained a list of words strongly associated
            with each narrative identified during the step #1 of this phase. During the construction of this second component,
            participants were encouraged to include any and all derogatory language.
        </p>
    `;


    const html_2_5 = `
        <h1 class="subsubsubtitle-underline">
            Step #5 - Data Collection
        </h1>

        <p>
            To collect social media posts, we used the official interface provided by each platform and a custom browser-based 
            scraper to go beyond the imposed limits on the number of requests. 
        </p>
        <p>
            Hundreds of thousands of social media posts were expected to be collected and it takes on average ${average_review_time_seconds} seconds
            for a human to review a post. We needed to bring this number down to a maximum of ${n_hours} hours or ${Math.round(nbr_of_posts_in_n_hours).toLocaleString()} posts.
        </p>
        <p>
            Here are the heuristics used to sift the dataset for posts of interest.
        </p>

        <p>
            <b>Temporal</b>: We only retained documents that were posted within the 3 weeks following each upsetting event identified during step #2.
        </p>

        <p>
            <b>Lexical</b>: We only retained documents that contained at least one word from the lexicon developed during step #4.
        </p>

        <p>
            <b>Engagement</b>: Low engagement is a proxy for low influence. Posts that received low engagement were ignored.
        </p>
    `;




    const html_2_6 = `
        <h1 class="subsubsubtitle-underline">
            Step #6 - Content Annotation
        </h1>

        <p>
            Annotation of the social media posts was done through a web app and was conducted in chunks. A sample of the posts
            would be sent to our participants and based on their response, the filters were adjusted to increase their precision.
            Here are the tuning techniques that were employed.
        </p>

        <p>
            <b>Lexion Pruning</b>: Words that were rarely found in posts of interest and often found in benign posts were removed.
        </p>

        <p>
            <b>Lexicon Expansion</b>: <a target="_blank" href="https://en.wikipedia.org/wiki/Tf%E2%80%93idf">TF-IDF</a> applied to
            posts of interest against benign posts was used to discover important words. Our participants would then decide if
            they should be added to our lexicon.
        </p>

        <p>
            <b>Events</b>: If most or all posts published around an event turned out to be benign, the date window would be adjusted or
            the event would be removed. If an event generated a lot of posts of interest, we looked at when they spiked and adjusted the
            date window accordingly.
        </p>

        <p>
            <b>Artificial Intelligence</b>: To uncover posts that deserved to be reviewed but did not satisfy our temporal or lexical filters,
            we used a language classification model. However, it needed to be trained on a sizable collection of posts of interest.
            Once enough had been gathered, we obtained the best results with a
            <a href="https://huggingface.co/distilbert-base-multilingual-cased" target="_blank">DistilBERT multi-lingual model</a></i>
        </p>

        <p>
            We repeated chunk by chunk until the participants reviewed all the posts.
        </p>
    `;


    const subtitle_3 = `Phase 3:  Analyzing social media content`;
    const html_3 = `
        <p>
            Once all the social media posts had been reviewed by the participants, we conducted analysis on 4 fronts.
        </p>
        <p>
            <b>Belligerents</b>: We looked at who were behind the accounts that published disinformation – their political affiliation, their partisanship.
        </p>

        <p>
            <b>Salient narratives</b>: The participants reviewed all the posts that had been flagged as containing gendered disinformation and categorized them by narrative.
        </p>

        <p>
            <b>Engagement</b>: Disaggregated by social media platforms, we looked at which posts received the highest of engagement.
        </p>

        <p>
            <b>Coordination</b>: Here we investigated the extent to which different accounts demonstrated a propensity for each of the narratives.
            To do so, we assessed whether two accounts published a message about the same topic within a 15 day interval.
        </p>
    `;


</script>

<section id={id}>

    <h1 class="subtitle">{title}</h1>
    <TextBlock html={html_0}/>

    <h1 class="subsubtitle">{subtitle_1}</h1>
    <TextBlock html={html_1}/>

    <h1 class="subsubtitle">{subtitle_2}</h1>
    <TextBlock html={html_2}/>

    <TextBlock html={html_2_1}/>
    <InformationDisorder/>

    <TextBlock html={html_2_2}/>

    <TextBlock html={html_2_3_1}/>
    <PoliticalNetwork/>
    <TextBlock html={html_2_3_2}/>

    <TextBlock html={html_2_4}/>
    <Lexicon posts={posts}/>

    <TextBlock html={html_2_5}/>
    <DataCollection/>

    <TextBlock html={html_2_6}/>
    <ContentAnnotation/>

    <br>
    <h1 class="subsubtitle">{subtitle_3}</h1>
    <TextBlock html={html_3}/>

</section>


<style>


</style>