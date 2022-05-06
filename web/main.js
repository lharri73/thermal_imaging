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

function getTemperature(){
    let query = `SELECT * FROM rect_temps ORDER BY DateCreated DESC LIMIT 1`
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result){
            if (err) {
                console.warn(err);
                resolve(-1);
            }else{
                console.log(result[0]);
                if(result.length == 1){
                    let temps = [];
                    for(const property in result[0]){
                        if(property == "id") continue;
                        if(property == "DateCreated") continue;
                        temps.push(result[0][property]);
                    }
                    resolve(Math.max(...temps));
                }else
                    resolve(-1);
            }
        })
    });
};


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

function sendMail()
{
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: 'jadamso2@vols.utk.edu', // Change to your recipient
        from: 'jadamso2@vols.utk.edu', // Change to your verified sender
        subject: 'Alert with thermal device',
        text: 'Alert with thermal device',
        html: '<strong>Alert with thermal device</strong>',
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
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
                res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                res.setHeader("Pragma", "no-cache");
                res.setHeader("Expires", "0");
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
        case (req.url == '/send_alert'):
                res.writeHead(200);
                //sendMail()
                break;
        case (req.url == '/temperature'):
            res.setHeader("Content-Type", "text/plaintext");
            res.writeHead(200);
            getTemperature().then((tmp) =>{
                res.end(JSON.stringify(tmp));
                console.log(`ended with ${tmp}`)
            });
            break;
        case (req.url == '/add_rect'):
            req.on('data', (data)=>{
                let str = JSON.parse(data.toString());
                var sql = `INSERT INTO rect_pos (min_x, max_x, min_y, max_y) VALUES (${str.minX}, ${str.maxX}, ${str.minY}, ${str.maxY})`
                console.log(sql);
                let id=0;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    id = result.insertId;
                    let sql2 = `ALTER TABLE rect_temps ADD max_${id} DOUBLE`;
                    con.query(sql2, function (err, result) {
                        if (err) throw err;
                        console.log(result);
                    });
                });
            })
            res.writeHead(200);
            res.end();
            break;
        case (req.url == "/clear_rect"):
            let sql = `DELETE FROM rect_pos`
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result);
            });
            let sql2 = `TRUNCATE TABLE rect_temps`
            con.query(sql2, function (err, result) {
                if (err) throw err;
                console.log(result);
            });
            res.writeHead(200);
            res.end();
            break;
        case (req.url == "/rem_rect"):
            req.on('data', (data)=>{
                let str = JSON.parse(data.toString());
                let quer = `SELECT id FROM rect_pos WHERE min_x < ${str.x} AND max_x > ${str.x} AND min_y < ${str.y} AND max_y > ${str.y}`
                con.query(quer, function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    ids = [];
                    tables = [];
                    result.forEach(el =>{
                        ids.push(el.id);
                        tables.push(`max_${el.id}`);
                    })
                    console.log(ids);
                    if(ids.length != 0){
                        var sql = `DELETE FROM rect_pos WHERE id IN (${ids.join(',')})`;
                        console.log(sql);
                        con.query(sql, function(err, result) {
                            if (err) throw err;
                            console.log(result);
                        });
                        var sql2 = `ALTER TABLE rect_temps DROP COLUMN ${tables.join(', DROP COLUMN ')}`;
                        console.log(sql2);
                        con.query(sql2, function(err, result) {
                            if (err) throw err;
                            console.log(result);
                        });
                    }
                });
            });
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
