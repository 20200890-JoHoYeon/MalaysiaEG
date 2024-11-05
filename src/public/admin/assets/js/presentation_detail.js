const params = new URLSearchParams(window.location.search);
const id = params.get("content_id");

$(document).ready(function () {
  findContent();

  $("#to_board_btn").click(onClickCancleBtn);
  $("#update_btn").click(onClickUpdateBtn);
  $("#send_btn").on("click", onClickSendBtn);
});

const onClickCancleBtn = () => {
  location.href = "/admin/presentation_main";
};

const onClickUpdateBtn = () => {
  location.href = `/admin/presentation_edit?content_id=${id}`;
};

//전송
let fileId = [];
const onClickSendBtn = async () => {
  const answerContent = document.querySelector("#answer_content");

  const result = window.confirm(
    "정말 업로드 하시겠습니까? 업로드 후에도 수정은 가능합니다."
  );
  if (result) {
    const raw = JSON.stringify({
      content_id: id,
      file_1_id: fileId[0] ? fileId[0] : null,
      file_2_id: fileId[1] ? fileId[1] : null,
      file_3_id: fileId[2] ? fileId[2] : null,
      file_4_id: fileId[3] ? fileId[3] : null,
      file_5_id: fileId[4] ? fileId[4] : null,
      answer_content: answerContent.value,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    try {
      const response = await fetch(
        `${host}community/uploadAnswer`,
        requestOptions
      );

      console.log(raw);
      const { code, message, data } = await response.json();
      if (code === 200) {
        alert("업로드가 완료되었습니다");
        location.href = `/admin/presentation_detail?content_id=${id}`;
      }
    } catch (err) {
      console.log("Err:", err);
    }
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
      if (res.admin_state == "d") {
        document.querySelector("#send_btn").style.display = "none";
      }
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
        fileId[0] = files[0].file_id;
      }
      if (files[1]) {
        file_1_id_url.src = `${URL}/uploads/${files[1].change_name}`;
        fileId[1] = files[1].file_id;
      }
      if (files[2]) {
        file_2_id_url.src = `${URL}/uploads/${files[2].change_name}`;
        fileId[2] = files[2].file_id;
      }
      if (files[3]) {
        file_3_id_url.src = `${URL}/uploads/${files[3].change_name}`;
        fileId[3] = files[3].file_id;
      }
      if (files[4]) {
        file_4_id_url.src = `${URL}/uploads/${files[4].change_name}`;
        fileId[4] = files[4].file_id;
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
    const answer_mod_date = document.querySelector("#answer_mod_date");

    answer_content.value = res.answer_content;
    answer_mod_date.value = res.mod_date
      ? dayjs(res.mod_date).format("YYYY-MM-DD HH:mm:ss")
      : "-";

    const aw_file = document.querySelector("#aw_file");
    const aw_file1 = document.querySelector("#aw_file1");
    const aw_file2 = document.querySelector("#aw_file2");
    const aw_file3 = document.querySelector("#aw_file3");
    const aw_file4 = document.querySelector("#aw_file4");

    if (files[0].change_name === null) {
      aw_file.innerHTML = "-";
    } else {
      aw_file.innerHTML = files[0].change_name;
    }

    if (files[1].change_name !== null) {
      aw_file1.classList.remove("hidden");
      aw_file1.innerHTML = files[1].change_name;
    }

    if (files[2].change_name !== null) {
      aw_file2.classList.remove("hidden");
      aw_file2.innerHTML = files[2].change_name;
    }

    if (files[3].change_name !== null) {
      aw_file3.classList.remove("hidden");
      aw_file3.innerHTML = files[3].change_name;
    }

    if (files[4].change_name !== null) {
      aw_file4.classList.remove("hidden");
      aw_file4.innerHTML = files[4].change_name;
    }
  } catch (err) {
    console.log("Err:", err);
  }
};
