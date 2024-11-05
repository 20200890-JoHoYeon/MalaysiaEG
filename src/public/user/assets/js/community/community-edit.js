let fileId = [];
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const categoryId = params.get("category_id");
// const answerYN = params.get("answer_YN");

let communityType;

if (categoryId) {
  switch (categoryId) {
    case "1":
      communityType = "qna";
      break;
    case "2":
      communityType = "presentation";
      break;
    default:
      console.error("Unknown categoryID:", categoryId);
  }
}

let communityDetailData = [];

let communityAnswerData = [];
let communityAnswerFileData = [];

// 상세조회 API
const communityDetailGet = () => {
  FETCH.get(`/community/${communityType}/${id}`, ({ data }) => {
    communityDetailData = data;
    console.log(data);
    communityDetailHtml();
  });
};

// 상세 수정 API
const communityPutApi = (reqData) => {
  FETCH.put(`/community/${communityType}`, reqData, (data) => {
    console.log(data);
    alert("수정이 완료되었습니다.");
    location.href = `/community_write_complete?id=${id}&category_id=${categoryId}`;
  });
};

communityDetailGet();

const communityDetailHtml = () => {
  const communityDetail = document.querySelector(`div[data-type="qna"]`);
  const presentationDetail = document.querySelector(
    `div[data-type="presentation"]`
  );

  const fileData = communityDetailData.file;
  const communityData = communityDetailData.response;

  if (categoryId === "1") {
    communityDetail.style.display = "block";

    let regDate = communityDetail.querySelector(".community-write-date");
    let regName = communityDetail.querySelector("input[name=reg_user]");
    let title = communityDetail.querySelector("input[name=title]");
    let content = communityDetail.querySelector("textarea[name=content]");

    regDate.textContent = formatShortDate(communityData.reg_date);
    content.value = communityData.content;
    title.value = communityData.title;
    regName.value = communityData.reg_user;

    const imageContainer = communityDetail.querySelector(".picUpload-list");
    // 이미지 조회
    showImages(fileData, imageContainer, "uploadPic");
  } else if (categoryId === "2") {
    presentationDetail.style.display = "block";

    let regDate = presentationDetail.querySelector(".community-write-date");
    let title = presentationDetail.querySelector("input[name=title]");
    let content = presentationDetail.querySelector("textarea[name=content]");
    let name = presentationDetail.querySelector(
      "input[name=presentation_org_name]"
    );
    let place = presentationDetail.querySelector(
      "input[name=presentation_place]"
    );
    let hopeDate = presentationDetail.querySelector(
      "input[name=presentation_hope_date]"
    );
    let emailUser = presentationDetail.querySelector("input[name=email_user]");
    let emailDomain = presentationDetail.querySelector(
      "input[name=email_domain]"
    );

    regDate.textContent = formatShortDate(communityData.reg_date);
    content.value = communityData.content;
    title.value = communityData.title;
    name.value = communityData.presentation_org_name;
    place.value = communityData.presentation_place;
    hopeDate.value = formatDate(communityData.presentation_hope_date);

    const emailFull = communityData.presentation_email1;
    const emailSplit = emailFull.split("@");
    emailUser.value = emailSplit[0];
    emailDomain.value = emailSplit[1];

    const imageContainer = presentationDetail.querySelector(".picUpload-list");
    showImages(fileData, imageContainer, "p_uploadPic");
  }
};

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
              fileId[index] = null;
              //deleteFile(fileId[index]);
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

/**
 *
 * @param {fileData} fileData
 * @param {부모 class} container
 * @param {id명} idPrefix
 */
const showImages = (fileData, container, idPrefix) => {
  fileData.forEach((data, index) => {
    console.log("data", data);
    console.log("index", index);
    fileId[index] = data.file_id;
    let input = container.querySelector(`#${idPrefix}_${index + 1}`);
    console.log(input);
    let label = input.nextElementSibling;
    let img = document.createElement("img");
    img.src = `../uploads/${data.change_name}`;
    label.innerHTML = "";
    label.appendChild(img);
    let closeButtonHTML =
      '<button class="file-close-btn"><i class="ico close white"></i></button>';
    label.insertAdjacentHTML("beforeend", closeButtonHTML);
    let closeButton = label.querySelector("button");
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      img.remove();
      closeButton.remove();
      input.value = "";
      label.classList.remove("check-img-bg");
      if (fileId[index] != null) {
        fileId[index] = null;
        //deleteFile(fileId[index]);
      }
    });
    label.classList.add("check-img-bg");
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

// 묻고답하기 요청 작성
qnaForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //let ctgId = qnaForm.querySelector("[name=category_id]").value;
  let password = qnaForm.querySelector("[name=password]").value;
  let reg_user = qnaForm.querySelector("[name=reg_user]").value;
  let title = qnaForm.querySelector("[name=title]").value;
  let content = qnaForm.querySelector("[name=content]").value;
  let file = [];
  let req = {
    content_id: parseInt(id, 10),
    password: password,
    reg_user: reg_user,
    title: title,
    content: content,
    file: file,
  };

  for (let i = 0; i < 5; i++) {
    file[i] = fileId[i] ? fileId[i] : null;
  }
  console.log(file);

  console.log("req", req);

  console.log("fileId", fileId);

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

  communityPutApi(req);
});

// 설명회 요청 작성
presentationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let password = presentationForm.querySelector("[name=password]").value;
  let presentationName = presentationForm.querySelector(
    "[name=presentation_org_name]"
  ).value;
  let presentationPlace = presentationForm.querySelector(
    "[name=presentation_place]"
  ).value;
  let presentationHopeDate = presentationForm.querySelector(
    "[name=presentation_hope_date]"
  ).value;
  let emailUser = presentationForm.querySelector("[name=email_user]").value;
  let emailDomain = presentationForm.querySelector("[name=email_domain]").value;
  let title = presentationForm.querySelector("[name=title]").value;
  let content = presentationForm.querySelector("[name=content]").value;

  let req = {
    content_id: parseInt(id, 10),
    password: password,
    presentation_org_name: presentationName,
    presentation_place: presentationPlace,
    presentation_hope_date: presentationHopeDate,
    presentation_email1: emailUser + "@" + emailDomain,
    title: title,
    content: content,
    file: fileId,
  };

  console.log("req", req);

  console.log("fileId", fileId);

  if (password === "") {
    alert("비밀번호를 입력해주세요.");
    return false;
  } else if (presentationName === "") {
    alert("기관명을 입력해주세요.");
    return false;
  } else if (presentationPlace === "") {
    alert("장로를 입력해주세요.");
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

  communityPutApi(req);
});

const communityCancelBtn = document.querySelectorAll(".community-cancel");
communityCancelBtn.forEach((element) => {
  element.addEventListener("click", () => {
    if (confirm("작성을 취소하시겠습니까?")) {
      location.href = `/community?type=${communityType}`;
    }
  });
});
