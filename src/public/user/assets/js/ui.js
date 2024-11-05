/* popup close */
const popupCloses = document.querySelectorAll(".popup-close");
if (popupCloses) {
  popupCloses.forEach((popupClose) => {
    popupClose.addEventListener("click", () => {
      document.querySelector(".popup-wrap").classList.remove("active");
    });
  });
}

/* Tab */
const tabLi = document.querySelectorAll(".tab.type01 li");
const tabTarget = document.querySelectorAll("[data-tab]");
tabLi.forEach((tab) => {
  tab.addEventListener("click", function () {
    tabLi.forEach((tab2) => {
      tab2.classList.remove("active");
    });
    this.classList.add("active");

    const tabId = this.getAttribute("id");
    tabTarget.forEach((tabContent) => {
      tabContent.classList.remove("active");
    });
    tabTarget.forEach((dataTab) => {
      if (dataTab.dataset["tab"] === tabId) {
        dataTab.classList.add("active");
      }
    });
    //document.querySelector(`[data-tab='${tabId}']`).classList.add("active");
  });
});

/* Header */
const gnbWrap = document.querySelector(".gnb-wrap");
const gnb = document.querySelector(".gnb-menu");
const gnbMenu = document.querySelectorAll(".gnb-menu .sub-menu");
const gnbBg = document.querySelector(".sub-menu-area");

//mo header
const moMenuBtn = document.querySelector(".mo-menu-btn");
const moMenuClose = document.querySelector(".mo-menu-close");
const moGnbMenuArea = document.querySelector(".mo-gnb-menu-area");
const moGnbMenuDim = document.querySelector(".mo-gnb-menu-dim");

gnb.addEventListener("mouseenter", () => {
  gnbMenu.forEach((subMenu) => {
    subMenu.style.display = "block";
  });
  gnbBg.style.display = "block";
});

gnbWrap.addEventListener("mouseleave", () => {
  gnbMenu.forEach((subMenu) => {
    subMenu.style.display = "none";
  });
  gnbBg.style.display = "none";
});

moMenuBtn.addEventListener("click", () => {
  moGnbMenuArea.classList.add("active");
  moGnbMenuDim.classList.add("active");
});

moMenuClose.addEventListener("click", () => {
  moGnbMenuArea.classList.remove("active");
  moGnbMenuDim.classList.remove("active");
});

/* 킹슬리 소개/안내 구분 */
const parms = new URLSearchParams(window.location.search);
if (parms.get("id") === "program") {
  tabLi.forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelector("[data-tab=introduction]").classList.remove("active");
  document.querySelector("#guide").classList.add("active");
  document.querySelector("[data-tab=guide]").classList.add("active");
}

/* 킹슬리 소개 시간표 Tab */
const scheduleTabGroup = document.querySelector("#scheduleTabGroup");
const scheduleTabAge = document.querySelector("#scheduleTabAge");
const scheduleImage = document.querySelector("#scheduleImage");

const ageGrounp = {
  kindergarden: ["5세", "6세", "7세"],
  elementary: ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"],
  middle: ["1학년", "2학년", "3학년"],
  high: ["1학년", "2학년", "3학년"],
};

const ageImgGroup = {
  kindergarden: [
    "./user/assets/images/schedule/kindergarten.jpg",
    "./user/assets/images/schedule/kindergarten.jpg",
    "/user/assets/images/schedule/kindergarten.jpg",
  ],
  elementary: [
    "/user/assets/images/schedule/elementary_1.jpg",
    "/user/assets/images/schedule/elementary_2.jpg",
    "/user/assets/images/schedule/elementary_3.jpg",
    "/user/assets/images/schedule/elementary_4.jpg",
    "/user/assets/images/schedule/elementary_5.jpg",
    "/user/assets/images/schedule/elementary_6.jpg",
  ],
  middle: [
    "/user/assets/images/schedule/middle_1.jpg",
    "/user/assets/images/schedule/middle_2.jpg",
    "/user/assets/images/schedule/middle_3.jpg",
  ],
  high: [
    "/user/assets/images/schedule/high_1.jpg",
    "/user/assets/images/schedule/high_2.jpg",
    "/user/assets/images/schedule/high_3.jpg",
  ],
};

if (scheduleTabGroup) {
  const initTabGroup = () => {
    const ageValue = ageGrounp[scheduleTabGroup.value];
    const ageImage = ageImgGroup[scheduleTabGroup.value];
    scheduleTabAge.innerHTML = "";

    ageValue.forEach((value, index) => {
      const li = document.createElement("li");
      li.textContent = value;

      li.addEventListener("click", () => {
        scheduleTabAge.querySelectorAll("li").forEach((li) => {
          li.classList.remove("active");
        });
        li.classList.add("active");

        scheduleImage.src =
          ageImage[index] || "/user/assets/images/schedule/kindergarten.jpg";
      });

      if (index === 0) {
        li.classList.add("active");
        scheduleImage.src =
          ageImage[index] || "/user/assets/images/schedule/kindergarten.jpg";
      }
      scheduleTabAge.appendChild(li);
    });
  };
  initTabGroup();
  scheduleTabGroup.addEventListener("change", initTabGroup);
}

/* 학생 나이 변경 select 박스  */
const ageGroupSelect = (ageGroupName, gradeName) => {
  const ageGroupSelect = document.querySelector(
    `select[name='${ageGroupName}']`
  );
  const gradeSelect = document.querySelector(`select[name='${gradeName}']`);

  if (ageGroupSelect && gradeSelect) {
    ageGroupSelect.addEventListener("change", (event) => {
      const selectedAgeGroup = event.target.value;
      const grades = ageGrounp[selectedAgeGroup];

      gradeSelect.innerHTML = "";

      grades.forEach((grade) => {
        const option = document.createElement("option");
        option.textContent = grade;
        gradeSelect.appendChild(option);
      });
    });
  }
};

ageGroupSelect("student1AgeGroup", "student1Grade");
ageGroupSelect("student2AgeGroup", "student2Grade");

/* 셀렉트박스  defaultOption 제거 */
const selectElements = document.querySelectorAll(".apply-select");
if (selectElements) {
  selectElements.forEach((selectElement) => {
    const defaultOption = selectElement.querySelector(".defaultOption");
    if (defaultOption) {
      defaultOption.style.display = "none";
    }

    selectElement.addEventListener("change", () => {
      if (defaultOption) {
        defaultOption.style.display = "none";
      }
    });
  });
}

// 갤러리 상세 팝업 Swiper
const popupImgSwiper = (fileData) => {
  const swiper = new Swiper(".imgSwiper", {
    initialSlide: 0,
    slidesPerView: 1,
    loop: false,
    centeredSlides: true,
    autoplay: false,
    pagination: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  swiper.on("slideChange", function () {
    updatePageNum(swiper, fileData.length);
  });

  return swiper;
};

// Main Banner
const mainBannerSwiper = document.querySelector(".mainBannerSwiper");
if (mainBannerSwiper) {
  const mainSwiper = new Swiper(mainBannerSwiper, {
    loop: true,
    autoplay: {
      delay: 5000,
    },
    pagination: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const subBannerSwiper = document.querySelector(".main-sub-banner-swiper");
  const subSwiper = new Swiper(subBannerSwiper, {
    slidesPerView: 3,
    spaceBetween: 0,
    freeMode: true,
    pagination: false,
    autoplay: {
      delay: 500,
    },
  });
});

/* 커뮤니티 카테고리별 이동*/
const typeId = parms.get("type");
if (typeId) {
  tabLi.forEach((tab) => {
    tab.classList.remove("active");

    if (tab.id === typeId) {
      tab.classList.add("active");
    }
  });

  tabTarget.forEach((tabContent) => {
    tabContent.classList.remove("active");

    if (tabContent.dataset["tab"] === typeId) {
      tabContent.classList.add("active");
    }
  });

  /* 커뮤니티 카테고리별 작성 페이지 이동*/
  const communityWriteElements = document.querySelectorAll(
    ".community-write-qna"
  );
  if (communityWriteElements) {
    communityWriteElements.forEach((element) => {
      element.classList.remove("active");
      if (element.dataset["type"] === typeId) {
        element.classList.add("active");
      }
    });
  }
}
