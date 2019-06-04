
window.onload = function () {
    let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("2DQuadcopter"));
    let context = canvas.getContext("2d");

    function drawQuad(angle){
        context.save();
        context.fillStyle = "grey";
        context.beginPath();
        context.fillRect(300,300,10,120);
        context.fillRect(245,355,120,10);
        //body part
        context.moveTo(305,385);
        context.lineTo(325,360);
        context.lineTo(305,335);
        context.lineTo(285,360);
        context.fill();
        
        //Wing1
        context.translate(305,305);
        context.rotate(angle*12);
        context.translate(-305,-305);
        drawWing1(context);
        
        context.restore();

        context.save();
        //Wing2
        context.translate(250,360);
        context.rotate(angle*12);
        context.translate(-250,-360);
        drawWing2(context);
        context.restore();

        context.save();
        //Wing3
        context.translate(360,360);
        context.rotate(angle*12);
        context.translate(-360,-360);
        drawWing3(context);
        context.restore();

        context.save();
        //Wing4
        context.translate(305,415);
        context.rotate(angle*12);
        context.translate(-305,-415);
        drawWing4(context);
        context.restore();

    }
    function drawWing1(angle){
        context.save();
        context.fillStyle = "black";
        context.fillRect(285,302,40,5);
        context.restore();
    }
    function drawWing2(angle){
        //Wing2
        context.save();
        context.fillStyle = "red";
        context.fillRect(247,340,5,40);
        context.restore();
    }
    function drawWing3(angle){
        context.save();
        context.fillStyle = "blue";
        context.fillRect(358,340,5,40);
        context.restore();
    }
    function drawWing4(angle){
        context.save();
        context.fillStyle = "green";
        context.fillRect(285,412,40,5);
        context.restore();
    }
    function drawScene() {
        let a = performance.now()/1000;
        context.clearRect(0,0,canvas.width,canvas.height);
        context.save();
        context.translate(200,200);
        context.rotate(a);
        context.translate(-200,-400);
        drawQuad(a);
        context.restore();
        context.restore();
        window.requestAnimationFrame(drawScene);
    }
    drawScene();
    drawQuad();
};