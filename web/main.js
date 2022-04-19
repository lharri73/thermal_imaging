const fs = require('fs');
const readdirSync = fs.readdirSync;
const lstatSync = fs.lstatSync;
const http = require('http');
const mysql = require('mysql');

const orderRecentFiles = (dir) =>
  readdirSync(dir)
    .filter(f => lstatSync(dir +"/"+ f).isFile())
    .map(file => ({ file, mtime: lstatSync(dir + "/" + file).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

const getMostRecentFile = (dir) => {
  const files = orderRecentFiles(dir).slice(0,6);
  return files.length ? files : null;
};

const getTemperature = () => {
    const data = fs.readFileSync('./temperature.txt');
    return data.toString().split("|");
};


var con = mysql.createConnection({
  host: "localhost",
  user: "sd",
  password: "supersecretpassword",
  database: "sd_values"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});



function getFileContents(url){
    // DANGER: this could read the whole filesystem to the internet...I don't care
    // (give it a path with '..')

    let ret = new Promise((resolve, reject) => {
        fs.readFile(__dirname + url, (err, data) =>{
            if(err != null)
                reject(err);
            resolve(data);
        });
    });
    return ret;
}

const requestListener = function (req, res) {
    if(req.url == "/")
        req.url = "/index.html";
    console.log(req.url);
    switch(true){
        case (/.*\.(html|js|css)$/).test(req.url):
            // handle all html and js files
            getFileContents(req.url).then(contents =>{
                if((/.*\.js$/).test(req.url)){
                    res.setHeader("Content-Type", "text/javascript");
                }else if((/.*\.html$/).test(req.url)){
                    res.setHeader("Content-Type", "text/html");
                }else{
                    res.setHeader("Content-Type", "text/css");
                }
                res.writeHead(200);
                res.end(contents);
            }).catch(err =>{
                res.writeHead(404);
                res.end(err.message);
            });
            break;
        case (/.*\.jpg$/).test(req.url):
            if(!(/\d+\.jpg$/).test(req.url)){
                res.writeHead(404);
                res.end("Invalid image format. should be #.jpg");
            }else{
                res.setHeader("Content-Type", "image/jpg");
                let files = orderRecentFiles(__dirname + "/img");
                let indx = req.url.match(/(\d+)\.jpg$/)[1];
                if(files.length < indx){
                    res.writeHead(404);
                    res.end("Not enough images yet");
                    break;
                }
                const retFile = "/img/" + files[indx]['file']
                getFileContents(retFile).then(contents =>{
                    res.writeHead(200);
                    res.end(contents);
                }).catch(err =>{
                    res.setHeader("Content-Type", "text/plaintext");
                    res.writeHead(404);
                    res.end(err.message);
                })
            }
            break;
        case (req.url == '/temperature'):
            res.writeHead(200);
            res.end(JSON.stringify(getTemperature()));
            break;
        case (req.url == '/add_rect'):
	        console.log(req);
            req.on('data', (data)=>{
                let str = JSON.parse(data.toString());
                var sql = `INSERT INTO rect_pos (min_x, max_x, min_y, max_y) VALUES (${str.minX}, ${str.maxX}, ${str.minY}, ${str.maxY})`
                console.log(sql);
                  con.query(sql, function (err, result) {
                      if (err) throw err;
                      console.log("1 record inserted");
                  });
            })
	        break;
        default:
            res.writeHead(404);
            res.end("Invalid Route");
            break;
    }


};



const host = '0.0.0.0';
const port = 8000;
const server = http.createServer(requestListener);

server.listen(port, host, () =>{
    // called when the setup is complete
    console.log(`Running on http://${host}:${port}`);
});


