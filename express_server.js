const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  //console.log(req.body.longURL);
  //console.log(shortURL);
  urlDatabase[shortURL] = req.body.longURL;
  //console.log(Object.keys(urlDatabase));
  //console.log(shortURL);
  //console.log(urlDatabase[shortURL]);
  res.redirect(`/urls/:${shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  let key = req.params.shortURL;
  key = key.replace(/:/g, '');
  //console.log("Key = " + key);
  //console.log("Long URL = " + urlDatabase[key]);
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[key] //req.params.longURL //Not working?!
    };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let key = req.params.shortURL;
  key = key.replace(/:/g, '');
  console.log("this is the key: "+key);
  const longURL = urlDatabase[key];
  console.log("this is the long url: "+longURL);
  res.redirect(longURL);
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  const possibleLetters = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    randomString += possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
  };
  return randomString;
}