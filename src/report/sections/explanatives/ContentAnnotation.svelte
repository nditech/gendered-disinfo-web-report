<script>

    // ui lib
    import { onMount } from "svelte";

    // import constants
    import { SUBDIRECTORY } from '../../../constants.json';

    // constants size
    const canvas_w = 400;
    const canvas_h = 440;
    const post_padding = 8;
    const opacity = 0.6;
    const annotator_w = 300;
    const post_w = 70;

    const pause_timer_length = 100;

    const annotator_x_pos = (canvas_w/2.0 - annotator_w/2.0);
    const annotator_y_pos = canvas_h - annotator_w;
    const post_x_pos = (canvas_w/2.0 - post_w/2.0);

    const black = "#000";
    const red = "#e44e4e";
    const green = "#009900";


    function random(N){
        return Math.floor(Math.random() * N);
    }


    onMount(() => {

        // grab canvas
        const canvas = document.getElementById('contentannotationcanvas');
        const ctx = canvas.getContext('2d');

        // set canvas style dimensions
        canvas.width = canvas_w
        canvas.height = canvas_h

        // set opacity
        ctx.globalAlpha = opacity;

        // grab images
        const youtube = document.getElementById('post-youtube');
        const facebook = document.getElementById('post-facebook');
        const telegram = document.getElementById('post-telegram');
        const twitter = document.getElementById('post-twitter');
        const checkmark = document.getElementById('checkmark');
        const annotator = document.getElementById('annotator');
        const images = [youtube, facebook, telegram, twitter];

        function redraw(img, y){

            // clear
            ctx.clearRect(0, 0, canvas_w, canvas_h)

            // post image
            ctx.drawImage(img, post_x_pos, y, post_w, post_w);

            // background image
            ctx.drawImage(annotator, annotator_x_pos, annotator_y_pos);
        }

        function draw_checkmark(img, y, color){

            // clear
            ctx.clearRect(0, 0, canvas_w, canvas_h)

            // post image
            ctx.drawImage(checkmark, post_x_pos + post_w + post_padding, y_pos, post_w, post_w);

            // set composite mode
            ctx.globalCompositeOperation = "source-in";

            // draw color
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas_w, canvas_h);

            // reset composite mode
            ctx.globalCompositeOperation = "source-over";

            // post image
            ctx.drawImage(img, post_x_pos, y, post_w, post_w);

            // background image
            ctx.drawImage(annotator, annotator_x_pos, annotator_y_pos);
        }

        // init
        let y_pos = 0;
        let pause_timer = 0;
        let image = images[random(images.length)];
        let color = black;
        let color_set = false;

        // animate
        function animate(){
            setInterval(() => {
                if(Math.abs(annotator_y_pos - (y_pos + post_w + post_padding)) < 4){
                    // if it has reached the head of the annotator

                    // increment timer
                    pause_timer += 1;

                    if(pause_timer > pause_timer_length){
                        // if timer has reached threshold

                        // reset timer
                        pause_timer = 0;

                        // reset position
                        y_pos = 0;

                        // reset color
                        color = black;
                        color_set = false;

                        // change image randomly
                        image = images[random(images.length)];

                    }else if(pause_timer > pause_timer_length/2.0 && !color_set){
                        // if timer has reached half of threshold

                        // change color
                        color = random(2) === 1 ? red : green;

                        // draw checkmark
                        draw_checkmark(image, y_pos, color);

                        // turn flag to true
                        color_set = true;
                    }
                }else{
                    y_pos += 2;
                    redraw(image, y_pos);
                }
            }, 20)
        }

        // launch
        animate();
    })

</script>


<!-- images, hidden -->
<div style="display: none;">
    <img id="post-facebook" alt="facebook" src="{SUBDIRECTORY}assets/images/facebook.png">
    <img id="post-twitter" alt="twitter" src="{SUBDIRECTORY}assets/images/twitter.png">
    <img id="post-telegram" alt="telegram" src="{SUBDIRECTORY}assets/images/telegram.png">
    <img id="post-youtube" alt="youtube" src="{SUBDIRECTORY}assets/images/youtube.png">
    <img id="checkmark" alt="checkmark" src="{SUBDIRECTORY}assets/images/checkmark.png">
    <img id="annotator" alt="annotator" src="{SUBDIRECTORY}assets/explanatives/annotator.png">
</div>

<!-- canvas -->
<canvas id="contentannotationcanvas"></canvas>


<style>

    canvas {
        margin: auto;
        width: 120px;
        height: auto;
    }

</style>