const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const offerService = require("../service/offer.service");

router.post("/select", offerService.select);
router.get("/:offer_id", offerService.select);
router.post("/insert", offerService.insertOffer);
router.get("/answer/:offer_id", offerService.answer);
router.post("/updateAnswer", offerService.updateAnswer);
router.post("/insertAnswer", offerService.insertAnswer);

module.exports = router;
