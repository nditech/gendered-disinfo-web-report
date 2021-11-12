<script>

    // properties
    export let lang;
    export const id = "gendered-disinfo";

    // import constants
    import { URL_PREFIX } from '../constants.json'

    // components
    import TextBlock from '../components/TextBlock.svelte';


    // ---
    const title = 'Gender';

    const subtitle_1 = `Gendered Disinformation`;

    const html_1 = `
    <p>
        The online space is increasingly crucial for politics. It encourages digital citizenship and democratizes voices, 
        giving women and other marginalized communities a platform. It is cheaper to mount an online campaign, and it maintains 
        physical safety. Unfortunately, that democratization of voices also results in new types of threats against political 
        women. These attacks fall under the umbrella of online violence against women in politics (VAW-P), which “encompasses 
        the wide variety of attacks women experience when participating in democratic discourse on the internet.”        
        – <a href="https://www.ndi.org/publications/addressing-online-misogyny-and-gendered-disinformation-how-guide" target="_blank">ref</a>.
    </p>
    `;

    const html_2 = `
    <p>
        The focus of this report is gendered disinformation. Gendered disinformation is a form of online violence against women 
        in politics (VAW-P) that aims to sway political outcomes by discrediting and demeaning women in politics. Gendered 
        disinformation tends to fall into three categories: to scare women into withdrawing from politics; to pull popular 
        support away from politically active women, and to leverage gender norms to modify political outcomes.
    </p>
    <p>
        When using scare tactics, online attackers use fake images and stories, often with sexualized components, to demean 
        politically active women and manipulate or stop their political participation. An attack on one woman can often have a 
        ripple effect: when other women, especially young women, see how they are treated online, they may self-censor in case 
        they receive the same treatment. According to a recent report by Plan International, misinformation and disinformation 
        negatively affect girl’s online political participation – 
        <a href="https://plan-international.org/publications/truth-gap" target="_blank">ref.
    </p>
    `;


    const html_3 = `
    <p>
        Online attackers also use entrenched gender norms to shift support away from political women or the issues they are promoting. 
        These campaigns often focus on a country’s traditional definition of ‘femininity’ and gender roles, sometimes including a 
        religious component, to discredit and undermine women in politics. 
    </p>
    <p>
        Finally, attackers use gendered disinformation to change political outcomes. This type of campaign targets both women 
        and men, weakening the information space and creating a significantly less democratic space for all participants. 
        The attacks leverage gender norms to influence the public's perceptions of issues and policies that would negatively 
        impact the power of the political elites without this intervention.
    </p>
    `

    const subtitle_2 = `COVID-19 & Gendered Disinformation`;

    const html_4 = `
    <p>
        The COVID-19 pandemic has added another layer to gendered disinformation campaigns against women. Attacks range 
        from general posts wishing covid on women and using gendered abuse to criticize responses to the health crisis, 
        to discrediting politically active women who oppose state actions by portraying them as a threat to public health. 
        COVID-19 has been weaponized across social media platforms as a way to discredit, demean, and undermine women’s 
        response to the pandemic - 
        <a href="https://www.disinfo.eu/publications/misogyny-and-misinformation:-an-analysis-of-gendered-disinformation-tactics-during-the-covid-19-pandemic/" target="_blank">ref</a>.
    </p>
    `;

    const subtitle_3 = `State-Based Gendered Disinformation`;

    const html_5 = `
    <p>
        Though gendered disinformation is rampant across all corners of the online space, it reaches a much larger audience when 
        it comes from a state-based source. These include political institutions and organizations, networks of connected 
        organizations, and individual influencers in the political environment. Their attacks are amplified because of their 
        position and they make online spaces much more dangerous for women by combining personal attacks and political 
        motivations. These attacks allow state-based actors to undermine the freedom of the political information space. 
        This ultimately threatens the democratic space and gets amplified beyond the political world. According to NDI’s report 
        on addressing gender and disinformation, “reflecting the permeability of our media environments, this gendered 
        disinformation can, in turn, be used either by non-state-based actors to pursue Online VAW-P to their own ends or be 
        unintentionally amplified by media professionals and citizens who are not able to discern its lack of integrity.” It is 
        also crucial to highlight that state-based gendered disinformation campaigns are not limited to authoritarian states. 
        Countries with strong women’s rights policies and a history of democracy are also susceptible to these types of attacks. 
    </p>
    `;

</script>

<section id={id}>

    <h1 class="subtitle">{title}</h1>
    <h1 class="subsubtitle">{subtitle_1}</h1>
    <TextBlock html={html_1}/>

    <!-- <div>
        <img alt="information venn diagram" src="{URL_PREFIX}/assets/explanatives/information_venn.png">
    </div> -->

    <TextBlock html={html_2}/>

    <div>
        <img alt="information venn diagram" src="{URL_PREFIX}/assets/explanatives/misinformation_girls.png">
    </div>

    <TextBlock html={html_3}/>

    <h1 class="subsubtitle">{subtitle_2}</h1>

    <TextBlock html={html_4}/>

    <h1 class="subsubtitle">{subtitle_3}</h1>

    <TextBlock html={html_5}/>

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


</style>