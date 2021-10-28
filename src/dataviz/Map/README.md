# Svelte Map

Our beloved d3.js + leaflet map as a svelte component.


## Mise-en-place

After cloning this repo,

1. Install the dependencies,

        npm install

2. Set your environment variables [.env](./.env)

3. Set your visualization variables [env.js](./src/Map/env.js)

4. Install this npm package

        npm i topojson-client --save-dev


## Setting the geographic boundaries

1. Navigate to this [website](https://gadm.org/download_country_v3.html) and select your desired country

2. Download the "shapefile"

3. To visualize your boundaries use this [website](https://mapshaper.org/). Import the files ending with _0., then _1., and so on to select the desired level of details.

4. You should only have 1 layer, delete the others

5. Use the "select features" tool to delete features.

6. Use the "Simplify" tool, and set the "Settings" to a low percentage to compress the output file.

7. Use the "Export" tool and select the "TopoJSON" file format

8. Use the topojson-client module to parse the file as,

        // import libs
        const topojson = require('topojson-client')
        const fs = require('fs');

        // import json file
        const content = JSON.parse(fs.readFileSync(`path to your file`, 'utf8'));

        // Convert Raw Topo JSON to Feature JSON
        const { features } = topojson.feature(content, content.objects.collection)

        // print out
        console.log(JSON.stringify(features))

9. Copy the features to where you will be importing it. It shoud look like,

        [
                {
                        "type":"Feature",
                        "properties":{"GID_0":"CIV","NAME_0":"Côte d'Ivoire", ...},
                        "geometry":{
                                "type":"Polygon",
                                "coordinates":[[[-3.7219181256483465,5.299354970567094],[-3.7879651946289243,5.272760277441964],[-3.810788799506005,5.286437548192032],[-3.821291697325546,5.272000429066961],[-3.7219181256483465,5.299354970567094], ...]]
                        }
                },
                {
                        "type":"Feature",
                        "properties":{"GID_0":"CIV","NAME_0":"Côte d'Ivoire","NAME_1":"Bas-Sassandra", ...},
                        "geometry":{
                                "type":"Polygon",
                                "coordinates":[[[-5.856026171057472,5.0337879635032925],...]]
                        }
                },
                ...
        ]
