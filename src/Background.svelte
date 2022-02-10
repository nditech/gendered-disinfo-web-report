<script>

    // ui lib
    import { onMount } from "svelte";

    // three.js libs
    import * as THREE from 'three';

    // constants
    const opacity_line = 0.15;
    const opacity_sphere = 0.15;
    const position_spread = 70;
    const nbr_nodes = 500;

    const z_rotation_speed = 0.0005;
    const z_zoom_out_speed = 0.002;

    const nbr_of_neighbors_to_potentially_create_links_with = 3;
    const probability_of_creating_a_neighbor = 0.5;

    // helper functions
    const rand_position = () => {  return Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(position_spread)) }
    const rand_node_radius = () => { return 0.1 + Math.random()*0.05 };

    function createDot(x, y, z, radius){
        const geometry = new THREE.SphereGeometry(radius, 12, 12);
        const material = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: opacity_sphere, transparent: true } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(x, y, z);
        return sphere;
    }

    function createLine(x1, y1, z1, x2, y2, z2){
        const geometry = new THREE.BufferGeometry().setFromPoints( [new THREE.Vector3( x1, y1, z1 ), new THREE.Vector3( x2, y2, z2 )] );
        const material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: opacity_line, transparent: true } );
        const line = new THREE.Line( geometry, material );
        return line;
    }



    function dist_between_two_points(x1, y1, z1, x2, y2, z2){
        var dx = x1 - x2;
        var dy = y1 - y2;
        var dz = z1 - z2;
        return Math.sqrt( dx * dx + dy * dy + dz * dz )
    }

    // generate nodes
    let nodes = [];
    for (let i=0 ; i<nbr_nodes ; i++){
        const [ x, y, z ] = rand_position();
        const node = createDot(x, y, z, rand_node_radius())
        nodes.push(node)
    }

    // generate links
    let links = [];
    for (let i=0 ; i<nodes.length ; i++) {

        // init
        let ordered_indexes_by_distance = []

        // go through all
        for (let j=i+1 ; j<nodes.length ; j++) {

            // grab nodes position
            const [x1, y1, z1] = nodes[i].position;
            const [x2, y2, z2] = nodes[j].position;

            // get distance
            const dist = dist_between_two_points(x1, y1, z1, x2, y2, z2);

            // append
            ordered_indexes_by_distance.push([j, dist]);
        }

        // sort
        ordered_indexes_by_distance.sort((a, b) => a[1] - b[1]);

        // create link for the top N
        for (let j=0 ; j<nbr_of_neighbors_to_potentially_create_links_with ; j++){
            if (j >= ordered_indexes_by_distance.length) continue;

            // grab index
            const [index_of_neighbor, _] = ordered_indexes_by_distance[j];

            // grab nodes position
            const [x1, y1, z1] = nodes[i].position;
            const [x2, y2, z2] = nodes[index_of_neighbor].position;

            // skip at random
            if(Math.random() > probability_of_creating_a_neighbor) continue;

            // create line between the two
            const link = createLine(x1, y1, z1, x2, y2, z2);

            // add
            links.push(link);
        }
    }


    onMount(() => {

        // grab canvas
        const canvas = document.querySelector('#bg');

        // init elements
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            canvas: canvas
        });

        // set
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        
        // set camera at origin
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 0;

        // add nodes to scene
        nodes.forEach(node => scene.add( node ));

        // add links to scene
        links.forEach(link => scene.add( link ));

        // render
        renderer.render( scene, camera );
        
        // animate
        function animate(){
            requestAnimationFrame( animate );

            // move objects
            camera.rotation.z += z_rotation_speed;

            // render
            renderer.render( scene, camera );
        }
        animate();


        // scroll animation
        function moveCamera(){
            
            // get position of client from top
            const t = document.querySelector('main').scrollTop

            // // move camera
            camera.position.z = t * z_zoom_out_speed;
        }

        // set on scroll
        setTimeout(() => {
            const main = document.querySelector('main');
            main.addEventListener('scroll', moveCamera)
        }, 200);
    })

</script>

<canvas id="bg" class="fade-in-long"></canvas>

<style>

    canvas {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        z-index: 0;
    }
        
</style>