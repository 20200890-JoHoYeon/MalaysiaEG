const params = new URLSearchParams(window.location.search);
const id = params.get("offer_id");

$(document).ready(function () {
  findContent();

  $("#to_board_btn").click(onClickCancleBtn);
  $("#update_btn").click(onClickUpdateBtn);
  $("#send_btn").on("click", onClickSendBtn);
});

const onClickCancleBtn = () => {
  location.href = "/admin/estimate_main";
};

const onClickUpdateBtn = () => {
  location.href = `/admin/estimate_edit?offer_id=${id}`;
};

//컨텐츠 전송
let fileId = [];
const onClickSendBtn = async () => {
  const answer_content = document.getElementById(
    "reqanswer-answer_content"
  ).value;

  const result = window.confirm("정말 전송하시겠습니까?");
  if (result) {
    const raw = JSON.stringify({
      offer_id: id,
      file_1_id: fileId[0] ? fileId[0] : null,
      file_2_id: fileId[1] ? fileId[1] : null,
      file_3_id: fileId[2] ? fileId[2] : null,
      file_4_id: fileId[3] ? fileId[3] : null,
      file_5_id: fileId[4] ? fileId[4] : null,
      answer_content,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    try {
      const response = await fetch(`${host}offer/sendAnswer`, requestOptions);
      const { code, message } = await response.json();
      if (code === 200) {
        alert("전송이 완료되었습니다.");
        window.location.href = `/admin/estimate_detail?offer_id=${id}`;
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
      if (data.admin_state == "s") {
        document.querySelector("#send_btn").style.display = "none";
        document.querySelector("#update_btn").style.display = "none";
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
      const etcBar = document.getElementById("etcBar");
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
    const answer_content = document.querySelector("#reqanswer-answer_content");

    answer_content.innerHTML = res.answer_content;

    const aw_file1 = document.querySelector("#aw_file1");
    const aw_file2 = document.querySelector("#aw_file2");
    const aw_file3 = document.querySelector("#aw_file3");
    const aw_file4 = document.querySelector("#aw_file4");
    const aw_file5 = document.querySelector("#aw_file5");

    if (files[0].change_name !== "") {
      aw_file1.innerHTML = files[0].change_name;
    }

    if (files[1].change_name !== "") {
      aw_file2.classList.remove("hidden");
      aw_file2.innerHTML = files[1].change_name;
    }

    if (files[2].change_name !== "") {
      aw_file3.classList.remove("hidden");
      aw_file3.innerHTML = files[2].change_name;
    }

    if (files[3].change_name !== "") {
      aw_file4.classList.remove("hidden");
      aw_file4.innerHTML = files[3].change_name;
    }

    if (files[4].change_name !== "") {
      aw_file5.classList.remove("hidden");
      aw_file5.innerHTML = files[4].change_name;
    }
    if (code === 200) {
      if (!data) {
        return;
      }
    }
  } catch (err) {
    console.log("Err:", err);
  }
};
