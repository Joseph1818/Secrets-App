//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO

mongoose.connect("mongodb://127.0.0.1/userDB", { useNewUrlParser: true });

// Shema Obeject created from a mongoose schema class.
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//Adding encrypted field.
const secret = "This is our little Secret";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

// Model
const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  try {
    await newUser.save();
    res.render("secrets");
  } catch (err) {
    console.log(err);
  }
});

// This methods check if the Username and password is true.
app.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ email: username });
    if (foundUser && foundUser.password === password) {
      res.render("secrets");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, function () {
  console.log("Secrets-App Server Successfully started on port 3000");
});
