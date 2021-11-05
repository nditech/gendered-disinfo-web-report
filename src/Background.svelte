<script>

    // ui lib
    import { onMount } from "svelte";

    // three.js libs
    import * as THREE from 'three';

    // constants
    const position_spread = 30;
    const nbr_of_objects = 80;
    const speed_limiter = 0.5;

    // helper functions
    const material_objs = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.05, transparent: true, wireframe: true } );
    const material_knot = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.02, transparent: true, wireframe: true } );
    const rand_radius = () => { return Math.ceil(Math.random()*2); };
    const rand_details = () => { return Math.ceil(Math.random()*2); };
    const rand_position = () => {  return Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(position_spread)) }


    onMount(() => {

        // grab canvas
        const canvas = document.querySelector('#bg');

        // init elements
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
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

        // generate random objects
        let objects = [];
        for (let i=0 ; i<nbr_of_objects ; i++){

            // generate geometry
            let geometry;
            if( i % 3 === 0 ){
                geometry = new THREE.SphereGeometry(rand_radius(), rand_details(), rand_details())
            }else if( i % 3 === 1 ){
                geometry = new THREE.TetrahedronGeometry(rand_radius(), rand_details())
            }else if( i % 3 === 2 ){
                geometry = new THREE.BoxGeometry(rand_radius(), rand_radius(), rand_radius())
            }

            // object
            const obj = new THREE.Mesh( geometry, material_objs );

            // set position
            const [ x, y, z ] = rand_position();
            obj.position.set(x, y, z) 

            // add
            objects.push(obj);
        }

        // add objects to scene
        objects.forEach(obj => scene.add( obj ));

        // generate a knot
        const geometry = new THREE.TorusKnotGeometry(20, 6, 200, 100, 3, 5)
        const knot = new THREE.Mesh( geometry, material_knot );
        knot.position.set(5, 5, 5) 
        scene.add( knot )

        // animate
        function animate(){
            requestAnimationFrame( animate );

            // move objects
            objects.forEach(obj => {
                obj.rotation.x += speed_limiter*0.002;
                obj.rotation.y += speed_limiter*0.005;
                obj.rotation.z += speed_limiter*0.002;
            })

            // move knot
            knot.rotation.x += speed_limiter*0.0004;
            knot.rotation.y += speed_limiter*0.001;
            knot.rotation.z += speed_limiter*0.0004;

            // render
            renderer.render( scene, camera );
        }

        animate();


        // scroll animation
        function moveCamera(){
            
            // get position of client from top
            const t = document.querySelector('main').scrollTop

            // // move camera
            camera.position.z = t * 0.001;
            camera.position.x = t * 0.0002;
            camera.position.y = t * 0.0002;

        }

        // set on scroll
        setTimeout(() => {
            const main = document.querySelector('main');
            main.addEventListener('scroll', moveCamera)
        }, 200);
    })

</script>


<canvas id="bg"></canvas>


<style>

    canvas {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        z-index: 0;
    }
    
</style>