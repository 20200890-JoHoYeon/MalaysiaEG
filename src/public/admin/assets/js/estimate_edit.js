let fileId = [];
let answer_id = 0;
const params = new URLSearchParams(window.location.search);
const id = params.get("offer_id");
const fileInputElArr = document.getElementsByName("productImgArr[]");
const fileNameElArr = document.getElementsByClassName("file-name");
const cancelElArr = document.getElementsByClassName("cancel-btn");

$(document).ready(function () {
  findContent();

  $("#to_board_btn").on("click", onClickCancleBtn);
  $("#update_btn").on("click", onClickUpdateBtn);

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
});

const onClickCancleBtn = () => {
  const result = window.confirm("수정을 취소하시겠습니까?");
  if (result) {
    location.href = "/admin/estimate_main";
  }
};

//수정
const onClickUpdateBtn = async () => {
  const answertextArea = document.querySelector(".answer-text-area").value;

  if (!regexDetailTen.test(answertextArea)) {
    alert("내용을 입력해주시기 바랍니다.");
    return false;
  }
  const raw = JSON.stringify({
    offer_id: id,
    answer_id: answer_id,
    answer_content: answertextArea,
    file: fileId,
    // file_1_id: fileId ? fileId : null,
    // file_2_id: fileId[1] ? fileId[1] : null,
    // file_3_id: fileId[2] ? fileId[2] : null,
    // file_4_id: fileId[3] ? fileId[3] : null,
    // file_5_id: fileId[4] ? fileId[4] : null,
  });
  console.log(fileId);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(`${host}offer/updateAnswer`, requestOptions);

    console.log(raw);
    const { code, message, data } = await response.json();
    if (code === 200) {
      alert("수정되었습니다.");
      location.href = "/admin/estimate_main";
    }
  } catch (err) {
    console.log("Err:", err);
  }
};

//상세 조회
const findContent = async () => {
  try {
    const response = await fetch(`${host}offer/select/` + id);
    const { code, message, data } = await response.json();
    if (code === 200) {
      if (!data) {
        return;
      }
      console.log(data);
      console.log(purposeDecode(data.admin_state));
      if (data.admin_state != "n") {
        await findAnswer();
      }

      const hope_camp_name = document.getElementById(
        "reqanswer-hope_camp_name"
      );
      const attend_type = document.getElementById("reqanswer-attend_type");
      const attend_period = document.getElementById("reqanswer-attend_period");
      const student1_age_group = document.getElementById(
        "reqanswer-student1_age_group"
      );
      const student2_age_group = document.getElementById(
        "reqanswer-student2_age_group"
      );
      const student1_hotel_yn = document.getElementById(
        "reqanswer-student1_hotel_yn"
      );
      const student2_hotel_yn = document.getElementById(
        "reqanswer-student2_hotel_yn"
      );
      const etc = document.getElementById("reqanswer-etc");
      const etc2 = document.getElementById("reqanswer-etc2");
      const price_total = document.getElementById("reqanswer-price_total");

      const parent_name = document.getElementById("reqanswer-parent_name");
      const student1_name = document.getElementById("reqanswer-student1_name");
      const student2_name = document.getElementById("reqanswer-student2_name");
      const student1_sex = document.getElementById("reqanswer-student1_sex");
      const student2_sex = document.getElementById("reqanswer-student2_sex");
      const addr = document.getElementById("reqanswer-addr");
      const tel = document.getElementById("reqanswer-tel");
      const email = document.getElementById("reqanswer-email");
      const agree_YN = document.getElementById("reqanswer-agree_YN");
      const remarks = document.getElementById("reqanswer-remarks");
      const etcBar = document.getElementById("etcBar");

      hope_camp_name.innerHTML = data.hope_camp_name;
      attend_type.innerHTML = data.attend_type;
      attend_period.innerHTML = data.attend_period;
      student1_age_group.innerHTML =
        data.student1_age_group + " " + data.student1_grade;

      student2_age_group.innerHTML =
        (data.student2_age_group == "선택" ? "-" : data.student2_age_group) +
        " " +
        (data.student2_grade == "선택" ? "" : data.student2_grade);
      student1_hotel_yn.innerHTML = data.sudent1_hotel_yn;
      student2_hotel_yn.innerHTML = data.student2_name
        ? data.student2_hotel_yn
        : "-";

      etc.innerHTML = data.etc ? data.etc : "";
      etc2.innerHTML = data.etc2 ? data.etc2 : "";

      if (etc.innerHTML == "" && etc2.innerHTML == "") {
        etc.innerHTML = "-";
      }

      if (etc.innerHTML != "" && etc2.innerHTML != "") {
        etcBar.innerHTML = "| ";
      }

      price_total.innerHTML = `${data.price_total
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`;

      parent_name.innerHTML = data.parent_name;
      student1_name.innerHTML = data.student1_name;
      student2_name.innerHTML = data.student2_name ? data.student2_name : "-";
      student1_sex.innerHTML = data.student1_sex;
      student2_sex.innerHTML = data.student2_name ? data.student2_sex : "-";
      addr.innerHTML = data.addr;
      tel.innerHTML = data.tel;
      email.innerHTML = data.email;
      agree_YN.innerHTML = data.agree_YN == "Y" ? "동의" : "미동의";
      remarks.innerHTML = data.remarks ? data.remarks : "-";
    }
  } catch (err) {
    console.log("Err:", err);
  }
};

//답변 조회
const findAnswer = async () => {
  try {
    const response = await fetch(`${host}/offer/answer/` + id);
    const { code, message, data } = await response.json();

    console.log(data);
    console.log(data.response);
    console.log(data.file);

    const res = data.response;
    const files = data.file;
    const answer_content = document.querySelector("#reqanswer-answer");

    answer_content.value = res.answer_content;

    answer_id = res.answer_id;

    for (let i = 0; i <= 4; i++) {
      if (files[i]) {
        fileId[i] = files[i].file_id;
      }
      console.log("파일아이디", fileId[i]);
    }

    const filesName = [
      files[0] ? files[0].change_name : null,
      files[1] ? files[1].change_name : null,
      files[2] ? files[2].change_name : null,
      files[3] ? files[3].change_name : null,
      files[4] ? files[4].change_name : null,
    ];
    console.log("dddddddddddddddddd", filesName);
    filesName.forEach((name, i) => {
      console.log(name);
      if (!(name == null)) {
        fileNameElArr[i].textContent = name;
        fileNameElArr[i].style.display = "inline";
        cancelElArr[i].style.display = "inline-block";
      }
    });
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
    console.log("Err:", err);
  }
};
