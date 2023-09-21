require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

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


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

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
    const user = new User({
        email: req.body.username,
        password: req.body.password
    })
    user.save().then(() => {
        res.render("secrets");
    }).catch((err) => {
        console.log(err);
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }).then((data) => {
        if (data) {
            if (data.password === password) {
                res.render("secrets.ejs");
            } else {
                console.log("Password is Wrong");
            }
        }
        if (!data) {
            console.log("User Doesn't Exist");
        }
    })
});

app.listen(3000, function() {
    console.log("Server Started on port 3000");
})