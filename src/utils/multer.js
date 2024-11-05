const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/uploads");
  },
  filename: (req, file, callback) => {
    const originalExtension = file.originalname.split(".").pop(); // 원본 파일의 확장자 추출
    callback(null, file.fieldname + "-" + Date.now() + "." + originalExtension);
  },
});

// 파일 필터 함수: 이미지 파일 여부를 검사하는 로직
const fileFilter = function (req, file, callback) {
  // 이미지 파일인지 MIME 타입으로 검사
  /*
  if (file.mimetype.startsWith("image/")) {
    callback(null, true); // 이미지 파일인 경우 허용
  } else {
    callback(new Error("Only image files are allowed!"), false); // 이미지 파일이 아닌 경우 에러 발생
  }
  */
 
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"]; // 필요한 경우 더 많은 동영상 MIME 타입을 추가하세요.
  const etcType = [ "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-excel", // xls
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "application/vnd.ms-powerpoint", // ppt
  "application/x-hwp", // hwp
  "application/haansofthwp", // hwp (alternative MIME type)
  "application/pdf" // pdf 
];
  if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype) || etcType.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("허용되지 않는 파일입니다."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;
