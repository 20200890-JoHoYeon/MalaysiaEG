let fileId = [];
let originRegDateTime = null;
let selectDateTime = null;
const params = new URLSearchParams(window.location.search);
const id = params.get("content_id");
const fileNameElArr = document.getElementsByClassName("file-name");
const cancelElArr = document.getElementsByClassName("cancel-btn");
const fileInputElArr = document.getElementsByName("productImgArr[]");

$(document).ready(function () {
  $(".date-pick").datepicker({
    dateFormat: "yy-mm-dd",
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true,
    placement: "bottom",
    orientation: "auto bottom",
    templates: {
      leftArrow: '<i class="fa fa-angle-left"></i>',
      rightArrow: '<i class="fa fa-angle-right"></i>',
    },
    endDate: new Date(),
  });

  findContent();

  for (let i = 0; i < 24; i++) {
    let hour = i.toString().padStart(2, "0");
    $("#hour").append("<option value='" + hour + "'>" + hour + "</option>");
  }
  for (let i = 0; i < 60; i++) {
    let minute = i.toString().padStart(2, "0");
    $("#minute").append(
      "<option value='" + minute + "'>" + minute + "</option>"
    );
  }
  for (let i = 0; i < 60; i++) {
    let second = i.toString().padStart(2, "0");
    $("#second").append(
      "<option value='" + second + "'>" + second + "</option>"
    );
  }

  $("#start_date, #hour, #minute, #second").change(function () {
    const selectDate = $("#start_date").val();
    const selectHour = $("#hour").val();
    const selectMinute = $("#minute").val();
    const selectSecond = $("#second").val();

    selectDateTime = dayjs(
      selectDate + " " + selectHour + ":" + selectMinute + ":" + selectSecond
    );
    const nowTime = dayjs();
    if (selectDateTime.isAfter(nowTime)) {
      $("#start_date").val(originRegDateTime.format("YYYY-MM-DD"));
      $("#hour").val(originRegDateTime.format("HH"));
      $("#minute").val(originRegDateTime.format("mm"));
      $("#second").val(originRegDateTime.format("ss"));
      selectDateTime = originRegDateTime;
      alert("현재 시간 이후로는 선택이 불가능합니다");
    }
  });
  $("#start_date").blur(function () {
    $("#start_date").val(dayjs(selectDateTime).format("YYYY-MM-DD"));
  });

  Array.from(cancelElArr).forEach(function (cancelBtn, i) {
    fileInputElArr[i].addEventListener("change", function () {
      uploadFile(i);
    });
    cancelBtn.addEventListener("click", function () {
      fileInputElArr[i].value = "";

      fileId[i] = null;

      fileNameElArr[i].textContent = "";
      cancelBtn.style.display = "none";
      //deleteFile(fileId[i]);
    });
  });

  $("#to_board_btn").on("click", onClickCancleBtn);
  $("#register_btn").on("click", onClickRegisterBtn);
});

const onClickCancleBtn = () => {
  const result = window.confirm("수정을 취소하시겠습니까?");
  if (result) {
    location.href = "/admin/customerReview_main";
  }
};

//상세 조회
const findContent = async () => {
  try {
    const response = await fetch(`${host}/community/review/` + id);
    const { code, message, data } = await response.json();
    if (code === 200) {
      if (!data) {
        return;
      }
      console.log(data);
      console.log(data.response);
      console.log(data.file);
      const res = data.response;
      const files = data.file;
      const title = document.getElementById("title");
      const reg_user = document.getElementById("reg_user");
      const regDate = document.querySelector("#start_date");
      const content = document.querySelector(".review-content");
      const review_link = document.getElementById("review_link");
      const last_mod_date = document.getElementById("last_mod_date");
      console.log(res.reg_user);
      reg_user.value = res.reg_user;
      content.value = res.content;
      title.value = res.title;
      review_link.value = res.review_link;
      console.log(review_link.value);
      for (let i = 0; i <= 4; i++) {
        if (files[i]) {
          fileId[i] = files[i].file_id;
        }
        console.log("파일아이디", fileId[i]);
      }

      if (res.exposure_yn === "Y") {
        document.querySelector(".exposure.y").checked = true;
      } else {
        document.querySelector(".exposure.n").checked = true;
      }

      let formattedDate = dayjs(res.mod_date).format("YYYY-MM-DD HH:mm:ss");

      last_mod_date.textContent =
        formattedDate == "Invalid Date" ? "-" : formattedDate;

      originRegDateTime = dayjs(res.reg_date);

      console.log(originRegDateTime);

      regDate.value = originRegDateTime.format("YYYY-MM-DD");
      selectDateTime = originRegDateTime.format("YYYY-MM-DD HH:mm:ss");
      hour.value = dayjs(res.reg_date).format("HH");
      minute.value = dayjs(res.reg_date).format("mm");
      second.value = dayjs(res.reg_date).format("ss");

      const filesName = [
        files[0] ? files[0].change_name : null,
        files[1] ? files[1].change_name : null,
        files[2] ? files[2].change_name : null,
        files[3] ? files[3].change_name : null,
        files[4] ? files[4].change_name : null,
      ];
      console.log(filesName);
      filesName.forEach((name, i) => {
        console.log(name);
        if (!(name == null)) {
          fileNameElArr[i].textContent = name;
          fileNameElArr[i].style.display = "inline";
          cancelElArr[i].style.display = "inline-block";
        }
      });
    }
  } catch (err) {
    console.log("Err:", err);
  }
};

const fileButtonStyle = (i) => {
  const file = fileInputElArr[i].files[0];
  if (file != null) {
    const fileName = file.name;
    fileNameElArr[i].textContent = fileName;
    fileNameElArr[i].style.display = "inline";
    cancelElArr[i].style.display = "inline-block";
  } else {
    fileNameElArr[i].style.display = "none";
    cancelElArr[i].style.display = "none";
  }
};

//참가자 리뷰 인풋값 고정
function preventDelete(event) {
  const fixedInput = document.getElementById("review_link");
  const fixedValue = "https://www.";

  // 입력이 변경될 때마다 현재 값과 비교
  if (!fixedInput.value.startsWith(fixedValue)) {
    // 현재 값이 고정된 값으로 시작하지 않으면 변경을 취소하고 이전 값으로 되돌림
    fixedInput.value = fixedValue;
  }
}

//파일 등록
const uploadFile = async (i) => {
  const file = fileInputElArr[i].files[0];

  if (file) {
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    const maxSizeInMB = 3;
    if (fileSizeInMB > maxSizeInMB) {
      alert("파일 크기가 3MB를 초과하였습니다.");
      fileInputElArr[i].value = "";
      return;
    }
  }

  if (fileId[i] != null) {
    fileId[i] = null;
    await deleteFile(fileId[i]);
  }

  fileButtonStyle(i);

  const formData = new FormData();
  formData.append("file", file);

  const requestOptions = {
    method: "POST",
    body: formData,
  };

  try {
    const response = await fetch(`${host}/upload`, requestOptions);
    const { code, message, data } = await response.json();
    if (code === 200) {
      fileId[i] = data.file_id;
    } else {
      alert(message || "파일등록 오류");
    }
  } catch (err) {
    alert("에러가 발생했습니다.");
    //console.log("Err", err);
  }
};

//컨텐츠 등록
const onClickRegisterBtn = async (e) => {
  const title = document.getElementById("title").value;
  const reg_user = document.getElementById("reg_user").value;
  const content = document.querySelector(".review-content").value;
  const review_link = document.getElementById("review_link").value;
  const exposure_yn = document.querySelector(
    'input[name="exposure_yn"]:checked'
  ).value;

  if (!requireInput([title, reg_user, content, selectDateTime])) {
    return;
  }

  if (!regexTitle.test(title)) {
    alert("제목은 국/영문, 숫자, 특수문자 최대 300자까지만 입력 가능합니다.");
    return false;
  }
  if (!regexNote.test(reg_user)) {
    alert("작성자는 국/영문, 숫자, 특수문자 최대 300자까지만 입력 가능합니다.");
    return false;
  }
  if (!regexLink.test(review_link)) {
    alert("링크는 국/영문, 숫자, 특수문자 최대 300자까지만 입력 가능합니다.");
    return false;
  }
  if (!regexDetail.test(content)) {
    alert("내용은 국/영문, 숫자, 특수문자 최대 1000자까지만 입력 가능합니다.");
    return false;
  }

  const raw = JSON.stringify({
    content_id: id,
    category_id: 3,
    title: title,
    reg_user: reg_user,
    reg_date: dayjs(selectDateTime).format("YYYY-MM-DD HH:mm:ss"),
    content: content,
    review_link: review_link,
    file: fileId,
    exposure_yn,
  });

  console.log(raw);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(
      `${host}/admin/community/review/update`,
      requestOptions
    );
    const { code, message } = await response.json();
    if (code === 200) {
      alert("수정되었습니다.");
      location.href = "/admin/customerReview_main";
    } else {
      alert(message || "에러가 발생했습니다.");
    }
  } catch (err) {
    alert("에러가 발생했습니다.");
    console.log("Err", err);
  }
};
