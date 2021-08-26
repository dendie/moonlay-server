const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const auth = require('./middleware/auth');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const jwt = require('jsonwebtoken');

const app = express();
const router = express.Router();
router.use(cors());

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "LoginSystem"
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    bcrypt.compare(password, result[0].password, function(err, res2) {
                        if (res2 == true) {
                            let token = jwt.sign({"id": result[0].id }, 'hsC0hyDhU80V16JKyKVN9LH7M2uXye8dYKWaita2XBwkdbE7FIV1u6uAmDMJPTwR');
                            res.send({ ...result, token: token, status: 200 });
                        } else {
                            res.send({ status: 400, message: "Wrong Password !"});
                        }
                    });
                } else {
                    res.send({ message: "Username Not Found !"});
                }
            }
        }
    )
})

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "INSERT INTO users (username, password) VALUES (?,?)",
        [username, password],
        (err, result) => {
            console.log(err)
        }
    );
});

app.post("/createCompany", auth, (req, res) => {
    const name = req.body.name;
    const date = req.body.date;
    const type = req.body.type;
    const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
    const late_status = diffDays(new Date(date), new Date()) > 30 ? "TERLAMBAT" : '';
    const biaya_pendaftaran = req.body.type.toLowerCase() === 'perseorangan' ? '1000000' : '3000000';

    db.query(
        "INSERT INTO company (name, date, type, late_status, biaya_pendaftaran) VALUES (?,?,?,?,?)",
        [name, date, type, late_status, biaya_pendaftaran],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/companies", auth, (req, res) => {
    db.query("SELECT * from company", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

router.get('/', auth, (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

app.listen(3001, () => {
    console.log("running server");
})