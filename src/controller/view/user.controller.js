const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/main", (req, res) => {
  res.render("main", { user: req.session.user });
});

//사용자 페이지
router.get("/index", (req, res) => {
  res.render("index");
});

//선웨이라군 호텔
router.get("/hotel", (req, res) => {
  res.render("hotel");
});

//캠프 생활 엿보기
router.get("/camp_life", (req, res) => {
  res.render("camp_life");
});

//캠프 신청하기
router.get("/camp_apply", (req, res) => {
  res.render("camp_apply");
});

//킹슬리
router.get("/kingsley", (req, res) => {
  res.render("kingsley");
});

//커뮤니티
router.get("/community", (req, res) => {
  res.render("community");
});

//커뮤니티 작성
router.get("/community_write", (req, res) => {
  res.render("community_write");
});

//커뮤니티 수정
router.get("/community_edit", (req, res) => {
  res.render("community_edit");
});

//커뮤니티 작성 완료
router.get("/community_write_complete", (req, res) => {
  res.render("community_write_complete");
});

module.exports = router;
