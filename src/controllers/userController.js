const path = require("path");
const { readUsers, saveUsers } = require("../models/userModel");

exports.home = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/login.html"));
};

exports.register = (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const users = readUsers();

  const existingUser = users.find(u => u.username === username);

  if (existingUser) {
    return res.status(409).send("User already exists");
  }

  const newUser = { username, password };

  users.push(newUser);

  saveUsers(users);

  res.status(201).send("User registered successfully");
};

exports.login = (req, res) => {

  const { username, password } = req.body;

  const users = readUsers();

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if(user){
    res.redirect(`/dashboard.html?username=${encodeURIComponent(user.username)}`);
  } else {
    res.send("Invalid username or password");
  }

};

exports.getUser = (req, res) => {

  const { username } = req.params;

  const users = readUsers();

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.json(user);
};

exports.userPost = (req, res) => {

  const { username, id } = req.params;

  res.send(`User: ${username}, Post ID: ${id}`);

};

exports.searchUser = (req, res) => {

  const { username } = req.query;

  if (!username) {
    return res.send("Please provide username in query");
  }

  const users = readUsers();

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.json(user);

};

exports.profile = (req, res) => {
  res.send("No username provided");
};

exports.profileByName = (req, res) => {

  const { username } = req.params;

  res.send(`Profile of ${username}`);

};