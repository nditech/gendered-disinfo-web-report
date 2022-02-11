'use strict';

// load libs
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import html from '@rollup/plugin-html';

// load constants
import { SUBDIRECTORY, DOMAIN, TITLE, DESCRIPTION, AUTHOR, THUMBNAIL_FILEPATH, GOOGLE_ANALYTICS_ID, TOR } from './src/constants.json';


// build metas
let METAS = [
    { 'itemprop': 'name', 'content': TITLE },
    { 'itemprop': 'description', 'content': DESCRIPTION },
    { 'itemprop': 'image', 'content': `${DOMAIN}${SUBDIRECTORY}${THUMBNAIL_FILEPATH}` },
    { 'property': 'og:url', 'content': `${DOMAIN}${SUBDIRECTORY}` },
    { 'property': 'og:title', 'content': TITLE },
    { 'property': 'og:type', 'content': 'article' },
    { 'property': 'og:article:publisher', 'content': AUTHOR },
    { 'property': 'og:image', 'content': `${DOMAIN}${SUBDIRECTORY}${THUMBNAIL_FILEPATH}` },
    { 'property': 'og:site_name', 'content': AUTHOR },
    { 'property': 'og:description', 'content': DESCRIPTION },
    { 'name': 'title', 'content': TITLE },
    { 'name': 'author', 'content': AUTHOR },
    { 'name': 'description', 'content': DESCRIPTION },
    { 'name': 'twitter:card', 'content': 'summary_large_image' },
    { 'name': 'twitter:site', 'content': `@${AUTHOR}` },
    { 'name': 'twitter:title', 'content': TITLE },
    { 'name': 'twitter:description', 'content': DESCRIPTION },
    { 'name': 'twitter:creator', 'content': `@${AUTHOR}` },
    { 'name': 'twitter:image:src', 'content': `${DOMAIN}${SUBDIRECTORY}${THUMBNAIL_FILEPATH}` },
    { 'name': 'msapplication-TileImage', 'content': `${DOMAIN}${SUBDIRECTORY}${THUMBNAIL_FILEPATH}` }
];

// Tor
if (TOR['ENABLE']){
    METAS.push(
        { 'http-equiv': "onion-location", 'content': `${ONION_ADDRESS}${SUBDIRECTORY}` }
    )
}

// Google Analytics 
const googleAnalytics = `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        gtag('config', '${GOOGLE_ANALYTICS_ID}');
    </script>
`;


const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            });

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        }
    };
}


const htmlOptions = {
    template: ({ attributes, files, meta, publicPath, title }) => {

        const script = (files.js || []).map(({ fileName }) => {
            return `    <script defer src="${SUBDIRECTORY}${fileName}"></script>`;
        }).join("\n");

        const css = (files.css || []).map(({ fileName }) => {
            return `    <link rel="stylesheet" href="${SUBDIRECTORY}${fileName}">`;
        }).join("\n");

        const metas = (METAS || []).map(({ itemprop, property, name, content }) => {
            if (itemprop){
                return `    <meta itemprop="${itemprop}" content="${content}">`;
            }else if(property){
                return `    <meta property="${property}" content="${content}">`;
            }else if(name){
                return `    <meta name="${name}" content="${content}">`;
            }else {
                return '';
            }
        }).join("\n");


        return `
<!DOCTYPE html>
<html lang="en">
<head>

${googleAnalytics}

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="icon" type="image/x-icon" href="favicon.ico">

    <title>${TITLE}</title>
${metas}

${css}
${script}
</head>
</html>
        `;
    },
};


export default {
    input: 'src/main.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/bundle.js'
    },
    plugins: [
        svelte({
            // emitCss: false,
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production
            }
        }),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css({ output: 'bundle.css' }),

        // to import json files
        json({
            compact: true
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),

        // to build html files
        html(htmlOptions),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    },
    onwarn ( warning, warn ) {
        // ignore d3 circular dependency warnings
        if(warning.code === 'CIRCULAR_DEPENDENCY' && warning.importer.includes('d3')){
            return;
        }
    },
};
