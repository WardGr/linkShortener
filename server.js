const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const HTTPS_PORT = 8443;
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const db_file = "db.sqlite";

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/link.boozydev.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/link.boozydev.com/fullchain.pem'),
};

app.use(cors());
app.use(express.json());

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (!req.secure) {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

app.get("/", (req, res, next) => {
    res.json({"status":"ward is best"});
});

app.get("/api", (req, res, next) => {
    res.json({"status":"alive"});
});

app.get("/api/:key", (req, res, next) => {
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

app.put('/api/addKey', async (req, res) => {
    const key = generateRandomCombination();
    const link = req.body.link;


    const result = await addDb(key, link);
    console.log(result);

    res.json({result: result});
    console.log("new entry " + key + " : " + link + " has been added.");
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
            console.log('Table created. Try not to break it this time.');
        }
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
    return name;
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


const server = https.createServer(options, app);

server.listen(HTTPS_PORT, () => {
    console.log(`Server running on port ${HTTPS_PORT}`);
});

