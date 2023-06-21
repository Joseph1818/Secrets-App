//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

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

// Shema
const userSchema = {
  email: String,
  password: String,
};

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
  console.log("Server started on port 3000");
});
