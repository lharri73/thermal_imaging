



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
var thresh_val = 0
var canvas = null;
var ctx = null;

function toBinary(string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  const charCodes = new Uint8Array(codeUnits.buffer);
  let result = '';
  for (let i = 0; i < charCodes.byteLength; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}

var timeoutId = setInterval(function(){
    for(let i=0; i <6; i++){
        let img = new Image();
        img.src = `/${i}.jpg`;
        img.onload = function(){
            if(i == 0){
                fill_canvas(img);
            }else{
                let cur_img = document.getElementById(`img${i-1}_tag`);
                cur_img.src = cur_img.src;
            }
        }
    }
}, 1000);

window.onload = function(){
    const curDate = new Date();
    const curTime = `${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`;

    document.getElementById('update-time').innerHTML = curTime;
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    setupAndRegister(canvas, ctx);
    setupClickEvents(canvas, ctx);


    // Calling alerts here
    document.getElementById('thresh').innerHTML = localStorage.getItem('stored_thresh')
    var threshold = document.getElementById('thresh').innerHTML
    
    getTemp().then(temp=> {
        console.log(temp)
        if (Number(temp) > Number(threshold)) {
            document.getElementById('alert').style.visibility = "visible";
            fetch("/send_alert", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(true)
              });
            
        }
        else {document.getElementById('alert').style.visibility = "invisible";}
    })




}

function getAlertInput()
{
    document.getElementById('thresh').innerHTML = document.getElementById('threshold').value 
    localStorage.setItem('stored_thresh', document.getElementById('thresh').innerHTML);
}

function getTemp(){
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

function setupAndRegister(){
    var img = new Image();
    img.src = '/0.jpg';
    img.onload = function(){
        fill_canvas(img);
    }
    document.getElementById("clearBut").onclick = sendClear;
}


function fill_canvas(img){
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

function setupClickEvents(){
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
                window.location.reload(1);
            }else{
                isDrawing=true;
                startX=mouseX;
                startY=mouseY;
                canvas.style.cursor="crosshair";
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

