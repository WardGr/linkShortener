/*const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();

app.get('/', (req,res)=>{
    res.send("Hello from express server.")
})

https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(4000, () => {
    console.log("server is runing at port 4000");
  });*/

var express = require("express");
var app = express();
var HTTP_PORT = 8000;
var sqlite3 = require('sqlite3').verbose();
const db_file = "db.sqlite";

app.listen(HTTP_PORT, () => {
    console.log("Server running on port " + HTTP_PORT);
});

app.get("/", (req, res, next) => {
    console.log("x");
    res.json({"message":"Ok"});
});

app.use(function(req, res){
    res.status(404);
});

const db = new sqlite3.Database(db_file, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.run(`CREATE TABLE shortKey (
    name,
    link 
    )`,
(err) => {
    if (err) {
    }else{
        var insert = 'INSERT INTO shortKey (name, link) VALUES (?,?)'
        db.run(insert, ["AdJP","https://wardgrosemans.be"]) // test value 1
        db.run(insert, ["dPel2","https://boozydev.com"]) // test value 2
        addDb("test2", "test123.com");
    }
});



app.get("/:key", (req, res, next) => {
    console.log("in get!");
    const key = req.params.key;
    const query = 'SELECT link FROM shortKey WHERE name = ?';
    db.get(query, [key], (err, row) => {
        if (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
        } else {
        if (row) {
            res.redirect(row.link);
        } else {
            res.status(404).send('Key not found');
        }
        }
    });
});

app.put('/:key', (req, res) => {
    console.log("in put!");
    const key = req.params.key;
    const link = req.body.link; 

    addDb(key, link);

    res.json({ message: 'Entry added successfully' });
    console.log("new entry " + key + " : " + link + "has been added.");
});

async function addDb(name, link) {
    while (await exists(name)) {
        name = generateRandomCombination();
    }
    const insertQuery = 'INSERT INTO shortKey (name, link) VALUES (?, ?)';
  
    db.run(insertQuery, [name, link], function(err) {
        if (err) {
        return console.error(err.message);
        }
        console.log(`New entry added!`);
    });
}

function generateRandomCombination() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let res = '';
  
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      res += characters.charAt(randomIndex);
    }
  
    return res;
}

function exists(comb) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT name, link FROM shortKey WHERE name LIKE ?';
        db.all(query, [comb], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows.length > 0);
            }
        });
    });
}



function hash(x) {
    return db5(x); // To not forget usage of db5
}