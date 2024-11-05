const express = require("express");
const router = express.Router();

router.use("/", require("./user.controller"));
router.use("/admin", require("./admin.controller"));
module.exports = router;
