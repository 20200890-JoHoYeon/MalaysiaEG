const express = require("express");
const router = express.Router();

router.use("/", require("./view"));
router.use("/community", require("./community.controller"));
router.use("/gallery", require("./gallery.controller"));
router.use("/user", require("./user.controller"));
router.use("/offer", require("./offer.controller"));
router.use("/upload", require("./upload.controller"));

module.exports = router;
