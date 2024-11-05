let fileId = [];
let originRegDateTime = null;
let selectDateTime = null;
const params = new URLSearchParams(window.location.search);
const id = params.get("gallery_id");
const fileInputElArr = document.getElementsByName("productImgArr[]");
const fileNameElArr = document.getElementsByClassName("file-name");
const cancelElArr = document.getElementsByClassName("cancel-btn");

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

  showContent();

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
  $("#category").change(function () {
    onChangeCategory($(this).val());
  });
});

const onClickCancleBtn = () => {
  if (confirm("수정을 취소하시겠습니까")) location.href = "/admin/gallery_main";
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

//컨텐츠 조회
const showContent = async () => {
  try {
    const response = await fetch(`${host}/gallery/select/` + id);
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

      console.log(res.type);

      const title = document.getElementById("title");
      const note = document.getElementById("note");
      const category = document.getElementById("category");
      const video_url = document.querySelector("#video_url");
      const regDate = document.querySelector("#start_date");
      const modDate = document.querySelector("#mod_date");
      const hour = document.getElementById("hour");
      const minute = document.getElementById("minute");
      const second = document.getElementById("second");

      var registerSubTitle = document.getElementById("register-sub-title");
      var imageForm = document.getElementById("imageForm");
      var videoForm = document.getElementById("videoForm");
      //카테고리 초기값
      category.selectedIndex = res.category;

      if (res.type == "사진") {
        registerSubTitle.innerText = "■ 이미지 등록";
        imageForm.style.display = "table"; // 이미지 폼 표시
        videoForm.style.display = "none"; // 동영상 폼 숨김
        document.querySelector(".radio_image").checked = true;
        document.querySelector(".radio_video").checked = false;
      } else if (res.type == "동영상") {
        registerSubTitle.innerText = "■ 동영상 등록";
        imageForm.style.display = "none"; // 이미지 폼 숨김
        videoForm.style.display = "table"; // 동영상 폼 표시
        document.querySelector(".radio_image").checked = false;
        document.querySelector(".radio_video").checked = true;
      }

      title.value = res.title;
      note.value = res.note;
      video_url.value = res.video_url;
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

      //onChangeCategory(res.gallery_category_name);
      let formattedDate = dayjs(res.mod_date).format("YYYY-MM-DD HH:mm:ss");

      modDate.textContent =
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
    alert("에러가 발생했습니다.");
    console.log("Err:", err);
  }
};

//파일 등록
const uploadFile = async (i) => {
  const file = fileInputElArr[i].files[0];
  if (file) {
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // 바이트를 메가바이트로 변환
    const maxSizeInMB = 3;
    if (fileSizeInMB > maxSizeInMB) {
      alert("파일 크기가 3MB를 초과하였습니다.");
      fileInputElArr[i].value = "";
      return;
    }
  }

  if (fileId[i] != null) {
    fileId[i] = null;
    //await deleteFile(fileId[i]);
  }

  fileButtonStyle(i);

  const formData = new FormData();
  formData.append("file", file);

  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
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
    //console.log('Err:', err);
  }
};

//컨텐츠 수정
const modContent = async () => {
  const title = document.getElementById("title").value;
  const note = document.getElementById("note").value;
  const category = document.getElementById("category");

  const video_url = document.getElementById("video_url").value;
  const exposure_yn = document.querySelector(
    'input[name="exposure_yn"]:checked'
  ).value;

  const type =
    document.querySelector('input[name="form"]:checked').value == 1
      ? "사진"
      : "동영상";
  console.log(type);

  const imageArray = [title, category.selectedIndex, fileId[0], selectDateTime];
  const videoArray = [title, category.selectedIndex, video_url, selectDateTime];

  if (!requireInput(type == "사진" ? imageArray : videoArray)) {
    return;
  }

  const raw = JSON.stringify({
    gallery_id: id,

    category: category.selectedIndex,
    title,
    note,
    type,
    video_url,

    file_main_id: fileId[0],
    file_1_id: fileId[1],
    file_2_id: fileId[2],
    file_3_id: fileId[3],
    file_4_id: fileId[4],

    reg_date: dayjs(selectDateTime).format("YYYY-MM-DD HH:mm:ss"),
    exposure_yn,
  });
  console.log(raw);

  const response = await fetch(`${host}/admin/gallery/update`, {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  });

  const { code, message, data } = await response.json();
  if (code === 200) {
    alert("수정되었습니다.");
    window.location.href = "/admin/gallery_main";

    return;
  }
  alert(message);
};

$(function () {
  $("#to_board_btn").on("click", onClickCancleBtn);
  $("#update_btn").on("click", modContent);
});
