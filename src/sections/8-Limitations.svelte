<script>

    // properties
    export let lang;
    export const id = "limitations";

    // locale lib
    import { getString } from '../libs/locale.js';

    // components
    import TextBlock from '../components/TextBlock.svelte';
    import List from '../components/List.svelte';

    const limitation_1 = `

    `;

    const limitation_2 = `
    Furthermore, social media platforms often implement ephemeral links for images. To prevent these links from expiring before
            our annotators had time to review the posts, we also scraped and self-hosted the images.
    `

    const text_1 = `
        Here are the study's limitations:
    `;

    const limitations = `
    <ul>
        <li>
            Our dataset is composed of over a year of Facebook, Telegram, Twitter and Youtube posts.
            However, the scraping of these social media platforms was conducted May 1st, 2021.
            Some posts, often the most controversial ones, might have been taking down and are thus not included in our dataset.
        </li>
        <li>
            To go beyond the API limits imposed by each platform, we designed our own browser-based scraper. This is a “hacky” solution
            that requires some human involvement and can potentially overlook some posts.
        </li>
        <li>
            The labeling of posts is a fundamentally subjective activity. In the questionnaire
            used by our in-situ participants to review posts, we asked if it had been hard to make a decision.
            If they responded with a yes, the publication would be reviewed by the in-country project managers.
        </li>
        <li>
            For societies with high internet penetration, social media offers a window into the discourse and rhetoric.
            These platforms enable new ways of understanding our societies by their large quantity of structured and extractable interactions.
            However, not all communities and demographics are equally represented online.
        </li>
    </ul>
    `

</script>


<section id={id}>

    <h1 class="subtitle">{getString(lang, 'title_limitations')}</h1>
    <TextBlock html={text_1}/>
    <TextBlock html={limitations}/>

</section>


<style>

</style>