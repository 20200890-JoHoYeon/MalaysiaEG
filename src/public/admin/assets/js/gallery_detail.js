const params = new URLSearchParams(window.location.search);
const id = params.get("gallery_id");

$(document).ready(function () {
  findContent();

  $("#to_board_btn").click(onClickCancleBtn);
  $("#update_btn").click(onClickUpdateBtn);
  $("#delete_btn").click(onClickDeleteBtn);
});

const onClickCancleBtn = () => {
  location.href = "/admin/gallery_main";
};

const onClickUpdateBtn = () => {
  location.href = `/admin/gallery_edit?gallery_id=${id}`;
};

//삭제
const onClickDeleteBtn = async () => {
  const raw = JSON.stringify({
    gallery_id: [id],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const result = window.confirm("삭제 하시겠습니까?");
  if (result) {
    try {
      const response = await fetch(
        `${host}/admin/gallery/delete`,
        requestOptions
      );
      const { code, message } = await response.json();
      if (code === 200) {
        window.location.href = "/admin/gallery_main";
      } else {
        alert(message || "에러가 발생했습니다.");
      }
    } catch (err) {
      alert("에러가 발생했습니다.");
      //console.log("Err", err);
    }
  }
};

//상세 조회
const findContent = async () => {
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

      const gallery_category_name = document.getElementById(
        "gallery_category_name"
      );
      const regDate = document.querySelector("#reg_date");
      const modDate = document.querySelector("#mod_date");
      const type = document.querySelector("#type");
      const file = document.querySelector("#file_main_url");
      const file1 = document.querySelector("#file_1_url");
      const file2 = document.querySelector("#file_2_url");
      const file3 = document.querySelector("#file_3_url");
      const file4 = document.querySelector("#file_4_url");
      const video_url = document.querySelector("#video_url");

      let registerSubTitle = document.getElementById("register-sub-title");
      let imageForm = document.getElementById("imageForm");
      let videoForm = document.getElementById("videoForm");

      if (res.type == "사진") {
        registerSubTitle.innerText = "■ 이미지 등록";
        imageForm.style.display = "table"; // 이미지 폼 표시
        videoForm.style.display = "none"; // 동영상 폼 숨김
      } else if (res.type == "동영상") {
        registerSubTitle.innerText = "■ 동영상 등록";
        imageForm.style.display = "none"; // 이미지 폼 숨김
        videoForm.style.display = "table"; // 동영상 폼 표시
      }

      if (res.exposure_yn === "Y") {
        document.querySelector(".exposure.y").checked = true;
      } else {
        document.querySelector(".exposure.n").checked = true;
      }

      title.value = res.title;
      note.value = res.note;
      type.value = res.type;
      video_url.value = res.video_url;
      console.log(video_url.value);

      gallery_category_name.value = categoryDecode(res.category);
      //onChangeCategory(res.category);

      regDate.textContent = dayjs(res.reg_date).format("YYYY-MM-DD HH:mm:ss");
      let formattedDate = dayjs(res.mod_date).format("YYYY-MM-DD HH:mm:ss");

      modDate.textContent =
        formattedDate == "Invalid Date" ? "-" : formattedDate;

      file.innerHTML = files[0] ? files[0].change_name : "";
      file1.innerHTML = files[1] ? files[1].change_name : "";
      file2.innerHTML = files[2] ? files[2].change_name : "";
      file3.innerHTML = files[3] ? files[3].change_name : "";
      file4.innerHTML = files[4] ? files[4].change_name : "";
    }
  } catch (err) {
    //console.log("Err:", err);
  }
};

// //삭제
// const onClickDeleteBtn = async () => {
//   const result = window.confirm("삭제 하시겠습니까?");
//   if (result) {
//     alert("수정되었습니다.");
//     location.href = "../gallery_main.html";
//   }
// };
// 관리자 갤러리 페이지 등록 형식 영역
