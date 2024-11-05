const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const galleryService = require("../service/gallery.service");

router.post("/search", galleryService.search);
router.get("/select/:gallery_id", galleryService.select);

//router.get("/select", galleryService.select);

router.post("/gallery", galleryService.findGallery);

module.exports = router;
