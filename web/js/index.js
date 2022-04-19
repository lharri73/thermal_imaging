
const timeoutId = setTimeout(function(){
    window.location.reload(1);
}, 2000);

var isDrawing = false;
var startX, startY;

window.onload = function(){
    const curDate = new Date();
    const curTime = `${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`
    document.getElementById('update-time').innerHTML = curTime;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    setupAndRegister(canvas, ctx)
    setupClickEvents(canvas, ctx);
}

function setupAndRegister(canvas, ctx){
    var img = new Image();
    img.src = '/0.jpg';
    img.onload = function(){
        fill_canvas(canvas, ctx, img);
    }
}

function fill_canvas(canvas, ctx, img){
    // CREATE CANVAS CONTEXT.
    let asr = img.width / img.height;

    var width = window.innerWidth*0.4;
    var height = width / asr;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);       // DRAW THE IMAGE TO THE CANVAS.
}

function setupClickEvents(canvas, ctx){
    canvas.onmousedown = function(e){
        let mouseX = e.offsetX;
        let mouseY = e.offsetY;
        if(isDrawing){
            isDrawing=false;
            ctx.beginPath();
            ctx.rect(startX,startY,mouseX-startX,mouseY-startY);
            ctx.fill();
            canvas.style.cursor="default";
		fetch("/post/data/here", {
		  method: "POST",
		  headers: {'Content-Type': 'application/json'},
		  body: JSON.stringify(data)
		})
        }else{
            isDrawing=true;
            startX=mouseX;
            startY=mouseY;
            canvas.style.cursor="crosshair";
            clearTimeout(timeoutId);
        }
    }
}

