/*
var timeoutId = setTimeout(function(){
    window.location.reload(1);
}, 10000);
*/


/*
autoRender = setInterval(reRender, 5000)
var element = document.getElementById('list'),
    autoRender;

function reRender() {
    element.style.display = 'none';
    element.style.display = 'block';
    console.log("re-rendered");
}
*/

var isDrawing = false;
var startX, startY;
var ratio = [1,1];


window.onload = function(){
    const curDate = new Date();
    const curTime = `${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`
    document.getElementById('update-time').innerHTML = curTime;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    setupAndRegister(canvas, ctx)
    setupClickEvents(canvas, ctx);

    // Calling alerts here
    document.getElementById('update-time').innerHTML = curTime;
    var threshold = document.getElementById('threshold').value
    var current_temp = 49;

    if (current_temp > threshold) {
        document.getElementById('alert').style.visibility = "visible";
        fetch("/send_alert", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(true)
          });
        
    }
    else {document.getElementById('alert').style.visibility = "invisible";}

}


function getTemp(ID){
    return new Promise((resolve, reject) =>{
        fetch(`/temperature`).then((resp, data) => {
            resp.text().then(val =>{
                resolve(val);
            })
        });
    });
}


function sendClear(e){
    fetch("/clear_rect", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: "garbage"
    }).then(() => {
        alert("Cleared!");
    });
}

function setupAndRegister(canvas, ctx){
    var img = new Image();
    img.src = '/0.jpg';
    img.onload = function(){
        fill_canvas(canvas, ctx, img);
    }
    document.getElementById("clearBut").onclick = sendClear;
}


function fill_canvas(canvas, ctx, img){
    // CREATE CANVAS CONTEXT.
    let asr = img.width / img.height;

    var width = window.innerWidth*0.4;
    var height = width / asr;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);       // DRAW THE IMAGE TO THE CANVAS.
    ratio[0] = img.width / width;
    ratio[1] = img.height / height;
}

function setupClickEvents(canvas, ctx){
    canvas.onmousedown = function(e){
        if(e.which == 1){
            // left mouse button
            let mouseX = e.offsetX;
            let mouseY = e.offsetY;
            if(isDrawing){
                isDrawing=false;
                ctx.beginPath();
                ctx.rect(startX,startY,mouseX-startX,mouseY-startY);
                ctx.fill();
                canvas.style.cursor="default";
                let data = {
                    minX: Math.min(startX, mouseX) * ratio[0],
                    maxX: Math.max(startX, mouseX) * ratio[0],
                    minY: Math.min(startY, mouseY) * ratio[1],
                    maxY: Math.max(startY, mouseY) * ratio[1]
                };
                fetch("/add_rect", {
                  method: "POST",
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(data)
                });
                timeoutId = setTimeout(function(){
                    window.location.reload(1);
                }, 10000);
            }else{
                isDrawing=true;
                startX=mouseX;
                startY=mouseY;
                canvas.style.cursor="crosshair";
                clearTimeout(timeoutId);
            }
        }else if(e.which == 3){
            // right mouse button
            fetch("/rem_rect", {
                method: "POST", 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({x: e.offsetX*ratio[0], y: e.offsetY*ratio[1]})
            });
        }
    }
    canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };
}

/*
$(document).ready(function () {

    var images = "";

    setInterval(update, 5000);

    function update() {

        $.get("./recent")
        .done(function(response) { 
            if (response != "")
            {
                let json = JSON.parse(response);
                if (json[0].file == images)
                    return;

                insertImages(json[0].file);

                var currentdate = new Date(); 
                var datetime = currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "&nbsp;"
                + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear();
                $('#update-time').html(datetime);
            }
        }).fail(function() { 
        });

        $.get("./temperature")
        .done(function(response) { 
            if (response != "")
            {
                let json = JSON.parse(response);

                mperature(json[0], json[1]);
            }
        }).fail(function() { 
        });
    }

    function insertImages(url) {
        for (let i = 4; i > 0; i--) {
            $('#img'+i+">img").attr('src', $('#img'+(i-1)+">img").attr('src'));
        }
        $('#img0>img').attr('src', $('#imgCurrent').attr('src'));
        $('#imgCurrent').attr('src',url);
        images = url;
    }

    function mperature(min, max) {
        $('#inp_min').val(min);
        $('#inp_max').val(max);
    }
});
*/
