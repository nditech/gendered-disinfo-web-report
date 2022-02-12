<script>

    // properties
    export let lang;
    export let dataset;
    export let params;

    // import strings
    import { casestudies } from '../../strings.json';
    const casestudy = casestudies['lebanon'];

    // unpack
    const { 
        sources, 
        posts, 
        submissions, 
        lexicon, 
        dictionary,
        events, 
        categories, 
        lexicon_table,
        events_table,
        political_network_table,
        nbr_of_accounts,
        min_date,
        max_date,
        belligerents,
        submissions_of_interest
    } = dataset;

    // import components
    import SearchTable from '../../components/SearchTable.svelte';
    import Table from '../../components/Table.svelte';
    import Portraits from '../../components/Portraits.svelte';
    import List from '../../components/List.svelte';
    import Slider from '../../components/Slider.svelte';

    // import dataviz
    import Heatmap from '../../dataviz/Heatmap/Heatmap.svelte';
    import DotMatrixPlot from '../../dataviz/DotMatrixPlot/DotMatrixPlot.svelte';
    import Network from '../../dataviz/Network/Network.svelte';

    // import libs
    import { romanize } from '../../libs/locale.js';
    import { posts_to_dotmatrix, posts_to_graph } from '../scripts/preproc.js';
    const dotmatrix = posts_to_dotmatrix(submissions_of_interest);


    // displayed variables
    const COORDINATION_MAX_NUMBER_OF_DAYS = 15;
    let nodes, vertices;

    // network data
    function change_category(key){

        // filter posts based on category
        const _submissions = submissions.filter(post => post['categories'].includes(key));

        // update network data
        [nodes, vertices] = posts_to_graph(_submissions, categories, sources, COORDINATION_MAX_NUMBER_OF_DAYS);
    }

    // options
    const options = categories.map(d => {
        return {
            'key': d['key'],
            'value': d['name_count'],
        }
    })


    // engagement filters
    const engagement_table = [
        ["Type", "Minimum Value"],
        ["Views", "500"],
        ["Reactions", "200"],
        ["Comments", "200"],
        ["Shares", "100"]
    ];





    // dynamic strings
    const str_accounts = (nbr_accounts) => {
        return {
            "eng": `<p>The participants identified ${nbr_accounts} Telegram, Facebook, Twitter and Youtube accounts as being part of the political network.</p>`,
            "por": `<p>Os participantes identificaram ${nbr_accounts} contas pertencentes à rede política nas plataformas Telegram, Facebook, Twitter e Youtube.</p>`,
            "ara": `<p>حدّد المشاركون ${nbr_accounts} حساباً على تيليغرام، فايسبوك، تويتر، ويوتيوب كحسابات تشكّل جزءاً من شبكة سياسية.</p>`
        }
    };

    const str_datacollection = (nbr_posts) => {
        return {
            "eng": `<p>Data collection returned a total of ${nbr_posts} posts between ${min_date} and ${max_date}.</p>`,
            "por": `<p>No total, foram coletadas ${nbr_posts} postagens entre ${min_date} e ${max_date}.</p>`,
            "ara": `<p>نتج عن جمع البيانات ${nbr_posts} ${max_date}تدوينة بين كانون ${min_date} و .</p>`
        }
    }

    const str_lexicon = (nbr_words) => {
        return {
            "eng": `<p>Participants came up with a list of ${nbr_words} words prone to be used in disinformation. Only posts containing at least one of these keywords were kept.</p>`,
            "por": `<p>Os participantes desenvolveram uma lista com ${nbr_words} palavras associadas a práticas de desinformação.</p>`,
            "ara": `<p>اقترح المشاركون قائمةً من ${nbr_words} كلمة اعتبروا أنها ميالة لأن تُستخدم ضمن المعلومات المضللة. </p>`
        }
    }

    const str_narratives = (nbr_narratives) => {
        return {
            "eng": `<p> We reviewed all the posts of interest and categorized them into ${nbr_narratives} narratives.</p>`,
            "por": `<p>Todas as postagens de interesse foram revisadas e classificadas em ${nbr_narratives} narrativas.</p>`,
            "ara": `<p>راجعنا كافة التدوينات ذات الاهتمام وصنّفناها ضمن ${nbr_narratives} سرديات. </p>`
        }
    }

    const str_belligerents = (nbr_belligerents) => {
        return {
            "eng": `<p>Here is a short description of the ${nbr_belligerents} state-affiliated accounts that published disinformation.</p>`,
            "por": `<p>Abaixo, uma breve descrição de todas as ${nbr_belligerents} contas associadas ao Estado que publicaram desinformação.</p>`,
            "ara": `<p>في ما يلي وصف وجيز عن ${nbr_belligerents} حساباً تابعاً للدولة نشر معلومات مضللة.</p>`
        }
    }
    
    const str_coordination = () => {
        return {
            "eng": `<p>If there is a link between two belligerents it means they published a message containing the same keyword within a ${COORDINATION_MAX_NUMBER_OF_DAYS} days interval.</p>`,
            "por": `<p>Cada vínculo entre dois “beligerantes” é um sinal de que ambos publicaram uma mensagem contendo a mesma palavra-chave num intervalo de ${COORDINATION_MAX_NUMBER_OF_DAYS} dias.</p>`,
            "ara": `<p>إذا كان هناك خط يربط بين خصمين، فهذا يعني أنهما نشرا رسالةً تتضمّن الكلمة الرئيسية نفسها خلال فترة ${COORDINATION_MAX_NUMBER_OF_DAYS} يوماً. </p>`
        }
    }


    const str_events = (nbr_events) => {
        return {
            "eng": `<p>The shock timeline developed by the participants is composed of ${nbr_events} key events. We only considered social media posts published during the 21 days following each event.</p>`,
            "por": `<p>A linha do tempo de choque desenvolvida pelos participantes é composta por ${nbr_events} eventos principais. Consideramos apenas postagens de mídia social publicadas durante os 21 dias seguintes a cada evento.</p>`,
            "ara": `<p>يتكون الجدول الزمني للصدمة الذي وضعه المشاركون من ${nbr_events} أحداث رئيسية. نظرنا فقط في منشورات وسائل التواصل الاجتماعي المنشورة خلال 21 يومًا بعد كل حدث.</p>`
        }
    }

    const str_filtering = (nbr_submissions_of_interest, nbr_belligerents) => {
        return {
            "eng": `<p>Using automated lexical, temporal and engagement filters, in combination with human reviews we uncovered a total of ${nbr_submissions_of_interest} posts containing disinformation from ${nbr_belligerents} belligerents.</p>`,
            "por": `<p>Usando filtros automatizados lexicais, temporais e de engajamento, em combinação com análises humanas, descobrimos um total de ${nbr_submissions_of_interest} postagens contendo desinformação de ${nbr_belligerents} beligerantes.</p>`,
            "ara": `<p>باستخدام عوامل التصفية التلقائية المعجمية والزمانية والمشاركة ، بالإضافة إلى المراجعات البشرية ، اكتشفنا ما مجموعه ${nbr_submissions_of_interest} منشورات تحتوي على معلومات مضللة من ${nbr_belligerents} متحاربين.</p>`
        }
    }


</script>

<section>

    <h1 class="title">{casestudy['title'][lang]}</h1>
    {@html casestudy['partners'][lang]}
        
    
    <h1 class="subtitle">{casestudies['subtitle_1'][lang]}</h1>
    {@html str_accounts(nbr_of_accounts)[lang]}
    <Table data={political_network_table}/>


    <h1 class="subtitle">{casestudies['subtitle_2'][lang]}</h1>
    {@html str_datacollection(posts.length.toLocaleString())[lang]}
    {@html casestudies['searchbar_1'][lang]}
    {@html casestudies['searchbar_2'][lang]}
    <SearchTable placeholders={params['examples']['queries']} documents={posts} word_mapping={dictionary}/>


    <h1 class="subtitle">{casestudies['subtitle_3'][lang]}</h1>
    <h1 class="subsubtitle">{casestudies['subsubtitle_1'][lang]}</h1>
    {@html str_lexicon(lexicon.length)[lang]}
    <Table data={lexicon_table}/>

    
    <h1 class="subsubtitle">{casestudies['subsubtitle_2'][lang]}</h1>
    {@html str_events(events.length)[lang]}
    <Table data={events_table}/>


    <h1 class="subsubtitle">{casestudies['subsubtitle_3'][lang]}</h1>
    {@html casestudies['engagement_1'][lang]}
    <Table data={engagement_table}/>


    <h1 class="subtitle">{casestudies['subtitle_4'][lang]}</h1>
    {@html str_filtering(submissions_of_interest.length, belligerents.length)[lang]}
    <Heatmap data={submissions_of_interest} sources={belligerents} events={events}/>

    
    <h1 class="subsubtitle">{casestudies['subsubtitle_4'][lang]}</h1>
    {@html str_belligerents(belligerents.length.toLocaleString())[lang]}
    <Portraits data={belligerents}/>


    <h1 class="subsubtitle">{casestudies['subsubtitle_5'][lang]}</h1>
    {@html str_narratives(categories.length)[lang]}
    <List elements={categories.map(d => d['description'])}/>

        

    <h1 class="subsubtitle">{casestudies['subsubtitle_6'][lang]}</h1>
    {@html casestudies['engagement_2'][lang]}
    {#each categories as category, i}
        <DotMatrixPlot data={dotmatrix.filter(d => d['categories'].includes(category['key']))} title={`${romanize(i+1)}. ${category['name_count']}`} max_interactions={Math.max(...dotmatrix.map(d => d['interactions']['count']))}/>
    {/each}

    
    <h1 class="subsubtitle">{casestudies['subsubtitle_7'][lang]}</h1>
    {@html casestudies['coordination'][lang]}
    {@html str_coordination[lang]}
    <Slider previous_callback={(opt) => change_category(opt)} next_callback={(opt) => change_category(opt)} options={options}/>
    <Network bind:nodes={nodes} bind:vertices={vertices}/>

</section>

<style>

</style>