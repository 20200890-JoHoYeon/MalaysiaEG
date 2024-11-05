//커뮤니티
const communityTab = document.querySelectorAll(".community-tab li");
let communityId;
let communityData = [];

const setCommunityId = (li) => {
  if (li.classList.contains("active")) {
    console.log(li.id);
    switch (li.id) {
      case "qna":
        communityId = 1;
        break;
      case "presentation":
        communityId = 2;
        break;
      case "review":
        communityId = 3;
        break;
      default:
        console.error("Unknown ID:", li.id);
    }
  }
  console.log(li);
};

communityTab.forEach((li) => {
  setCommunityId(li);
});

communityTab.forEach((li) => {
  li.addEventListener("click", () => {
    setCommunityId(li);
    communityGet();
  });
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
  });
}

//페이지네이션
let page = 1; // 현재 페이지 번호를 저장하는 변수
let allDataCount = 0; // 전체 데이터 개수를 저장하는 변수
const rangeSize = 5; // 한 번에 보여줄 페이지 번호 개수
const pageSize = 20; // 한 페이지에 보여줄 데이터 개수
let curDataCount = 0; // 현재 페이지에 보여줄 데이터 개수를 저장하는 변수
let startIndex = 1; // 현재 페이지의 첫 번째 데이터의 인덱스를 저장하는 변수

const pageContainer = document.querySelector(".page");
const pageList = pageContainer.querySelector("ul");
const pageItems = pageList.querySelectorAll("li");
const start = document.querySelector(".start");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const end = document.querySelector(".end");

const communityGet = () => {
  //커뮤니티 종류 바뀌었을 때 페이지 번호 1로 초기화
  page = 1;
  FETCH.get(`/community/${communityId}`, ({ code, data }) => {
    console.log(data);
    const res = data.response;
    const totalCount = parseInt(data.count, 10); // 총 데이터의 갯수
    let pageCount = Math.ceil(totalCount / pageSize);
    let rangeCount = Math.ceil(pageCount / rangeSize);
    let curRange = Math.floor((page - 1) / rangeSize) + 1;
    let startPage = (curRange - 1) * rangeSize + 1;
    let endPage = startPage + rangeSize - 1;

    function generatePages() {
      if (endPage > pageCount) endPage = pageCount;

      console.log("totalCount : ", totalCount);
      console.log("pageCount : ", pageCount);
      console.log("rangeCount : ", rangeCount);
      console.log("curRange : ", curRange);
      console.log("startPage : ", startPage);
      console.log("endPage : ", endPage);
      console.log("page", page);

      pageList.innerHTML = "";

      // 페이지 번호
      for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement("li");
        pageItem.textContent = i;

        // 현재 페이지일 경우 활성화 상태로 설정
        if (i === page) {
          pageItem.classList.add("active");
        }

        // 페이지 아이템 클릭 이벤트 처리
        pageItem.addEventListener("click", function () {
          scrollToTop();

          // 클릭한 페이지의 동작 구현
          console.log("Clicked on page", i);

          // 현재 페이지 강조 효과
          document.querySelectorAll(".page li").forEach(function (otherItem) {
            otherItem.classList.remove("active");
          });
          pageItem.classList.add("active");

          // 페이지 변경
          page = i;
          generatePages();
        });
        console.log("startPage / startPag /", page);
        pageList.appendChild(pageItem);
        const paginatedData = paginateData(res, pageSize, page);
        console.log("페이지네이션", paginatedData);
        communityData = paginatedData;

        communityListHtml();
      }
    }
    // 페이지 다음 버튼
    next.addEventListener("click", function () {
      scrollToTop();
      if (pageCount != 1 && pageCount != 0) {
        if (page === Math.round((startPage + endPage) / 2)) {
          // 페이지 범위를 이동
          if (endPage < pageCount) {
            startPage = Math.min(startPage + 1, pageCount - rangeSize + 1);
            endPage = Math.min(endPage + 1, pageCount);
          }
        }

        page = Math.min(page + 1, pageCount);
        generatePages();

        curRange = Math.ceil(page / rangeSize);
        console.log(`Current Range: ${curRange}`);
      }
    });
    // 페이지 이전 버튼
    prev.addEventListener("click", function () {
      scrollToTop();
      if (pageCount != 1 && pageCount != 0) {
        // 페이지 범위를 이동
        if (page === Math.round((startPage + endPage) / 2)) {
          if (startPage > 1) {
            startPage = Math.max(startPage - 1, 1);
            endPage = Math.max(endPage - 1, rangeSize);
          }
        }

        page = Math.max(page - 1, 1);
        generatePages();

        curRange = Math.ceil(page / rangeSize);
        console.log(`Current Range: ${curRange}`);
      }
    });
    //페이지 처음 버튼
    start.addEventListener("click", function () {
      scrollToTop();
      if (pageCount != 1 && pageCount != 0) {
        console.log("start");
        page = 1;
        startPage = 1;
        endPage = startPage + rangeSize - 1;
        generatePages();
      }
    });
    //페이지 끝 버튼
    end.addEventListener("click", function () {
      scrollToTop();
      if (pageCount != 1 && pageCount != 0) {
        console.log("end");

        page = pageCount;
        if (endPage < pageCount) {
          startPage = pageCount - rangeSize + 1;
          endPage = pageCount;
        }
        generatePages();
      }
    });
    generatePages();
  });
};

function paginateData(data, pageSize, startIndex) {
  console.log("startIndex", startIndex);
  console.log("data.length", data.length);

  if (pageSize <= data.length) {
    startIndex = startIndex != 1 ? (startIndex - 1) * pageSize : startIndex - 1;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  } else {
    //pageSize(20개)보다 데이터 총 개수가 적은 경우 페이징 처리하지 않는 코드
    return data;
  }
}

communityGet();

const qnaTable = document.querySelector(".qna-tbody");
const moQnaTable = document.querySelector(".mo-qna-tbody");

const presentationTable = document.querySelector(".presentation-tbody");
const moPresentationTable = document.querySelector(".mo-presentation-tbody");

const reviewTable = document.querySelector(".review-tbody");
const moReviewTable = document.querySelector(".mo-review-tbody");

const pwdPopup = document.querySelector(".pwd-popup-wrap");
const secretPwd = document.querySelector("#secretPwd");

let qnaIndex = 1;
let presentationIndex = 1;
let reviewIndex = 1;

const communityListHtml = () => {
  if (qnaTable) qnaTable.innerHTML = "";
  if (moQnaTable) moQnaTable.innerHTML = "";
  if (presentationTable) presentationTable.innerHTML = "";
  if (moPresentationTable) moPresentationTable.innerHTML = "";
  if (reviewTable) reviewTable.innerHTML = "";
  if (moReviewTable) moReviewTable.innerHTML = "";

  qnaIndex = 1;
  presentationIndex = 1;
  reviewIndex = 1;

  communityData.forEach((data, index) => {
    if (communityId === 1 && qnaTable) {
      const title = '<i class="ico lock"></i>비밀글입니다.';
      const rowHtml = `
        <tr onclick="handleRowClick(${data.content_id}, ${communityId},'${
        data.password
      }')">
          <td>${qnaIndex++}</td>
          <td class="left">${title}</td>
          <td>${data.reg_user}</td>
          <td>${formatDate(data.reg_date)}</td>
          <td>${stateText(data.state)}</td>
        </tr>
        `;

      const moRowHtml = `
      <tr onclick="handleRowClick(${data.content_id}, ${communityId},'${
        data.password
      }')">
        <td colspan="5">
         <div class="title">${title}</div>
         <span class="user-name">${data.reg_user}</span>
         <span class="reg-date">${formatDate(data.reg_date)}</span>
         <span class="state">${stateText(data.state)}</span>
         </td>
      </tr>
      `;

      qnaTable.insertAdjacentHTML("beforeend", rowHtml);
      moQnaTable.insertAdjacentHTML("beforeend", moRowHtml);
    } else if (communityId === 2 && presentationTable) {
      const title = '<i class="ico lock"></i>비밀글입니다.';

      const rowHtml = `
      <tr onclick="handleRowClick(${data.content_id}, ${communityId},'${
        data.password
      }')">
          <td>${presentationIndex++}</td>
          <td class="left">${title}</td>
          <td>${data.presentation_org_name}</td>
          <td>${formatDate(data.reg_date)}</td>
          <td>${stateText(data.state)}</td>
        </tr>
        `;

      const moRowHtml = `
      <tr onclick="handleRowClick(${data.content_id}, ${communityId},'${
        data.password
      }')">
        <td colspan="5">
          <div class="title">${title}</div>
          <span class="user-name">${data.presentation_org_name}</span>
          <span class="reg-date">${formatDate(data.reg_date)}</span>
          <span class="state">${stateText(data.state)}</span>
        </td>
      </tr>
        `;

      presentationTable.insertAdjacentHTML("beforeend", rowHtml);
      moPresentationTable.insertAdjacentHTML("beforeend", moRowHtml);
    } else if (communityId === 3 && reviewTable) {
      console.log(data.content_id, communityId);

      const rowHtml = `
      <tr onclick="reviewDetail(${data.content_id}, ${communityId})">
          <td>${reviewIndex++}</td>
          <td class="left">${data.title}</td>
          <td>${data.reg_user}</td>
          <td>${formatDate(data.reg_date)}</td>
        </tr>
        `;

      const moRowHtml = `
      <tr onclick="reviewDetail(${data.content_id}, ${communityId})">
          <td colspan="4">
            <div class="title">${data.title}</div>
            <span class="user-name">${data.reg_user}</span>
            <span class="reg-date">${formatDate(data.reg_date)}</span>
          </td>
        </tr>
          `;

      reviewTable.insertAdjacentHTML("beforeend", rowHtml);
      moReviewTable.insertAdjacentHTML("beforeend", moRowHtml);
    }
  });
};
let currentPassword = "";
const handleRowClick = (contentId, categoryId, password) => {
  currentPassword = password;
  const checkButton = pwdPopup.querySelector(".pwd-check");
  pwdPopup.classList.add("active");
  checkButton.addEventListener("click", function () {
    checkPassword(contentId, categoryId);
  });
};

const checkPassword = (contentId, categoryId) => {
  const inputPwd = secretPwd.value;
  if (inputPwd === currentPassword) {
    pwdPopup.classList.remove("active");
    location.href = `/community_write_complete?id=${contentId}&category_id=${categoryId}`;
  } else if (inputPwd == "") {
  } else {
    secretPwd.value = "";
    alert("비밀번호가 틀렸습니다.");
  }
};

/* popup close */
if (popupCloses) {
  popupCloses.forEach((popupClose) => {
    popupClose.addEventListener("click", () => {
      secretPwd.value = "";
    });
  });
}

const reviewDetail = (contentId, categoryId) => {
  location.href = `/community_write_complete?id=${contentId}&category_id=${categoryId}`;
};

const stateText = (data) => {
  let text = "";
  if (data === "w") {
    text = "답변대기";
  } else if (data === "d") {
    text = "답변완료";
  } else {
    text = "";
  }

  return text;
};
