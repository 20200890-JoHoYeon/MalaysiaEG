let fileId = [];
const fileNameElArr = document.getElementsByClassName("file-name");
const cancelElArr = document.getElementsByClassName("cancel-btn");
const fileInputElArr = document.getElementsByName("productImgArr[]");
let now = dayjs();
let selectDateTime = now.format("YYYY-MM-DD HH:mm:ss");

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

  $("#dataTable").DataTable();

  for (let i = 0; i < cancelElArr.length; i++) {
    fileInputElArr[i].addEventListener("change", function () {
      uploadFile(i);
    });
    $(cancelElArr[i]).click(function () {
      fileInputElArr[i].value = "";
      fileNameElArr[i].textContent = "";
      cancelElArr[i].style.display = "none";
      fileId[i] = null;
      deleteFile(fileId[i]);
    });
  }

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

  $("#start_date").val(now.format("YYYY-MM-DD"));
  $("#hour").val(now.format("HH"));
  $("#minute").val(now.format("mm"));
  $("#second").val(now.format("ss"));

  // 'hour', 'minute', 'second'에 현재 시간보다 미래의 시간이 선택되면 alert 창으로 경고
  $("#start_date, #hour, #minute, #second").change(function () {
    const selectDate = $("#start_date").val();
    const selectHour = $("#hour").val();
    const selectMinute = $("#minute").val();
    const selectSecond = $("#second").val();
    selectDateTime = dayjs(
      selectDate + " " + selectHour + ":" + selectMinute + ":" + selectSecond
    );
    now = dayjs();
    if (selectDateTime.isAfter(now)) {
      alert("현재 시간 이후로는 선택이 불가능합니다");
      $("#start_date").val(now.format("YYYY-MM-DD"));
      $("#hour").val(now.format("HH"));
      $("#minute").val(now.format("mm"));
      $("#second").val(now.format("ss"));
      selectDateTime = now.format("YYYY-MM-DD HH:mm:ss");
    }
  });
  $("#start_date").blur(function () {
    $("#start_date").val(dayjs(selectDateTime).format("YYYY-MM-DD"));
  });
  $("#to_board_btn").click(onClickCancleBtn);
  $("#register_btn").click(registerContent);
  $("#category").change(function () {
    onChangeCategory($(this).val());
  });
});

const onClickCancleBtn = () => {
  if (confirm("등록을 취소하시겠습니까")) location.href = "/admin/gallery_main";
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
const registerContent = async (e) => {
  const handleEmptyValue = (value) => (value.trim() === "" ? null : value);
  const title = document.getElementById("title").value;
  const note = document.getElementById("note").value;
  const video_url = document.getElementById("video_url").value;
  const category = parseInt(document.getElementById("category").value);
  const categorySelect = document.getElementById("category");
  const selectedIndex = categorySelect.selectedIndex;
  const gallery_category_name = categorySelect.options[selectedIndex].text;
  const exposure_yn = document.querySelector(
    'input[name="exposure_yn"]:checked'
  ).value;
  const type =
    document.querySelector('input[name="form"]:checked').value == 1
      ? "사진"
      : "동영상";

  const imageArray = [title, category, fileId[0], selectDateTime];
  const videoArray = [title, category, video_url, selectDateTime];

  if (!requireInput(type == "사진" ? imageArray : videoArray)) {
    return;
  }
  const video_id = handleEmptyValue(video_url);
  if (!regexTitle.test(title)) {
    alert("제목은 국/영문, 숫자, 특수문자 최대 30자까지만 입력 가능합니다.");
    return false;
  }
  if (!regexNote.test(note)) {
    alert("비고는 국/영문, 숫자, 특수문자 최대 300자까지만 입력 가능합니다.");
    return false;
  }

  const raw = JSON.stringify({
    category,
    gallery_category_name,
    title,
    type: type,
    note,
    file_main_id: fileId[0],
    file_1_id: fileId[1],
    file_2_id: fileId[2],
    file_3_id: fileId[3],
    file_4_id: fileId[4],
    video_url: video_id,
    reg_date: dayjs(selectDateTime).format("YYYY-MM-DD HH:mm:ss"),
    exposure_yn,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(
      `${host}/admin/gallery/insert`,
      requestOptions
    );
    const { code, message } = await response.json();
    if (code === 200) {
      alert("등록이 완료되었습니다.");
      window.location.href = "/admin/gallery_main";
    } else {
      alert(message || "에러가 발생했습니다.");
    }
  } catch (err) {
    alert("에러가 발생했습니다.");
    //console.log("Err", err);
  }
};
