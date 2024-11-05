const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const communityService = require("../service/community.service");

// ** 전체 조회
//      => category_id 따라서 response 다름
router.get("/:category_id", communityService.findAll);

//관리자 답변 작성
router.post("/insert", communityService.saveAnswer);

//관리자 답변 수정
router.put("/insert", communityService.updateAnswer);

// ** 묻고 답하기 (qna)
//검색
router.post("/qna/search", communityService.searchQna);

// 상세조회
router.get("/qna/:content_id", communityService.findOneQna);

// 작성
router.post("/qna", communityService.saveQna);

// 수정
router.put("/qna", communityService.updateQna);

// ** 설명회 요청
//검색
router.post("/presentation/search", communityService.searchPresentation);

// 상세조회
router.get("/presentation/:content_id", communityService.findOneSeminar);

// 작성
router.post("/presentation", communityService.savePresentation);

// 수정
router.put("/presentation", communityService.updatePresentaion);

// ** 리뷰
//검색
router.post("/review/search", communityService.searchReview);

// 상세조회
router.get("/review/:content_id", communityService.findOneReview);

// 작성
router.post("/review", communityService.saveReview);

// 수정
router.put("/review", communityService.updateReview);

// ** 게시판 수정
router.put("/update", communityService.update);

// ** 답변
router.get("/answer/:content_id", communityService.answer);

// ** 게시판 삭제
router.delete("/:content_id", communityService.delete);

router.get("/insert", (req, res) => {
  res.render("commu_insert_test");
});
router.get("/update", (req, res) => {
  res.render("commu_update_test");
});

module.exports = router;
