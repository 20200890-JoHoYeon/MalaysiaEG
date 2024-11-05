const express = require("express");
const router = express.Router();
const checkSessionMiddleware = require("../../utils/sessionMiddleware");
const upload = require("../../utils/multer");
const communityService = require("../../service/community.service");
const galleryService = require("../../service/gallery.service");
const offerService = require("../../service/offer.service");
const userService = require("../../service/user.service");

router.get(["/index", "/", ""], (req, res) => {
  if (req.cookies.topper) {
    req.session.user = {
      id: req.cookies.user,
    };
    return res.redirect("/admin/gallery_main");
  }
  if (req.session.user) {
    return res.redirect("/admin/gallery_main");
  }
  res.render("admin/login", { user: req.session.user });
});
router.post("/find_user", userService.find_user);

router.get("/community/review/insert", checkSessionMiddleware, (req, res) => {
  res.render("admin/review_test", { user: req.session.user });
});
router.get("/community/review/select", communityService.review_select);
router.post(
  "/community/review/insert",
  checkSessionMiddleware,
  communityService.saveReview
);
router.delete("/community/review/:content_id", communityService.delete);
router.put("/community/review/update", communityService.updateReview);

// qna 검색
router.post("/community/qna/search", communityService.searchQna);
// presentation 검색
router.post(
  "/community/presentation/search",
  communityService.searchPresentation
);
// review 검색
router.post("/community/review/search", communityService.searchReview);

router.get("/community/admin_select", communityService.admin_select);
router.get(
  "/community/admin_select/:content_id",
  communityService.admin_select
);
router.get("/community/insertAnswer", checkSessionMiddleware, (req, res) => {
  res.render("admin/commu_answer_test", { user: req.session.user });
});
router.post(
  "/community/saveAnswer",
  checkSessionMiddleware,
  communityService.saveAnswer
);
router.post("/community/uploadAnswer", communityService.uploadAnswer);
router.post("/community/updateAnswer", communityService.updateAnswer);

router.get(
  "/community/presentation/select",
  communityService.presentation_select
);
router.get("/community/ask/select", communityService.ask_select);

router.post("/gallery/insert", checkSessionMiddleware, galleryService.insert);
router.post("/gallery/update", galleryService.update);
router.post("/gallery/delete", galleryService.delete);
router.get("/gallery/select", galleryService.select);
router.get("/gallery/select/:gallery_id", galleryService.select);
router.post("/gallery/search", galleryService.search);

router.post("/offer/search", offerService.search);
router.post("/offer/insertAnswer", offerService.insertAnswer);
router.post("/offer/sendAnswer", offerService.sendAnswer);
router.put("/offer/updateAnswer", offerService.updateAnswer);
router.get("/offer/select/:offer_id", offerService.select);

router.get("/offer/insertAnswer", checkSessionMiddleware, (req, res) => {
  res.render("admin/offer_answer_test", { user: req.session.user });
});
router.get("/offer/updateAnswer", checkSessionMiddleware, (req, res) => {
  res.render("admin/offer_answer_update_test", { user: req.session.user });
});

//갤러리 관리
router.get("/gallery_main", checkSessionMiddleware, (req, res) => {
  res.render("admin/gallery_main", { user: req.session.user });
});

router.get("/gallery_register", checkSessionMiddleware, (req, res) => {
  res.render("admin/gallery_register", { user: req.session.user });
});

router.get("/gallery_edit", checkSessionMiddleware, (req, res) => {
  res.render("admin/gallery_edit", { user: req.session.user });
});
router.get("/gallery_detail", checkSessionMiddleware, (req, res) => {
  res.render("admin/gallery_detail", { user: req.session.user });
});

//견적내역 관리
router.get("/estimate_main", checkSessionMiddleware, (req, res) => {
  res.render("admin/estimate_main", { user: req.session.user });
});
router.get("/estimate_register", checkSessionMiddleware, (req, res) => {
  res.render("admin/estimate_register", { user: req.session.user });
});
router.get("/estimate_edit", checkSessionMiddleware, (req, res) => {
  res.render("admin/estimate_edit", { user: req.session.user });
});
router.get("/estimate_detail", checkSessionMiddleware, (req, res) => {
  res.render("admin/estimate_detail", { user: req.session.user });
});

//커뮤니티 관리-묻고 답하기
router.get("/questionAnswer_main", checkSessionMiddleware, (req, res) => {
  res.render("admin/questionAnswer_main", { user: req.session.user });
});
router.get("/questionAnswer_register", checkSessionMiddleware, (req, res) => {
  res.render("admin/questionAnswer_register", { user: req.session.user });
});
router.get("/questionAnswer_edit", checkSessionMiddleware, (req, res) => {
  res.render("admin/questionAnswer_edit", { user: req.session.user });
});
router.get("/questionAnswer_detail", checkSessionMiddleware, (req, res) => {
  res.render("admin/questionAnswer_detail", { user: req.session.user });
});

//커뮤니티 관리-설명회 요청
router.get("/presentation_main", checkSessionMiddleware, (req, res) => {
  res.render("admin/presentation_main", { user: req.session.user });
});
router.get("/presentation_register", checkSessionMiddleware, (req, res) => {
  res.render("admin/presentation_register", { user: req.session.user });
});
router.get("/presentation_edit", checkSessionMiddleware, (req, res) => {
  res.render("admin/presentation_edit", { user: req.session.user });
});
router.get("/presentation_detail", checkSessionMiddleware, (req, res) => {
  res.render("admin/presentation_detail", { user: req.session.user });
});

//커뮤니티 관리-참가자 리뷰
router.get("/customerReview_main", checkSessionMiddleware, (req, res) => {
  res.render("admin/customerReview_main", { user: req.session.user });
});
router.get("/customerReview_register", checkSessionMiddleware, (req, res) => {
  res.render("admin/customerReview_register", { user: req.session.user });
});
router.get("/customerReview_edit", checkSessionMiddleware, (req, res) => {
  res.render("admin/customerReview_edit", { user: req.session.user });
});
router.get("/customerReview_detail", checkSessionMiddleware, (req, res) => {
  res.render("admin/customerReview_detail", { user: req.session.user });
});
module.exports = router;
