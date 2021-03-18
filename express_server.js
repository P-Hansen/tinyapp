const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const { request } = require("express");
const morgan = require("morgan");
const cookieParser = require('cookie-parser')

//middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev"));

//data
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userId: "1a1a1a"},
  "9sm5xK": {longURL: "http://www.google.com", userId: "2b2b2b"}
};
const users = {
  123456: {
    id: "123456",
    email: "fake@fakemail.com",
    password: "p455w02d"
  }
};

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//delete
app.post("/urls/:shortURL/delete", (req, res) => {
  let key = req.params.shortURL;
  key = key.replace(/:/g, '');
  // console.log("key key key! ",key);
  // console.log(`you can delete if you match ${req.cookies.user_id} - ${urlDatabase[key]["userId"]}`)
  if (req.cookies.user_id === urlDatabase[key]["userId"]) {
    console.log("The thing to delete: " + key);
    delete urlDatabase[key];
    res.redirect("/urls");
  } else {
    res.status(401);
    res.send('Error 403! you do not have permission to delete this file');
  };
});

//edit
app.post("/urls/:shortURL", (req, res) => {
  let key = req.params.shortURL;
  key = key.replace(/:/g, '');
  if (req.cookies.user_id === urlDatabase[key]["userId"]) {
    let updatedAddress = req.body.longURL;
  //console.log("update this key: " + key);
  //console.log("update this address: ", updatedAddress);
    urlDatabase[key] = {longURL: updatedAddress, userId: req.cookies.user_id};
    res.redirect("/urls");
  } else {
  res.status(401);
  res.send('Error 403! you do not have permission to edit this file');
  };
});

//login
app.post("/login", (req, res) => {
  let newEmail = req.body["email"];
  const pass = req.body["password"];
  console.log("this person is trying to login: ", newEmail);
  console.log("With this password:", pass);
  for (const entry in users){
    if (users[entry]["email"] === newEmail && users[entry]["password"] === pass){
      console.log("All good come on in!");
      res.cookie("user_id", users[entry]["id"]);
      res.redirect("/urls");
    };
  };
  res.status(403);
  res.send('Error 403! email/password combination not found');
});

//logout
app.post("/logout", (req, res) => {
  //let username = req.body["username"];
  //console.log("this cookie is being eaten: ", username);
  res.clearCookie("user_id");
  //console.log("the cookie contains: ", req.cookies["username"]);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  //console.log(req.body.longURL);
  //console.log(shortURL);
  urlDatabase[shortURL] = {longURL: req.body.longURL, userId: req.cookies.user_id};
  //console.log(Object.keys(urlDatabase));
  //console.log(shortURL);
  //console.log(urlDatabase[shortURL]);
  res.redirect(`/urls/:${shortURL}`);
});

//Short URL link out NO LOGIN NEEDED!
app.get("/u/:shortURL", (req, res) => {
  let key = req.params.shortURL;
  key = key.replace(/:/g, '');
  //console.log("this is the key: "+key);
  const longURL = urlDatabase[key]["longURL"];
  //console.log("this is the long url: "+longURL);
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

//register set
app.post("/register", (req, res) => {
  let newEmail = req.body["email"];
  let newPassword = req.body["password"];
  console.log("is this thing empty? ",newEmail);
  if (!newEmail){
    res.status(400);
    res.send('Error 400! empty email');
  };
  for (const entry in users){
    //console.log("this shouls be all the emails: ", users[entry]["email"]);
    if (users[entry]["email"] === newEmail){
      res.status(400);
      res.send('Error 400! email already in use');
    };
  };
    let newId = generateRandomString();
    const userObj = {
      id: newId,
      email: newEmail,
      password: newPassword
    };
    console.log(`database say hello to:${newId} email:${newEmail} and keep this password "${newPassword}" secret`);
    users[newId] = userObj;
    res.cookie("user_id", newId);
    res.redirect("/urls");
});

//render login
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: urlDatabase
  };
  res.render("login", templateVars);
});

//render register
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: urlDatabase
  };
  res.render("register", templateVars);
});

//render urls new
app.get("/urls/new", (req, res) => {
  if (loggedIn(req, res)) {
    const templateVars = {
      user: users[req.cookies.user_id]
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  };
});

//render urls show
app.get("/urls/:shortURL", (req, res) => {
  if (loggedIn(req, res)) {
    let key = req.params.shortURL;
    key = key.replace(/:/g, '');
    //console.log("Key = " + key);
    //console.log("Long URL = " + urlDatabase[key]);
    const templateVars = {
      user: users[req.cookies.user_id],
      shortURL: req.params.shortURL,
      longURL: urlDatabase[key]["longURL"]
    };
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login");
  };
});

//render index
app.get("/urls", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: urlsForUser(req.cookies.user_id)
  };
  res.render("urls_index", templateVars);
});

//root hello
app.get("/", (req, res) => {
  res.send("Hello!");
});

//listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//random string
function generateRandomString() {
  const possibleLetters = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    randomString += possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
  };
  return randomString;
};

//Are you logged in?
const loggedIn = (req, res) => {
  if (req.cookies.user_id) {
    return req.cookies.user_id;
  } else {
    return false;
  };
};

//returns my urls
const urlsForUser = (id) => {
  const myURLs = {};
  for (const entry in urlDatabase){
    console.log(`are this ${urlDatabase[entry]["userId"]} and ${id} equal?`)
    if (urlDatabase[entry]["userId"] === id){
      myURLs[entry] = (urlDatabase[entry]);
    };
  };
  return myURLs;
};