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
    case "3":
      communityType = "review";
      break;
    default:
      console.error("Unknown categoryID:", categoryId);
  }
}

let communityDetailData = [];

let communityAnswerData = [];
let communityAnswerFileData = [];

//게시글 삭제 API
const communityDelete = () => {
  FETCH.delete(`/community/${id}`, (data) => {
    console.log(data);
    location.href = `/community?type=${communityType}`;
  });
};

//답변조회 API
const communityAnswerGet = (parentClass) => {
  FETCH.get(`/community/answer/${id}`, ({ data }) => {
    console.log(parentClass);
    answerHtml(data, parentClass);
  });
};

// 상세조회 API
const communityDetailGet = () => {
  FETCH.get(`/community/${communityType}/${id}`, ({ data }) => {
    communityDetailData = data;
    console.log(data);
    communityDetailHtml();
  });
};

communityDetailGet();

const communityDetailHtml = () => {
  const communityDetail = document.querySelector(`div[data-type="community"]`);
  const presentationDetail = document.querySelector(
    `div[data-type="presentation"]`
  );
  const reviewDetail = document.querySelector(`div[data-type="review"]`);

  const fileData = communityDetailData.file;
  const communityData = communityDetailData.response;

  if (categoryId === "1") {
    communityDetail.style.display = "block";

    let regDate = communityDetail.querySelector(".reg-date");
    let regName = communityDetail.querySelector(".reg-name");
    let title = communityDetail.querySelector(".title");
    let content = communityDetail.querySelector(".content");

    //답변이 있을 경우
    if (communityData.state === "d") {
      const answerArea = communityDetail.querySelector(".answer-area");
      const editModeArea = communityDetail.querySelector(".edit-mode-btn-area");

      if (answerArea && editModeArea) {
        answerArea.style.display = "block";
        editModeArea.style.display = "none";
      }

      communityAnswerGet(communityDetail);
    }

    regDate.textContent = formatFullDate(communityData.reg_date);
    regName.textContent = communityData.reg_user;
    title.textContent = communityData.title;

    const textarea = document.createElement("textarea");
    textarea.style.height = "200px";
    textarea.style.border = "none";
    textarea.style.width = "100%";
    textarea.disabled;
    textarea.value = communityData.content;
    content.appendChild(textarea);
    const divTag = document.createElement("div");
    divTag.classList.add("community-detail-content-img-area");

    fileData.forEach((fileData) => {
      const imgTag = document.createElement("img");
      imgTag.src = `../uploads/${fileData.change_name}`;

      divTag.appendChild(imgTag);
      content.appendChild(divTag);
    });
  } else if (categoryId === "2") {
    presentationDetail.style.display = "block";

    let regDate = presentationDetail.querySelector(".reg-date");
    let presentationName = presentationDetail.querySelector(
      ".presentation-org-name"
    );
    let presentationPlace = presentationDetail.querySelector(
      ".presentation-place"
    );
    let presentationHopeDate = presentationDetail.querySelector(
      ".presentation-hope-date"
    );
    let email = presentationDetail.querySelector(".email");
    let title = presentationDetail.querySelector(".title");
    let content = presentationDetail.querySelector(".content");
    console.log("222");
    //답변이 있을 경우
    if (communityData.state === "d") {
      console.log("ddd");
      const answerArea = presentationDetail.querySelector(".answer-area");
      const editModeArea = presentationDetail.querySelector(
        ".edit-mode-btn-area"
      );

      if (answerArea && editModeArea) {
        answerArea.style.display = "block";
        editModeArea.style.display = "none";
      }

      communityAnswerGet(presentationDetail);
    }

    regDate.textContent = formatFullDate(communityData.reg_date);
    presentationName.textContent = communityData.presentation_org_name;
    presentationPlace.textContent = communityData.presentation_place;
    presentationHopeDate.textContent = formatDate(
      communityData.presentation_hope_date
    );
    email.textContent = communityData.presentation_email1;
    title.textContent = communityData.title;

    const textarea = document.createElement("textarea");
    textarea.style.height = "200px";
    textarea.style.border = "none";
    textarea.style.width = "100%";
    textarea.disabled;
    textarea.value = communityData.content;
    content.appendChild(textarea);
    const divTag = document.createElement("div");
    divTag.classList.add("community-detail-content-img-area");

    fileData.forEach((fileData) => {
      const imgTag = document.createElement("img");
      imgTag.src = `../uploads/${fileData.change_name}`;

      divTag.appendChild(imgTag);
      content.appendChild(divTag);
    });
  } else if (categoryId === "3") {
    reviewDetail.style.display = "block";

    let regDate = reviewDetail.querySelector(".reg-date");
    let regName = reviewDetail.querySelector(".reg-name");
    let title = reviewDetail.querySelector(".title");
    let link = reviewDetail.querySelector(".review-link");
    let content = reviewDetail.querySelector(".content");

    regDate.textContent = formatFullDate(communityData.reg_date);
    regName.textContent = communityData.reg_user;
    title.textContent = communityData.title;
    link.textContent = communityData.review_link;
    link.setAttribute("href", communityData.review_link);

    const textarea = document.createElement("textarea");
    textarea.style.height = "200px";
    textarea.style.border = "none";
    textarea.style.width = "100%";
    textarea.disabled;
    textarea.value = communityData.content;
    content.appendChild(textarea);

    const divTag = document.createElement("div");
    divTag.classList.add("community-detail-content-img-area");
    fileData.forEach((fileData) => {
      const imgTag = document.createElement("img");
      imgTag.src = `../uploads/${fileData.change_name}`;
      divTag.appendChild(imgTag);
      content.appendChild(divTag);
    });
  }
};

/**
 *
 * @param {data} data
 * @param {부모클래스} parentClass
 */
const answerHtml = (data, parentClass) => {
  communityAnswerData = data.response;
  communityAnswerFileData = data.file;

  const answerDate = parentClass.querySelector(".answer-date");
  const answerName = parentClass.querySelector(".answer-name");
  const answerContent = parentClass.querySelector(".answer-detail");
  answerDate.textContent = formatFullDate(communityAnswerData.mod_date);
  answerName.textContent = communityAnswerData.name;

  const textarea = document.createElement("textarea");
  textarea.style.height = "200px";
  textarea.style.border = "none";
  textarea.style.width = "100%";
  textarea.disabled;
  textarea.value = communityAnswerData.answer_content;
  answerContent.appendChild(textarea);

  const divTag = document.createElement("div");
  divTag.classList.add("community-detail-content-img-area");

  // 파일 이름에서 확장자 추출
  const getExtension = (fileName) => {
    const lastDotIndex = fileName.lastIndexOf(".");
    return lastDotIndex !== -1
      ? fileName.slice(lastDotIndex + 1).toLowerCase()
      : "";
  };

  // jpg와 png 파일을 뒤로 배치하도록 정렬
  communityAnswerFileData.sort((a, b) => {
    const extensionA = getExtension(a.change_name);
    const extensionB = getExtension(b.change_name);

    // jpg와 png 파일인 경우 뒤로 배치
    if (
      (extensionA === "jpg" || extensionA === "png") &&
      !(extensionB === "jpg" || extensionB === "png")
    ) {
      return -1;
    } else if (
      !(extensionA === "jpg" || extensionA === "png") &&
      (extensionB === "jpg" || extensionB === "png")
    ) {
      return 1;
    }

    // 나머지는 정상적으로 정렬
    return a.change_name.localeCompare(b.change_name);
  });

  // 정렬된 데이터 확인
  console.log(communityAnswerFileData);

  communityAnswerFileData.forEach((fileData) => {
    const lastDotIndex = fileData.change_name.lastIndexOf(".");
    const fileExtension =
      lastDotIndex !== -1
        ? fileData.change_name.slice(lastDotIndex + 1).toLowerCase()
        : "";
    console.log("fileExtension", fileExtension);

    if (fileExtension === "jpg" || fileExtension === "png") {
      const imgTag = document.createElement("img");
      imgTag.src = `../uploads/${fileData.change_name}`;

      divTag.appendChild(imgTag);
      answerContent.appendChild(divTag);
    } else if (
      fileExtension === "pdf" ||
      fileExtension === "xlsx" ||
      fileExtension === "hwp" ||
      fileExtension === "pptx"
    ) {
      // PDF, 엑셀, 한글, 파워포인트 파일인 경우
      const downloadLink = document.createElement("a");
      const downloadText = document.createElement("span");
      const downloadIco = document.createElement("img");

      downloadIco.src = `../user/assets/images/icon/download.png`;
      downloadIco.classList.add("ico");
      downloadIco.classList.add("download");

      downloadText.innerHTML = `${fileData.origin_name}`; // 링크 텍스트 설정
      downloadLink.classList.add("downloadLink");
      downloadLink.style.display = "flex";
      downloadLink.href = `../uploads/${fileData.change_name}`; // 파일의 경로 설정
      downloadLink.download = fileData.change_name; // 다운로드 시 파일 이름 설정
      downloadLink.appendChild(downloadIco);
      downloadLink.appendChild(downloadText);
      divTag.appendChild(downloadLink); // 링크를 표시할 컨테이너에 추가
      answerContent.appendChild(downloadLink); // 링크를 표시할 컨테이너에 추가
    } else {
      console.error("Unsupported file type");
    }
  });
};

const deleteBtn = document.querySelectorAll(".community-del");
deleteBtn.forEach((element) => {
  element.addEventListener("click", () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      communityDelete();
    }
  });
});

const editBtn = document.querySelectorAll(".edit-btn");
editBtn.forEach((element) => {
  element.addEventListener("click", () => {
    location.href = `/community_edit?id=${id}&category_id=${categoryId}`;
  });
});
