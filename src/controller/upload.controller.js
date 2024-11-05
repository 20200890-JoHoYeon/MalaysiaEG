const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const uploadService = require("../service/upload.service");


router.post("/", upload.single("file"), uploadService.uploadFile);
router.post("/deleteFile", uploadService.deleteFile);


module.exports = router;
