//const host = 'https://dev.shsoftnet.com:1081'; //NOTE
const host = "";
const URL = "http://14.63.220.194:3080";
//const URL = "http://localhost:3000";
const lang = {
  decimal: "",
  emptyTable: "데이터가 없습니다.",
  thousands: ",",
  zeroRecords: "검색된 데이터가 없습니다.",
};

$(document).ready(function () {
  const currentPathname = window.location.pathname;
  const navBtnArr = document.querySelectorAll(".nav-arrow-btn");
  const logoBtn = document.getElementById("logo_btn");
  const contentBtn = document.getElementById("content_page_btn");
  const counselBtn = document.getElementById("counsel_page_btn");
  const instaBtn = document.getElementById("insta_page_btn");
  const nameText = document.getElementById("name-text");
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      onClickLnb(event, "/user/logout");
    });
  }

  if (sessionStorage.getItem("username")) {
    const userName = sessionStorage.getItem("username");
    const userId = sessionStorage.getItem("userid");
    if (nameText) {
      nameText.innerHTML = `ADMIN ${userName}님 로그아웃`;
    }
  }

  if (navBtnArr[0]) {
    if (currentPathname.includes("content")) {
      navBtnArr[1].style.display = "none";
      navBtnArr[2].style.display = "none";
    } else if (currentPathname.includes("consultation")) {
      navBtnArr[0].style.display = "none";
      navBtnArr[2].style.display = "none";
    } else if (currentPathname.includes("instagram")) {
      navBtnArr[0].style.display = "none";
      navBtnArr[1].style.display = "none";
    }
  }

  if (logoBtn) {
    logoBtn.addEventListener("click", function () {
      onClickLnb(event, "/admin/gallery_main");
    });
  }
  if (contentBtn) {
    contentBtn.addEventListener("click", function (event) {
      event.preventDefault();
      onClickLnb(event, "/admin/gallery_main");
    });
  }
  if (counselBtn) {
    counselBtn.addEventListener("click", function (event) {
      event.preventDefault();
      onClickLnb(event, "/admin/consultation_main");
    });
  }
  if (instaBtn) {
    instaBtn.addEventListener("click", function (event) {
      event.preventDefault();
      onClickLnb(event, "/admin/instagram_main");
    });
  }
});

// $(document).ready(function () {
//   $("#top_bar").load("/admin/common/topbar");
//   $("#accordion_sidebar").load("/admin/common/sidebar");
//   //$('#footer').load('/admin/common/footer')
// });

const formatPhone = (origin) => {
  return `${origin.slice(0, 3)}-${origin.slice(3, 7)}-${origin.slice(7)}`;
};

const regexDetail = /^[\s\S]{0,1000}$/; // 국/영문, 숫자, 특수문자 최대 1,000자
const regexDetailTen = /^[\s\S]{10,1000}$/; // 국/영문, 숫자, 특수문자 최대 10 ~ 1,000자
const regexTitle = /^[^\p{C}]{1,30}$/u;
const regexNote = /^[^\p{C}]{0,300}$/u;
const regexLink = /^[^\p{C}]{0,150}$/u;
const regexId = /^[a-zA-Z0-9]{4,10}$/;
const regexPwd = /^[\w!@#$%^&*()-+=~]{4,16}$/;

const validInput = (data, rgx, text) => {
  if (!rgx.test(data)) {
    alert(text);
    return false;
  }
  return true;
};

const requireInput = (inputs) => {
  for (const input of inputs) {
    if (
      !input ||
      (typeof input === "string" && input.trim() === "") ||
      (input instanceof File && !input.name)
    ) {
      alert("필수값이 입력되지 않았습니다.", input);
      return false;
    }
  }
  return true;
};

const categoryDecode = (code) => {
  const category = ["캠퍼스생활", "체육/특별활동", "현지라이프"];
  return category[code - 1] || "";
};

const purposeDecode = (code) => {
  const purposes = ["미작성", "작성완료", "전송완료", "등록완료"];
  let index = 0;

  if (code == "n") {
    index = 0;
  } else if (code == "w") {
    index = 1;
  } else if (code == "s") {
    index = 2;
  } else if (code == "d") {
    index = 3;
  }

  return purposes[index] || "";
};

const purposeMainDecode = (code) => {
  const purposesMain = ["n", "w", "d"];

  return purposesMain[code - 1] || "";
};
const offerMainDecode = (code) => {
  const purposesMain = ["n", "w", "s"];

  return purposesMain[code - 1] || "";
};

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//파일 삭제
const deleteFile = async (file_id) => {
  const raw = JSON.stringify({
    file_id,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${host}/upload/deleteFile`, requestOptions);
    const { code, message } = await response.json();
    if (code === 200) {
    } else {
    }
  } catch (err) {
    console.log("Err:", err);
  }
};

const onClickLnb = (event, url) => {
  event.preventDefault();

  const currentPage = window.location.pathname;
  const targetUrl = ["/admin/gallery_register", "/admin/gallery_edit"];

  let shouldLogout = true;

  if (currentPage === targetUrl[0] || currentPage === targetUrl[1]) {
    if (confirm("등록을 취소하시겠습니까?")) {
      shouldLogout = true;
    } else {
      shouldLogout = false;
    }
  }
  if (shouldLogout) {
    window.location.href = url;
  }
};

const onChangeCategory = (val) => {
  const subCategoryEl = $(".sub-category-tr");
  const subSelectValue = $("#sub_category");

  if (parseInt(val) === 1) {
    subCategoryEl.removeClass("hidden");
  } else {
    subCategoryEl.addClass("hidden");
    subSelectValue.val("");
  }
};

// 관리자 갤러리 페이지 등록 형식 영역
function toggleForm() {
  const type = document.querySelector('input[name="form"]:checked').value;
  var registerSubTitle = document.getElementById("register-sub-title");
  var imageForm = document.getElementById("imageForm");
  var videoForm = document.getElementById("videoForm");

  if (type == 1) {
    registerSubTitle.innerText = "■ 이미지 등록";
    imageForm.style.display = "table"; // 이미지 폼 표시
    videoForm.style.display = "none"; // 동영상 폼 숨김
  } else if (type == 2) {
    registerSubTitle.innerText = "■ 동영상 등록";
    imageForm.style.display = "none"; // 이미지 폼 숨김
    videoForm.style.display = "table"; // 동영상 폼 표시
  }
}
