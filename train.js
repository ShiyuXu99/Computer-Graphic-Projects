/*jshint esversion: 6 */
// @ts-check

import { draggablePoints } from "./Libs/dragPoints.js";
import { RunCanvas } from "./Libs/runCanvas.js";

/**
 * Have the array of control points for the track be a
 * "global" (to the module) variable
 *
 * Note: the control points are stored as Arrays of 2 numbers, rather than
 * as "objects" with an x,y. Because we require a Cardinal Spline (interpolating)
 * the track is defined by a list of points.
 *
 * things are set up with an initial track
 */
/** @type Array<number[]> */
let thePoints = [[150, 150], [150, 450], [450, 450], [450, 150]];

/**
 * Draw function - this is the meat of the operation
 *
 * It's the main thing that needs to be changed
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} param
 */
function draw(canvas, param) {
    let context = canvas.getContext("2d");
    // clear the screen
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw the control points
    thePoints.forEach(function (pt) {
        context.beginPath();
        context.arc(pt[0], pt[1], 5, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    });

    // now, the student should add code to draw the track and train
    context.beginPath();
    let u = param;

    var length = thePoints.length;
    var gradArray = [[], []];
    for (var i = 0; i < length; i++) {
        if ((i - 1) % length < 0) {
            var j = length + (i - 1) % length;
        }
        else {
            j = (i - 1) % length;
        }
        let grad_h0_x = 0.5 * (thePoints[(i + 1) % length][0] - thePoints[j][0]);
        let grad_h0_y = 0.5 * (thePoints[(i + 1) % length][1] - thePoints[j][1]);

        let grad_h1_x = 0.5 * (thePoints[(i + 2) % length][0] - thePoints[(i) % length][0]);
        let grad_h1_y = 0.5 * (thePoints[(i + 2) % length][1] - thePoints[(i) % length][1]);

        gradArray.push([grad_h0_x, grad_h0_y], [grad_h1_x, grad_h1_y]);

        let h0_x = thePoints[(i) % length][0];
        let h0_y = thePoints[(i) % length][1];

        let h1_x = thePoints[(i + 1) % length][0];
        let h1_y = thePoints[(i + 1) % length][1];

        let p1_x = h0_x + (1 / 3) * (grad_h0_x);
        let p1_y = h0_y + (1 / 3) * (grad_h0_y);
        let p2_x = h1_x - (1 / 3) * (grad_h1_x);
        let p2_y = h1_y - (1 / 3) * (grad_h1_y);

        context.moveTo(h0_x, h0_y);
        context.bezierCurveTo(p1_x, p1_y, p2_x, p2_y, h1_x, h1_y);
        context.stroke();

        //context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        if (i <= u && u <= i + 1) {
            u = u - i;
            let pu = u*Math.PI;
            var xpos = (1 - 3 * u * u + 2 * u * u * u) * h0_x +
             (u - 2 * u * u + u * u * u) * grad_h0_x + 
             (3 * u * u - 2 * u * u * u) * h1_x + 
             (-u * u + u * u * u) * grad_h1_x;
            var ypos = (1 - 3 * u * u + 2 * u * u * u) * h0_y +
             (u - 2 * u * u + u * u * u) * grad_h0_y + 
             (3 * u * u - 2 * u * u * u) * h1_y + 
             (-u * u + u * u * u) * grad_h1_y;

             var dx = (-6*u + 6*u*u)*h0_x + (1-4*u + 3*u*u)*grad_h0_x + (6*u - 6*u*u)*h1_x + (-2*u + 3*u*u)*grad_h1_x;
             var dy = (-6*u + 6*u*u)*h0_y + (1-4*u + 3*u*u)*grad_h0_y + (6*u - 6*u*u)*h1_y + (-2*u + 3*u*u)*grad_h1_y;

            
            context.translate(xpos,ypos);
            context.rotate(Math.atan2(dy,dx));
            context.translate(-xpos,-ypos);
            context.rect(xpos - 20, ypos-10, 40, 20);
            context.rect(xpos , ypos-5, 30, 10);
            context.stroke();
            context.restore();
        }
    }


}

/**
 * Setup stuff - make a "window.onload" that sets up the UI and starts
 * the train
 */
let oldOnLoad = window.onload;
window.onload = function () {
    let theCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
    let theContext = theCanvas.getContext("2d");
    // we need the slider for the draw function, but we need the draw function
    // to create the slider - so create a variable and we'll change it later
    let theSlider; // = undefined;

    // note: we wrap the draw call so we can pass the right arguments
    function wrapDraw() {
        // do modular arithmetic since the end of the track should be the beginning
        draw(theCanvas, Number(theSlider.value) % thePoints.length);
    }
    // create a UI
    let runcavas = new RunCanvas(theCanvas, wrapDraw);
    // now we can connect the draw function correctly
    theSlider = runcavas.range;

    function addCheckbox(name, initial = false) {
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        document.getElementsByTagName("body")[0].appendChild(checkbox);
        checkbox.id = name;
        checkbox.onchange = wrapDraw;
        checkbox.checked = initial;
        let checklabel = document.createElement("label");
        checklabel.setAttribute("for", "simple-track");
        checklabel.innerText = name;
        document.getElementsByTagName("body")[0].appendChild(checklabel);
    }
  
    // helper function - set the slider to have max = # of control points
    function setNumPoints() {
        runcavas.setupSlider(0, thePoints.length, 0.05);
    }
    setNumPoints();
    runcavas.setValue(0);
    draggablePoints(theCanvas, thePoints,
        wrapDraw,
        10, setNumPoints);


};
