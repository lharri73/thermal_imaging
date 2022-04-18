const fs = require('fs');
const readdirSync = fs.readdirSync;
const lstatSync = fs.lstatSync;
const http = require('http');

const orderRecentFiles = (dir) =>
  readdirSync(dir)
    .filter(f => lstatSync(dir +"/"+ f).isFile())
    .map(file => ({ file, mtime: lstatSync(dir + "/" + file).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

const getMostRecentFile = (dir) => {
  const files = orderRecentFiles(dir);
  return files.length ? files[0] : null;
};


// Load Data Base
const Datastore = require("nedb")
const db = new Datastore("database.db")
const min_max_db = new Datastore("min_max_table.db")
db.loadDatabase();
min_max_db.loadDatabase();
min_max_db.count({}, function (err, count) {
    if (count < 1) min_max_db.insert({min: 1000, max: 0, _id: "RpTiSugs3px2uSEK"})
  });
var counter = 0;



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
        case (req.url == '/test'):
            res.writeHead(200);
            res.end("test route " + counter);
            break;
        default:
            res.writeHead(404);
            res.end("Invalid Route");
            break;
    }

    // Testing database storing
    counter += 1
    if (counter % 8 == 0)
    { 
        console.log(counter) 
        // Storing values into database
        db.insert({min: 50, max: 70, mean: 0})
        // Get the most updated min and max values for website table
        min_max_db.update({ _id: "RpTiSugs3px2uSEK" }, { $min: { min: 50 } }, {}, function () {
            });
        min_max_db.update({ _id: "RpTiSugs3px2uSEK" }, { $max: { max: counter } }, {}, function () {
            });
        // Updates the min max table
        min_max_db.persistence.compactDatafile()
        
        // values can be retrieved here
        min_max_db.find({ _id: "RpTiSugs3px2uSEK" }, function (err, docs) {
            console.log(docs)
            });
    }
    
    
};

const host = '0.0.0.0';
const port = 8000;
const server = http.createServer(requestListener);

server.listen(port, host, () =>{
    // called when the setup is complete
    console.log(`Running on http://${host}:${port}`);
});


