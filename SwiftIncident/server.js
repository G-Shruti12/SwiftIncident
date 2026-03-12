
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const USERS_FILE = path.join(__dirname, "users.json");

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading users:", err);
    return [];
  }
}


function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Error saving users:", err);
    throw err;
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});


app.post("/register", (req, res) => {
  try {

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

  } catch (error) {

    console.error(error);
    res.status(500).send("Internal server error");

  }
});


app.post("/login", (req, res) => {

  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync("users.json"));

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if(user){

    res.redirect(`/dashboard.html?username=${encodeURIComponent(user.username)}`);

  } else {

    res.send("Invalid username or password");

  }

});

app.get("/users/:username", (req, res) => {

  try {

    const { username } = req.params;

    const users = readUsers();

    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json(user);

  } catch (error) {

    console.error(error);
    res.status(500).send("Internal server error");

  }

});


app.get("/users/:username/post/:id", (req, res) => {

  const { username, id } = req.params;

  res.send(`User: ${username}, Post ID: ${id}`);

});


app.get("/search", (req, res) => {

  try {

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

  } catch (error) {

    console.error(error);
    res.status(500).send("Internal server error");

  }

});


app.get("/profile", (req, res) => {
  res.send("No username provided");
});

app.get("/profile/:username", (req, res) => {

  const { username } = req.params;

  res.send(`Profile of ${username}`);

});

app.use((req, res) => {
  res.status(404).send("404 - Route Not Found");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});