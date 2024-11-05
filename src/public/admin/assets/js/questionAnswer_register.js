let fileId = [];
const params = new URLSearchParams(window.location.search);
const id = params.get("content_id");
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
  const result = window.confirm("작성을 취소하시겠습니까?");
  if (result) {
    location.href = "/admin/questionAnswer_main";
  }
};

//등록
const onClickRegisterBtn = async (e) => {
  const answertextArea = document.querySelector(".answer-text-area").value;
  let formattedText = answertextArea.replace(/\n/g, "\r\n");
  console.log(answertextArea);
  console.log(formattedText);
  if (!regexDetailTen.test(formattedText)) {
    alert("답변을 입력해주시기 바랍니다.");
    return false;
  }

  const raw = JSON.stringify({
    content_id: id,
    file_1_id: fileId[0] ? fileId[0] : null,
    file_2_id: fileId[1] ? fileId[1] : null,
    file_3_id: fileId[2] ? fileId[2] : null,
    file_4_id: fileId[3] ? fileId[3] : null,
    file_5_id: fileId[4] ? fileId[4] : null,
    answer_content: formattedText,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  try {
    const response = await fetch(`community/saveAnswer`, requestOptions);

    console.log(raw);
    const { code, message, data } = await response.json();
    if (code === 200) {
      alert("등록이 완료되었습니다.");
      location.href = "/admin/questionAnswer_main";
    }
  } catch (err) {
    console.log("Err:", err);
  }
};

//상세 조회
const findContent = async () => {
  try {
    const response = await fetch(`${host}/community/qna/` + id);
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

      const reg_user = document.querySelector("#reqanswer-name");

      const reg_date = document.querySelector("#reqanswer-reg_date");

      const title = document.querySelector("#reqanswer-title");
      const content = document.querySelector("#reqanswer-content");

      const fileList = document.querySelector("#reqanswer-fileList");
      const file_main_id_url = document.querySelector("#file_main_id_url");
      const file_1_id_url = document.querySelector("#file_1_id_url");
      const file_2_id_url = document.querySelector("#file_2_id_url");
      const file_3_id_url = document.querySelector("#file_3_id_url");
      const file_4_id_url = document.querySelector("#file_4_id_url");

      reg_user.value = res.reg_user;
      content.innerHTML = res.content;
      title.value = res.title;
      reg_date.value = dayjs(res.reg_date).format("YYYY-MM-DD HH:mm:ss");

      if (files[0]) {
        fileList.classList.remove("hidden");
        file_main_id_url.src = `${URL}/uploads/${files[0].change_name}`;
        console.log(file_1_id_url);
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
