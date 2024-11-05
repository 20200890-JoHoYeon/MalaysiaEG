let fileId = [];
let answer_id = 0;
const params = new URLSearchParams(window.location.search);
const id = params.get("content_id");
const fileInputElArr = document.getElementsByName("productImgArr[]");
const fileNameElArr = document.getElementsByClassName("file-name");
const cancelElArr = document.getElementsByClassName("cancel-btn");

$(document).ready(function () {
  findContent();

  $("#to_board_btn").on("click", onClickCancleBtn);
  $("#register_btn").on("click", onClickUpdateBtn);

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
    location.href = "/admin/presentation_main";
  }
};

//수정
const onClickUpdateBtn = async (e) => {
  console.log(answer_id);
  const answertextArea = document.querySelector(".answer-text-area").value;

  if (!regexDetailTen.test(answertextArea)) {
    alert("답변을 입력해주시기 바랍니다.");
    return false;
  }

  const raw = JSON.stringify({
    content_id: id,
    answer_id: answer_id,
    answer_content: answertextArea,
    file_1_id: fileId[0] ? fileId[0] : null,
    file_2_id: fileId[1] ? fileId[1] : null,
    file_3_id: fileId[2] ? fileId[2] : null,
    file_4_id: fileId[3] ? fileId[3] : null,
    file_5_id: fileId[4] ? fileId[4] : null,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
  };
  try {
    const response = await fetch(`${host}/community/insert`, requestOptions);

    console.log(raw);
    const { code, message, data } = await response.json();
    if (code === 200) {
      alert("수정되었습니다.");
      location.href = "/admin/presentation_main";
    }
  } catch (err) {
    console.log("Err:", err);
  }
};

//상세 조회
const findContent = async () => {
  try {
    const response = await fetch(`${host}/community/presentation/` + id);
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
      console.log(res.state);
      // console.log(purposeDecode(res.state));
      if (res.state != "n") {
        await findAnswer();
      }

      const presentation_email = document.querySelector(
        "#reqanswer-presentation_email"
      );
      const presentation_place = document.querySelector(
        "#reqanswer-presentation_place"
      );
      const presentation_org_name = document.querySelector(
        "#reqanswer-presentation_org_name"
      );
      const presentation_hope_date = document.querySelector(
        "#reqanswer-presentation_hope_date"
      );

      const reg_date = document.querySelector("#reqanswer-reg_date");

      const title = document.querySelector("#reqanswer-title");
      const content = document.querySelector("#reqanswer-content");

      const fileList = document.querySelector("#reqanswer-fileList");
      const file_main_id_url = document.querySelector("#file_main_id_url");
      const file_1_id_url = document.querySelector("#file_1_id_url");
      const file_2_id_url = document.querySelector("#file_2_id_url");
      const file_3_id_url = document.querySelector("#file_3_id_url");
      const file_4_id_url = document.querySelector("#file_4_id_url");

      presentation_email.innerHTML = `${res.presentation_email1}`;
      presentation_place.innerHTML =
        res.presentation_place == null ? "-" : res.presentation_place;
      presentation_org_name.innerHTML =
        res.presentation_org_name == null ? "-" : res.presentation_org_name;
      presentation_hope_date.innerHTML = dayjs(
        res.presentation_hope_date == null ? "-" : res.presentation_hope_date
      ).format("YYYY-MM-DD");

      content.innerHTML = res.content;
      title.innerHTML = res.title;
      reg_date.innerHTML = dayjs(res.reg_date).format("YYYY-MM-DD HH:mm:ss");

      if (files[0]) {
        fileList.classList.remove("hidden");
        file_main_id_url.src = `${URL}/uploads/${files[0].change_name}`;
      }
      if (files[1]) {
        file_1_id_url.src = `${URL}/uploads/${files[1].change_name}`;
      }
      if (files[2]) {
        file_2_id_url.src = `${URL}/uploads/${files[2].change_name}`;
      }
      if (files[3]) {
        file_3_id_url.src = `${URL}/uploads/${files[3].change_name}`;
      }
      if (files[4]) {
        file_4_id_url.src = `${URL}/uploads/${files[4].change_name}`;
      }
    }
  } catch (err) {
    console.log("Err:", err);
  }
};

//답변 조회
const findAnswer = async () => {
  try {
    const response = await fetch(`${host}/community/answer/` + id);
    const { code, message, data } = await response.json();

    console.log(data);
    console.log(data.response);
    console.log(data.file);

    const res = data.response;
    const files = data.file;
    const answer_content = document.querySelector("#answer_content");

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
    //console.log('Err:', err);
  }
};
