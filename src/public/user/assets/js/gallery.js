//갤러리 조회
let galleryData = [];
let maingalleryData = [];
const COUNT_PER_PAGE = 12; // 한 페이지 리스트 개수
let finUrl = "";

const galleryTab = document.querySelectorAll(".gallery-tab li");
const campLifeList = document.querySelector(".camp-life-list-area");
const mainSubBannerList = document.querySelector(".main-sub-banner-list");
const popupImagesList = document.querySelector(".gallery-img-swiper-wrapper");

let categoryId = 0; // 카테고리 ID
let pageCount = 1; // 페이지

// 전체 아이템 수를 가져오는 함수 정의
const getTotalItemCount = (callback) => {
  FETCH.post(
    "/gallery/gallery",
    {
      page: pageCount,
      pageSize: null,
      category: [categoryId],
      type_id: [0],
    },
    (data) => {
      const total = Number(data.data.length);
      console.log(total);
      callback(total); // 콜백 함수를 호출하여 total 값을 전달
    }
  );
};

const galleryGet = () => {
  FETCH.post(
    "/gallery/gallery",
    {
      page: pageCount,
      pageSize: COUNT_PER_PAGE,
      category: [categoryId],
      type_id: [0],
    },
    (data) => {
      galleryData = data.data;
      console.log(data.data);
      console.log("pageCount: ", pageCount);
      console.log("categoryId : ", categoryId);
      galleryHTML();

      // 더보기 버튼 숨기기
      if (listMoreBtn) {
        getTotalItemCount((totalItemCount) => {
          const totalPages = Math.ceil(totalItemCount / COUNT_PER_PAGE);
          console.log("totalItemCount", totalItemCount);
          console.log("totalPages", totalPages);

          listMoreBtn.style.display =
            pageCount >= totalPages ? "none" : "block";
        });
      }
    }
  );
};

galleryGet();

galleryTab.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    categoryId = event.target.id;
    categoryId = Number(categoryId);
    pageCount = 1;
    campLifeList.innerHTML = "";
    galleryGet();
  });
});

const galleryHTML = () => {
  galleryData.forEach((element) => {
    const displayDateObj = new Date(element.display_date);
    const formattedDate = displayDateObj.toLocaleDateString();
    const imgUrl = element.file_main_id_url;

    if (campLifeList) {
      if (element.type === "동영상") {
        let replaceUrl = element.file_main_id_url;
        finUrl = "";

        if (replaceUrl) {
          replaceUrl = replaceUrl.replace("https://youtu.be/", "");
          replaceUrl = replaceUrl.replace("https://www.youtube.com/embed/", "");
          replaceUrl = replaceUrl.replace(
            "https://www.youtube.com/watch?v=",
            ""
          );
          finUrl = replaceUrl.split("&")[0];
        } else {
          console.error("Invalid video URL:", replaceUrl);
          return;
        }

        campLifeList.insertAdjacentHTML(
          "beforeend",
          `
          <li data-id=${element.gallery_id}>
              <div class="camp-life-img-area">
                <div class="camp-life-img" style="background-image: url(https://img.youtube.com/vi/${finUrl}/mqdefault.jpg)";></div>
              </div>
              <div class="camp-life-text-area">
                <div class="add-date">${formattedDate}</div>
                <div class="title">${element.title}</div>
              </div>
            </li>
          `
        );
      } else if (element.type === "사진") {
        const newImgUrl = imgUrl
          ? imgUrl.replace("src/public/uploads/", "")
          : "";
        campLifeList.insertAdjacentHTML(
          "beforeend",
          `
           <li data-id=${element.gallery_id}>
              <div class="camp-life-img-area">
                <div class="camp-life-img" style="background-image: url(/uploads/${newImgUrl})";></div>
              </div>
              <div class="camp-life-text-area">
                <div class="add-date">${formattedDate}</div>
                <div class="title">${element.title}</div>
              </div>
            </li>
          `
        );
      }
    }
  });

  const campLifeListLi = document.querySelectorAll(".camp-life-list-area li");

  campLifeListLi.forEach((element) => {
    element.addEventListener("click", () => {
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
    });
  });
};

const listMoreBtn = document.querySelector(".list-more-btn-area");
if (listMoreBtn) {
  listMoreBtn.addEventListener("click", () => {
    pageCount++; // 페이지 번호 증가
    galleryGet();
  });
}

// 팝업 상세 호출
let galleryCategoryPopup = [];
const fetchGalleryPopupDetail = (id) => {
  FETCH.get(`/gallery/select/${id}`, ({ code, data }) => {
    galleryCategoryPopup = data;
    popupAddElement();
  });
};

/* 팝업 추가 이미지 */

let swiper;
const popupAddElement = () => {
  const galleryPopup = document.querySelector(".img-popup-area");
  const popupTotalArea = document.querySelector(".popup_total_area");
  const nextEl = document.querySelector(
    ".gallery-img-detail-area .swiper-button-next"
  );
  const prevEl = document.querySelector(
    ".gallery-img-detail-area .swiper-button-prev"
  );

  const galleryPopupArea = document.querySelector(
    ".img-popup-area .popup-body-area"
  );

  const gallyDetailData = galleryCategoryPopup.response;
  if (popupImagesList) {
    popupImagesList.innerHTML = "";
  } else {
    console.log("popup_images_list 요소를 찾을 수 없습니다.");
  }

  if (gallyDetailData.type === "동영상") {
    nextEl.style.display = "none";
    prevEl.style.display = "none";
    popupTotalArea.style.display = "none";

    galleryPopupArea.classList.add("video");

    let videoUrl = gallyDetailData.video_url;
    let videoId = videoUrl.split("v=")[1];
    let ampersandPosition = videoId.indexOf("&");

    if (ampersandPosition != -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }

    let iframeUrl = `https://www.youtube.com/embed/${videoId}`;

    popupImagesList.insertAdjacentHTML(
      "beforeend",
      `
      <div class="iframe-area">
        <iframe src="${iframeUrl}"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>
      `
    );
  } else if (gallyDetailData.type === "사진") {
    nextEl.style.display = "block";
    prevEl.style.display = "block";
    popupTotalArea.style.display = "block";
    galleryPopupArea.classList.remove("video");

    const fileData = galleryCategoryPopup.file;

    if (fileData.length <= 1) {
      nextEl.style.display = "none";
      prevEl.style.display = "none";
    } else {
      nextEl.style.display = "block";
      prevEl.style.display = "block";
    }
    fileData.forEach((file) => {
      popupImagesList.insertAdjacentHTML(
        "beforeend",
        `<div class="swiper-slide"><img src='/uploads/${file.change_name}'></div>`
      );
    });

    swiper = popupImgSwiper(fileData);
    if (swiper) {
      console.log("prev fileData : ", fileData.length);
      updatePageNum(swiper, fileData.length);
      console.log("next fileData : ", fileData.length);
    }
  }

  galleryPopup.classList.add("active");
};

//팝업 순서
const popupTurn = document.querySelector(".popup_turn");
const popupTotal = document.querySelector(".popup_total");

const updatePageNum = (swiper, totalSlides) => {
  console.log("totalSlides: ", totalSlides);

  if (!isNaN(swiper.realIndex) && totalSlides !== 1) {
    popupTurn.innerText = swiper.realIndex + 1;
    popupTotal.innerText = totalSlides;
  } else {
    popupTurn.innerText = 1;
    popupTotal.innerText = 1;
  }
};

/* popup close */
if (popupCloses) {
  popupCloses.forEach((popupClose) => {
    popupClose.addEventListener("click", () => {
      if (popupImagesList) {
        popupImagesList.innerHTML = "";
      }
      document.querySelector(".popup-wrap").classList.remove("active");
      swiper.slideTo(0);
    });
  });
}
