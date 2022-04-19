var timeoutId = setTimeout(function(){
    window.location.reload(1);
}, 10000);

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
    }
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
