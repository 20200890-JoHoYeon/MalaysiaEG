let fileId = [];
const params = new URLSearchParams(window.location.search);
const id = params.get("offer_id");
const fileInputElArr = document.getElementsByName("productImgArr[]");
const fileNameElArr = document.getElementsByClassName("file-name");
const cancelElArr = document.getElementsByClassName("cancel-btn");

$(document).ready(function () {
  findContent();

  $("#to_board_btn").on("click", onClickCancleBtn);
  $("#register_btn").on("click", onClickRegisterBtn);
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
});
const onClickCancleBtn = () => {
  const result = window.confirm("등록을 취소하시겠습니까?");
  if (result) {
    location.href = "/admin/estimate_main";
  }
};

//등록
const onClickRegisterBtn = async (e) => {
  const answertextArea = document.querySelector(".answer-text-area").value;

  if (!regexDetailTen.test(answertextArea)) {
    alert("내용을 입력해주시기 바랍니다.");
    return false;
  }
  const raw = JSON.stringify({
    offer_id: id,
    answer_content: answertextArea,
    file_1_id: fileId[0] ? fileId[0] : null,
    file_2_id: fileId[1] ? fileId[1] : null,
    file_3_id: fileId[2] ? fileId[2] : null,
    file_4_id: fileId[3] ? fileId[3] : null,
    file_5_id: fileId[4] ? fileId[4] : null,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(`${host}offer/insertAnswer`, requestOptions);

    console.log(raw);
    const { code, message, data } = await response.json();
    if (code === 200) {
      alert("등록이 완료되었습니다.");
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
    await deleteFile(fileId[i]);
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

//컨텐츠 등록
const registerContent = async (e) => {
  const answer_content = document.getElementById(
    "reqanswer-answer_content"
  ).value;

  if (!requireInput(answer_content)) {
    return;
  }
  if (!regexNote.test(answer_content)) {
    alert("비고는 국/영문, 숫자, 특수문자 최대 300자까지만 입력 가능합니다.");
    return false;
  }

  const raw = JSON.stringify({
    offer_id,
    file_1_id: fileId[0],
    file_2_id: fileId[1],
    file_3_id: fileId[2],
    file_4_id: fileId[3],
    file_5_id: fileId[4],
    answer_content,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(
      `${host}/admin/offer/insertAnswer`,
      requestOptions
    );
    const { code, message } = await response.json();
    if (code === 200) {
      alert("등록이 완료되었습니다.");
      window.location.href = "/admin/estimate_main";
    } else {
      alert(message || "에러가 발생했습니다.");
    }
  } catch (err) {
    alert("에러가 발생했습니다.");
    console.log("Err", err);
  }
};
