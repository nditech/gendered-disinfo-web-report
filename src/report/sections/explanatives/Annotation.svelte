<script>

    // ui lib
    import { onMount } from "svelte";

    // load constants
    import { SUBDIRECTORY } from '../../../constants.json';

    // constants size
    const canvas_w = 400;
    const canvas_h = 440;
    const post_padding = 32;
    const opacity = 0.9;
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
        const canvas_check = document.getElementById('contentannotationcanvas_check');
        const ctx_check = canvas_check.getContext('2d');

        // set canvas style dimensions
        canvas.width = canvas_w
        canvas.height = canvas_h
        canvas_check.width = canvas_w
        canvas_check.height = canvas_h

        // set opacity
        ctx.globalAlpha = opacity;
        ctx_check.globalAlpha = opacity;

        // grab images
        const youtube = document.getElementById('post-youtube');
        const facebook = document.getElementById('post-facebook');
        const telegram = document.getElementById('post-telegram');
        const twitter = document.getElementById('post-twitter');
        const annotator = document.getElementById('annotator');
        const approve = document.getElementById('approve');
        const reject = document.getElementById('reject');
        const images = [youtube, facebook, telegram, twitter];

        function redraw(img, y){

            // clear
            ctx.clearRect(0, 0, canvas_w, canvas_h)
            ctx_check.clearRect(0, 0, canvas_w, canvas_h)

            // post image
            ctx.drawImage(img, post_x_pos, y, post_w, post_w);

            // background image
            ctx.drawImage(annotator, annotator_x_pos, annotator_y_pos);

            // set composite mode
            ctx.globalCompositeOperation = "source-in";

            // draw color
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas_w, canvas_h);

            // reset composite mode
            ctx.globalCompositeOperation = "source-over";
        }

        function draw_checkmark(color, _approve){

            // clear
            ctx_check.clearRect(0, 0, canvas_w, canvas_h)

            // post image
            if(_approve){
                ctx_check.drawImage(approve, post_x_pos + post_w + post_padding, y_pos, post_w, post_w);
            }else{
                ctx_check.drawImage(reject, post_x_pos + post_w + post_padding, y_pos, post_w, post_w);
            }

            // set composite mode
            ctx_check.globalCompositeOperation = "source-in";

            // draw color
            ctx_check.fillStyle = color;
            ctx_check.fillRect(0, 0, canvas_w, canvas_h);

            // reset composite mode
            ctx_check.globalCompositeOperation = "source-over";
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
                        y_pos = -100;

                        // reset color
                        color = black;
                        color_set = false;

                        // change image randomly
                        image = images[random(images.length)];

                    }else if(pause_timer > pause_timer_length/2.0 && !color_set){
                        // if timer has reached half of threshold

                        // change color
                        if(random(2) === 1){
                            draw_checkmark(red, false);
                        }else{
                            draw_checkmark(green, true);
                        }

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


<div id="annotation-container">
    <div id="annotation-vertical-center">
        <!-- images, hidden -->
        <div style="display: none;">
            <img id="post-facebook" alt="facebook" src="{SUBDIRECTORY}assets/images/facebook.png">
            <img id="post-twitter" alt="twitter" src="{SUBDIRECTORY}assets/images/twitter.png">
            <img id="post-telegram" alt="telegram" src="{SUBDIRECTORY}assets/images/telegram.png">
            <img id="post-youtube" alt="youtube" src="{SUBDIRECTORY}assets/images/youtube.png">
            <img id="approve" alt="approve" src="{SUBDIRECTORY}assets/images/approve.png">
            <img id="reject" alt="reject" src="{SUBDIRECTORY}assets/images/reject.png">
            <img id="annotator" alt="annotator" src="{SUBDIRECTORY}assets/images/annotator.png">
        </div>

        <!-- canvas -->
        <canvas style="position: fixed;" id="contentannotationcanvas"></canvas>
        <canvas id="contentannotationcanvas_check"></canvas>
    </div>
</div>

<style>

    #annotation-container {
        position: relative;
        margin: 0px auto;
        max-width: 200px;
        height: 160px;
    }

    #annotation-vertical-center {
        position: absolute;
        margin: 0;
        top: 50%;
        left: 50%;
        width: 100%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        overflow-y:hidden;
        text-align: center;
    }

    canvas {
        margin: auto;
        width: 140px;
        height: auto;
    }

</style>