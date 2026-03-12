const express = require("express");
const router = express.Router();

const controller = require("../controllers/userController");

router.get("/", controller.home);

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/users/:username", controller.getUser);

router.get("/users/:username/post/:id", controller.userPost);

router.get("/search", controller.searchUser);

router.get("/profile", controller.profile);

router.get("/profile/:username", controller.profileByName);

module.exports = router;