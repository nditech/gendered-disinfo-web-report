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
            Very little evidence of gendered disinformation campaigns.
        </p>
        <ol>
            <li>
                Very low volume of gendered disinformation within the shock timeframe
            </li>
            <li>
                The shock criteria was a loose one - so the fact that we found so little suggests that there's both very little GD as a campaign around a shock... And just very little gendered disinformation.
            </li>
        </ol>
        <p>
            There are two explanations for our findings.
            
            First - we missed a substantial phenomenon - i.e., gendered disinfo campaigns are highly active, but we just missed them.
            
            Second - there aren't gendered disinfo campaigns within the parameters of this study.
            
            All our findings and experience suggest #2 is the case.  This is for a couple reasons...
            
            First - it's unlikely we missed stuff.  Given our setup, we consider #1 highly unlikely.  We were expansive with terms, ... Lots of in country participation.  If it was there, we would have found it.
            
            However, more importantly, we identified a number of factors that, together, can explain the absence of gendered disinformation campaigns.
            
            For a gendered disinformation campaign to exist and succeed, two things must function.  First, gendered attacks and second, disinformation.  In the Brazillian and Lebanese contexts, there were factors that impacted both of these.
            
            <b>To the point of gendered attacks...</b>
            Further, our workshops with in country participants and in collecting data surfaced a number of important insights around the information ecosystems of the two countries.
            
            Strong gendered beliefs are mainstream and are regularly a part of the public discourse, women and LGBTQ lived experience, and media content.  This raises the bar substantially for what registers as gendered attacks or overt gendered disinformation within these cultures.
            
            Perhaps more importantly, though, is that, even in these contexts, political elites are careful with the content they post to avoid a public record of overtly gendered attacks.  Though we didn't look extensively, our anecdotal experience with social media content produced by "ordinary" folk, is that there's a lot more.
            
            All this suggests that gendered content may be prolific, but that gendered content that is both disinformation AND coordinated by political elites is rare.
            
            <b>To the point of disinformation...</b>
            Information is weaponized on creation... So disinformation is less necessary.
            
            All this said, it's possible that there are more subtle gendered disinformation campaigns (new term?) that are operating at a more nuanced, almost subconscious level (e.g., manipulate culture).  But these kinds of efforts (should they exist) play out over a much longer timeframe and would use many cultural norms, of which gender would be only one... So our approach here would not detect them.
            
            There are long-term political agendas that play out over years... (e.g., conservative family values) that are efforts to shape culture and society norms themselves.  These very well may use gendered claims and disinformation or disinformation-like communication... But these play out over such long arcs that our approach here - particularly focused on shocks and the shock-timeframe - wouldn't be able to detect them.
            
        </p>
        <p>
            Learnings
        </p>
        <ol>
            <li>
                Lebanon, even after translating, wasn't "comprehensible" to researchers. Emphasizes the importance of in-country participants.
            </li>
            <li>
                Image and video content is hard to pick up
            </li>
            <li>
                Need to build baselines for shock vs. Non-shock.  Good to have a benchmark.  We didn't do this because of scale and funding... But worth noting.  How to create a baseline benchmark?
            </li>
        </ol>
    `;

</script>

    <h1 class="subtitle">{title}</h1>
    <TextBlock html={html}/>

<style>

</style>