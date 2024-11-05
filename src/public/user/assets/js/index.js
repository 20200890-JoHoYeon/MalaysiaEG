// 이미지 요소들을 선택
const carouselItem = document.querySelectorAll(".carousel-item");
const mainSubBannerList = document.querySelector(".main-sub-banner-list");

const URL = "http://14.63.220.194:3080";
//const URL = "http://localhost:3000";

const mainSubBannerGalleryGet = () => {
  FETCH.post(
    "/gallery/gallery",
    {
      page: 1,
      pageSize: 10,
      category: [0],
      type_id: [1],
    },
    (data) => {
      maingalleryData = data.data;
      console.log(data);
      mainSubBannerGalleryHTML();
    }
  );
};

const mainSubBannerGalleryHTML = () => {
  maingalleryData.forEach((data) => {
    if (mainSubBannerList) {
      const imgUrl = data.file_main_id_url;
      const newImgUrl = imgUrl ? imgUrl.replace("src/public/uploads/", "") : "";

      mainSubBannerList.insertAdjacentHTML(
        "beforeend",
        `
        <div class="carousel-item">
          <img src="${URL}/uploads/${newImgUrl}" alt="">
        </div>
        `
      );
    }
  });

  $(".slider").slick({
    infinite: true,
    slidesToShow: 3, // 화면에 보여질 이미지 수
    slidesToScroll: 3, // 한 번에 스크롤할 이미지 수
    autoplay: true, // 자동 재생 여부
    autoplaySpeed: 1, // 자동 재생 속도
    speed: 30000, // 전체적인 이동 속도
    pauseOnHover: true, // 마우스 호버 시 일시 정지 여부
    pauseOnFocus: true, // 마우스 클릭 시 일시 정지 여부
    cssEase: "linear", // 이동 효과
    waitForAnimate: true,
  });
};
mainSubBannerGalleryGet();
