const express = require("express");
const router = express.Router();
const userService = require("../service/user.service");

router.get("/logout", userService.logout);

router.post("/login", userService.login);

module.exports = router;
