const params = new URLSearchParams(window.location.search);
const type = params.get("type");

// 현재 날짜와 시간
let now = new Date();
let dateElement = document.querySelectorAll(".community-write-date");
dateElement.forEach((element) => {
  element.textContent = formatFullDate(now);
});

// const fileInput = document.querySelectorAll(".uploadPic");
// const fileInputElArr = Array.from(fileInput);
let fileId = [];

// 이미지 업로드 API
let uploadFile = (input, i) => {
  const file = input.files[0];

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
    deleteFile(fileId[i]);
    fileId[i] = null;
  }

  const formData = new FormData();
  formData.append("file", file);

  FETCH.post(`/upload`, formData, ({ message, code, data }) => {
    if (code === 200) {
      fileId[i] = data.file_id;
    } else {
      alert(message || "파일등록 오류");
    }
  });
};

const qnaForm = document.forms.qnaForm;
const presentationForm = document.forms.presentationForm;
const qnaFileInput = qnaForm.querySelectorAll(".uploadPic");
const presentationFileInput = presentationForm.querySelectorAll(".uploadPic");

const fileChange = (fileInputArray) => {
  fileInputArray.forEach((input, index) => {
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        uploadFile(input, index);
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement("img");
          img.src = event.target.result;

          const closeButtonHTML =
            '<button class="file-close-btn"><i class="ico close white"></i></button>';

          const label = input.nextElementSibling;
          label.innerHTML = "";
          label.appendChild(img);

          label.insertAdjacentHTML("beforeend", closeButtonHTML);

          const closeButton = label.querySelector("button");

          closeButton.addEventListener("click", (event) => {
            event.preventDefault();
            img.remove();
            closeButton.remove();
            input.value = "";
            label.classList.remove("check-img-bg");

            if (fileId[index] != null) {
              deleteFile(fileId[index]);
              fileId[index] = null;
            }
          });

          label.classList.add("check-img-bg");
        };
        reader.readAsDataURL(file);
      }
    });
  });
};

fileChange(qnaFileInput);
fileChange(presentationFileInput);

const communityPostApi = (reqData) => {
  FETCH.post(`/community/${type}`, reqData, (data) => {
    console.log(data);
    alert("등록이 완료되었습니다.");
    location.href = `/community?type=${type}`;
  });
};
//유효성 검사
validationForm(qnaForm, "password", 6);
validationForm(qnaForm, "reg_user", 1);
validationForm(qnaForm, "title", 7);
validationForm(qnaForm, "content", 7);

validationForm(presentationForm, "password", 6);
validationForm(presentationForm, "presentation_org_name", 7);
validationForm(presentationForm, "presentation_place", 7);
validationForm(presentationForm, "presentation_hope_date", 5);
validationForm(presentationForm, "email_user", 3);
validationForm(presentationForm, "email_domain", 4);
validationForm(presentationForm, "title", 7);
validationForm(presentationForm, "content", 7);

// 묻고답하기 작성
qnaForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let ctgId = qnaForm.querySelector("[name=category_id]").value;
  let password = qnaForm.querySelector("[name=password]").value;
  let reg_user = qnaForm.querySelector("[name=reg_user]").value;
  let title = qnaForm.querySelector("[name=title]").value;
  let content = qnaForm.querySelector("[name=content]").value;

  let formattedText = content.replace(/\n/g, "\r\n");
  console.log(content);
  console.log(formattedText);

  if (password === "") {
    alert("비밀번호를 입력해주세요.");
    return false;
  } else if (reg_user === "") {
    alert("작성자를 입력해주세요.");
    return false;
  } else if (title === "") {
    alert("제목을 입력해주세요.");
    return false;
  } else if (content === "") {
    alert("내용을 입력해주세요.");
    return false;
  }

  let req = {
    category_id: parseInt(ctgId, 10),
    password: password,
    reg_user: reg_user,
    title: title,
    content: formattedText,
    file: [],
  };

  console.log(req);

  if (fileId && fileId.length > 0) {
    req.file = fileId;
  }

  communityPostApi(req);
});

// 설명회 요청 작성
presentationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let ctgId = presentationForm.querySelector("[name=category_id]").value;
  let password = presentationForm.querySelector("[name=password]").value;
  let presentationName = presentationForm.querySelector(
    "[name=presentation_org_name]"
  ).value;
  let presentationplace = presentationForm.querySelector(
    "[name=presentation_place]"
  ).value;
  let presentationHopeDate = presentationForm.querySelector(
    "[name=presentation_hope_date]"
  ).value;
  let emailUser = presentationForm.querySelector("[name=email_user]").value;
  let emailDomain = presentationForm.querySelector("[name=email_domain]").value;
  let title = presentationForm.querySelector("[name=title]").value;
  let content = presentationForm.querySelector("[name=content]").value;

  if (password === "") {
    alert("비밀번호를 입력해주세요.");
    return false;
  } else if (presentationName === "") {
    alert("기관명을 입력해주세요.");
    return false;
  } else if (presentationplace === "") {
    alert("장소를 입력해주세요.");
    return false;
  } else if (presentationHopeDate === "") {
    alert("희망날짜를 입력해주세요.");
    return false;
  } else if (emailUser === "" || emailDomain === "") {
    alert("이메일을 입력해주세요.");
    return false;
  } else if (!emailDomain.includes(".")) {
    alert("이메일 형식을 확인해주세요.");
    return false;
  } else if (title === "") {
    alert("제목을 입력해주세요.");
    return false;
  } else if (content === "") {
    alert("내용을 입력해주세요.");
    return false;
  }

  let req = {
    category_id: parseInt(ctgId, 10),
    password: password,
    presentation_org_name: presentationName,
    presentation_place: presentationplace,
    presentation_hope_date: presentationHopeDate,
    presentation_email: emailUser + "@" + emailDomain,
    title: title,
    content: content,
    file: [],
  };

  console.log(req);

  if (fileId && fileId.length > 0) {
    req.file = fileId;
  }

  communityPostApi(req);
});

const communityCancelBtn = document.querySelectorAll(".community-cancel");
communityCancelBtn.forEach((element) => {
  element.addEventListener("click", () => {
    if (confirm("작성을 취소하시겠습니까?")) {
      location.href = `/community?type=${type}`;
    }
  });
});
