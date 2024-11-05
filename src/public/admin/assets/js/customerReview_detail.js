const onClickCancleBtn = () => {
  location.href = "/admin/customerReview_main";
};

const onClickUpdateBtn = () => {
  location.href = `/admin/customerReview_edit?content_id=${id}`;
};

const params = new URLSearchParams(window.location.search);
const id = params.get("content_id");
const url = "http://14.63.220.194:3080";
//const url = "http://localhost:3000";

//삭제
const onClickDeleteBtn = async () => {
  const requestOptions = {
    method: "DELETE",
  };

  const result = window.confirm("삭제 하시겠습니까?");
  if (result) {
    //console.log(`${url}/community/${id}`);
    try {
      const response = await fetch(
        `${host}community/review/${id}`,
        requestOptions
      );
      const { code, message, data } = await response.json();
      console.log(response);
      if (code === 200) {
        window.location.href = "/admin/customerReview_main";
      } else {
        alert(message || "에러가 발생했습니다.");
      }
    } catch (err) {
      alert("에러가 발생했습니다.");
      console.log("Err", err);
    }
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

      const exposure_yn = document.querySelector("#form-filter");
      const review_link = document.querySelector("#review_link");
      const reg_user = document.querySelector("#reg_user");
      const title = document.querySelector("#title");
      const reg_date = document.querySelector("#reqanswer-reg_date");
      const content = document.querySelector("#reqanswer-content");
      const fileList = document.querySelector("#reqanswer-fileList");
      const aw_file1 = document.querySelector("#aw_file1");
      const aw_file2 = document.querySelector("#aw_file2");
      const aw_file3 = document.querySelector("#aw_file3");
      const aw_file4 = document.querySelector("#aw_file4");
      const aw_file5 = document.querySelector("#aw_file5");

      if (res.exposure_yn === "Y") {
        exposure_yn.value = "Y";
      } else {
        exposure_yn.value = "N";
      }
      reg_date.value = dayjs(res.reg_date).format("YYYY-MM-DD HH:mm:ss");
      reg_user.value = res.reg_user;
      content.innerHTML = res.content ? res.content : "-";
      title.value = res.title;
      review_link.value = res.review_link;
      console.log(review_link.value);

      if (files[0].change_name !== null) {
        aw_file1.innerHTML = files[0].change_name;
      }

      if (files[1].change_name !== null) {
        aw_file2.classList.remove("hidden");
        aw_file2.innerHTML = files[1].change_name;
      }

      if (files[2].change_name !== null) {
        aw_file3.classList.remove("hidden");
        aw_file3.innerHTML = files[2].change_name;
      }

      if (files[3].change_name !== null) {
        aw_file4.classList.remove("hidden");
        aw_file4.innerHTML = files[3].change_name;
      }

      if (files[4].change_name !== null) {
        aw_file5.classList.remove("hidden");
        aw_file5.innerHTML = files[4].change_name;
      }
    }
  } catch (err) {
    //console.log("Err:", err);
  }
};
$("#to_board_btn").click(onClickCancleBtn);
$("#update_btn").click(onClickUpdateBtn);
$("#delete_btn").click(onClickDeleteBtn);
findContent();
