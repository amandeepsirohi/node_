require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home.ejs")
});

app.get("/login", (req, res) => {
    res.render("login.ejs")
});

app.get("/register", (req, res) => {
    res.render("register.ejs")
});

app.post("/register", (req, res) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        //bcrypt encryption
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            const user = new User({
                email: req.body.username,
                password: md5(req.body.password)
            })
            user.save().then(() => {
                res.render("secrets");
            }).catch((err) => {
                console.log(err);
            });
        });
    });
    //md5-encryption
    // const user = new User({
    //     email: req.body.username,
    //     password: md5(req.body.password)
    // })
    // user.save().then(() => {
    //     res.render("secrets");
    // }).catch((err) => {
    //     console.log(err);
    // });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    // const password = md5(req.body.password); for md5
    const password = req.body.password;

    User.findOne({ email: username }).then((data) => {
        if (data) {
            //md5
            // if (data.password === password) {
            //     res.render("secrets.ejs");
            // } else {
            //     console.log("Password is Wrong");
            // }
            bcrypt.compare(password, data.password, function(err, result) {
                // result == true
                res.render("secrets.ejs");
            });
            bcrypt.compare(password, data.password, function(err, result) {
                // result == false
                console.log("Wrong Password");
            });


        }
        if (!data) {
            console.log("User Doesn't Exist");
        }
    })
});

app.listen(3000, function() {
    console.log("Server Started on port 3000");
})