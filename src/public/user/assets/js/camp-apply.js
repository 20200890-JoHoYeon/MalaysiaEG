//-----------희망견적 변수 (선택 항목 -> 합계금액 출력) ----------------------------------------------------------------------------------------
//HY
//참가형태
let attendType = 0;

//참가기간(기본 값 2주)
let attendPeriod = 2;

//학생 1, 2 1뎁스
let student1AgeGroup = "";
let student2AgeGroup = "";

// 학생 1, 2 2뎁스
let student1Grade = "";
let student2Grade = "";

//호텔,기숙사 추가 1, 2
let sudent1HotelYn = 0;
let sudent2HotelYn = 0;
let oneHotelYn = document.querySelector("#oneHotelYn");
let twoHotelYn = document.querySelector("#twoHotelYn");

//기타
let etc = 0;
let etc2 = 0;

//합계금액
let total = 0;
let totalPrice = document.querySelector(".total-price");

//-----------스쿨링 캠프 변수 (선택 항목 -> 각 요소들 금액 출력)----------------------------------------------------------------------------------------

//참가형태 금액
let hopeCampNameResult = document.querySelector(".hope-camp-name-result");
let hopeCampPriceResult = document.querySelector(".hope-camp-price-result");

//참가기간 이름 (2주, 4주), 퍼센트 (50%, 100%)
let attendPeriodResult = document.querySelector(".attend-period-result");
let attendPeriodPercentResult = document.querySelector(
  ".attend-period-percent-result"
);

//학생 인원수
let studentCountResult = document.querySelector(".student-count-result");

//학생 1 금액
let sudent1TotalPrice = document.querySelector(".sudent1-total-price");

//학생 1 호텔/기숙사 제외/포함 금액
let student1OffPriceText = document.querySelector(".student1-off-price-text");

//학생 2 금액
let sudent2TotalPrice = document.querySelector(".sudent2-total-price");

//학생 1 호텔/기숙사 제외/포함 금액
let student2OffPriceText = document.querySelector(".student2-off-price-text");

//2가족 룸쉐어 금액
let ect1TypeResult = document.querySelector(".ect1-type-result");

//엑스트라베드 금액
let ect2TypeResult = document.querySelector(".ect2-type-result");

//상담 신청 가격 저장용 변수
let attendPriceSave = 0;

// 호텔/기숙사 포함 금액 계산용 변수
let attendPeriodPrice = 500000;

$(document).ready(function () {
  //학년, 반 구분 함수 초기화
  classFilter(student1AgeGroup, student1Grade, oneHotelYn);
  classFilter(student2AgeGroup, student2Grade, twoHotelYn);

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //참가형태

  $("#attendType").on("change", function () {
    attendType = $(this).val();
    console.log(attendType);
    showListDataOpen();
    console.log("참가형태 터치 토탈", total);
  });

  //참가기간
  $("input[name='attendPeriod']").on("change", function () {
    attendPeriod = $("input[name='attendPeriod']:checked").val();
    console.log(attendPeriod);
    showListDataOpen();
    console.log("참가기간 터치 터치토탈", total);
  });
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //학생 2명 라디오 클릭 시 학생 2 셀렉트 바 등장
  $("input[name='studentCount']").on("change", function () {
    let twoStudent = document.querySelectorAll(".twoStudent");

    for (var i = 0; i < twoStudent.length; i++) {
      if ($("input[name='studentCount']:checked").val() == 2) {
        twoStudent[i].classList.remove("hidden");
      } else {
        twoStudent[i].classList.add("hidden");
      }
    }

    showListDataOpen();
  });
  //학생1 1뎁스
  $("#student1AgeGroup").on("change", function () {
    student1AgeGroup = $(this).val();
    console.log(student1AgeGroup);
    student1Grade = $("#student1Grade option:eq(0)").val();
    classFilter(student1AgeGroup, student1Grade, oneHotelYn);
    showListDataOpen();
    console.log("학생1 터치 토탈", total);
  });
  //학생2 1뎁스
  $("#student2AgeGroup").on("change", function () {
    student2AgeGroup = $(this).val();
    console.log(student2AgeGroup);
    student2Grade = $("#student2Grade option:eq(0)").val();
    classFilter(student2AgeGroup, student2Grade, twoHotelYn);
    showListDataOpen();
    console.log("학생2 터치 토탈", total);
  });
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //학생 1 2뎁스
  $("#student1Grade").on("change", function () {
    student1Grade = $(this).val();
    console.log(student1Grade);
    sudent1TotalPrice.innerHTML = `${student1AgeGroup} ${student1Grade}`;
    classFilter(student1AgeGroup, student1Grade, oneHotelYn);
    showListDataOpen();
  });
  //학생 2 2뎁스
  $("#student2Grade").on("change", function () {
    student2Grade = $(this).val();
    console.log(student2Grade);
    sudent2TotalPrice.innerHTML = `${student2AgeGroup} ${student2Grade}`;
    classFilter(student2AgeGroup, student2Grade, twoHotelYn);
    showListDataOpen();
  });
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //호텔/기숙사 포함 1
  $("input[name='sudent1_hotel_yn']").on("change", function () {
    // 체크박스의 체크 상태를 확인
    sudent1HotelYn = $(this).prop("checked");
    console.log("체크박스", sudent1HotelYn);

    showListDataOpen();
    console.log("호텔/기숙사 포함 1 터치 터치토탈", total);
  });
  //호텔/기숙사 포함 2
  $("input[name='sudent2_hotel_yn']").on("change", function () {
    // 체크박스의 체크 상태를 확인
    sudent2HotelYn = $(this).prop("checked");
    console.log("체크박스", sudent2HotelYn);

    showListDataOpen();
    console.log("호텔/기숙사 포함 2 터치 터치토탈", total);
  });
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //기타 1 2가족 룸쉐어
  $("#etc").on("change", function () {
    etc = $(this).prop("checked");
    console.log("기타", etc);
    showListDataOpen();
    console.log("기타 2 터치 토탈", total);
  });

  //기타 2 엑스트라 베드
  $("#etc2").on("change", function () {
    ect2TypeResult.innerHTML = `+5,300,000원`;
    etc2 = $(this).prop("checked");
    console.log("기타", etc2);
    showListDataOpen();
    console.log("기타 2 터치 토탈", total);
  });

  //상담 신청 버튼 클릭 시 필수값 요청
  $(".apply-popup-open").click(function () {
    console.log("상담 신청 버튼 클릭");
    console.log("dddd", attendPriceSave);
  });
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------

//합계금액 계산 함수(HY)
const showListDataOpen = () => {
  console.log(
    "요소",
    attendType,
    attendPeriod,
    student1AgeGroup,
    student2AgeGroup,
    sudent1HotelYn,
    sudent2HotelYn,
    etc,
    etc2,
    student1Grade,
    student2Grade
  );
  //선택 금액 저장용 변수
  let PriceElement = 0;
  let Price = document.querySelector(".total-price");

  //참가형태 금액 저장용 변수
  let attendPrice = 0;

  //학생 금액 저장용 변수
  let student1Price = 0;
  let student2Price = 0;

  //학생 1, 호텔/기숙사 포함 1
  studentCountResult.innerHTML = `1명`;
  attendPrice += attendTypePrice(student1AgeGroup, 1, attendType);
  PriceElement += attendTypePrice(student1AgeGroup, 1, attendType);
  student1Price = PriceElement;
  PriceElement += sudent1HotelYn == true ? 500000 : 0;
  //학생 2, 호텔/기숙사 포함 2
  let student2 = 0;
  if ($("input[name='studentCount']:checked").val() == 2) {
    studentCountResult.innerHTML = `2명`;
    sudent2TotalPrice.innerHTML = `+5,300,000원`;
    student2 += attendTypePrice(student2AgeGroup, 2, attendType);
    attendPrice += student2;
    student2 += sudent2HotelYn == true ? 500000 : 0;

    PriceElement += student2;
    student2Price = PriceElement;
    console.log("student2", student2);
  } else if ($("input[name='studentCount']:checked").val() == 1) {
    // 2명이 아닐 때 값 초기화

    $("input[name='sudent2_hotel_yn']").prop("checked", false);

    sudent2HotelYn = false;
    sudent2TotalPrice.innerHTML = `-`;
    PriceElement -= student2;
    attendPrice -= student2;
  }
  //기타
  PriceElement += etc == true ? -1500000 : 0;
  ect1TypeResult.innerHTML = etc == true ? "-1,500,000" : "-";
  PriceElement += etc2 == true ? 1400000 : 0;
  ect2TypeResult.innerHTML = etc2 == true ? "+1,400,000" : "-";

  //참가기간 2주, 4주
  if (attendPeriod == 2) {
    //attendPeriodResult.innerHTML = "참가기간";
    attendPeriodPercentResult.innerHTML = `2주`;
    attendPrice *= 0.5;
    PriceElement *= 0.5;
    //기숙사 추가 비용 50만원은 2주여도 50%가 아니기에 더해줌
    if (sudent1HotelYn == true) {
      PriceElement += 250000;
      attendPeriodPrice = 500000;
      console.log("attendPeriodPrice", attendPeriodPrice);
    }

    if (sudent2HotelYn == true) {
      PriceElement += 250000;
      attendPeriodPrice = 1000000;
    }
  } else {
    attendPeriodPrice = 500000;
    //attendPeriodResult.innerHTML = "참가기간";
    attendPeriodPercentResult.innerHTML = `4주`;
  }
  attendPriceSave = attendPrice;
  hopeCampPriceResult.innerHTML =
    attendPrice != 0 ? `${formatPrice(attendPrice)}원` : "-";
  document.querySelector(
    ".student1-off-text"
  ).innerHTML = `학생 1 호텔/기숙사 ${
    sudent1HotelYn == true ? "포함" : "제외"
  }`;
  document.querySelector(
    ".student2-off-text"
  ).innerHTML = `학생 2 호텔/기숙사 ${
    sudent2HotelYn == true ? "포함" : "제외"
  }`;
  student1OffPriceText.innerHTML =
    sudent1HotelYn == true ? `${formatPrice(500000)}원` : "-";

  student2OffPriceText.innerHTML =
    sudent2HotelYn == true ? `${formatPrice(500000)}원` : "-";

  total = PriceElement;
  console.log("초기 금액 불러오기 성공", total);
  Price.innerHTML = `${formatPrice(total)}원`;
  document.querySelector(".popup-total-price").innerHTML = Price.innerHTML;
  console.log("현재 금액 불러오기 성공", total);
};

//학년, 반 구분 함수 (유치부, 초등학교 1, 2 학년인 경우 호텔/기숙사 포함 비활성화)
const classFilter = (studentAgeGroup, studentGrade, HotelYn) => {
  const selectElement = document.querySelector("#attendType");
  const optionStudent = selectElement.querySelector(`option[value="2"]`);
  const optionCamp = selectElement.querySelector(`option[value="3"]`);
  //유치부가 아닐 때
  console.log("학생 1인지 아닌지 HotelYn:", HotelYn.id);
  let hotelCheck =
    HotelYn.id == "oneHotelYn"
      ? document.getElementById("sudent1HotelYn")
      : document.getElementById("sudent2HotelYn");
  console.log("hotelCheck 결과", hotelCheck);
  if (studentAgeGroup == "kindergarden") {
    hotelCheck.disabled = true;
    if (optionStudent) {
      optionStudent.disabled = true;
      optionStudent.style.background = "#EFEFEF";
    }
    if (optionCamp) {
      optionCamp.disabled = true;
      optionCamp.style.background = "#EFEFEF";
    }
    selectElement.value = 1;
    attendType = 1;
    showListDataOpen();
  } else if (
    studentAgeGroup == "elementary" &&
    (studentGrade == "1학년" || studentGrade == "2학년" || studentGrade == 0)
  ) {
    hotelCheck.disabled = true;
    if (optionStudent) {
      optionStudent.disabled = true;
      optionStudent.style.background = "#EFEFEF";
    }

    if (optionCamp) {
      optionCamp.disabled = true;
      optionCamp.style.background = "#EFEFEF";
    }
    selectElement.value = 1;
    attendType = 1;
    showListDataOpen();
  } else {
    hotelCheck.disabled = false;
    if (optionStudent) {
      optionStudent.disabled = false;
      optionStudent.style.background = "white";
    }
    if (optionCamp) {
      optionCamp.disabled = false;
      optionCamp.style.background = "white";
    }
    showListDataOpen();
  }
};
//학년별 가격 attendTypePrice()용 요소 함수
function classPrice(oneLowerGradesOne, oneUpperGrades, classElement, people) {
  let sum = 0;
  if (classElement == "kindergarden") {
    sum = people != 2 ? oneLowerGradesOne : 4200000;
  } else if (
    classElement == "elementary" ||
    classElement == "middle" ||
    classElement == "high"
  ) {
    sum = people != 2 ? oneUpperGrades : 4600000;
  }
  return sum;
}
//참가형태에 따른 학생1, 힉생2 가격 구분 함수
function attendTypePrice(classElement, people, attendType) {
  let result = 0;
  if (attendType == 1) {
    //부모님 동반
    hopeCampNameResult.innerHTML = `부모님 동반`;
    result = classPrice(7400000, 7800000, classElement, people);
  } else if (attendType == 2) {
    //학생단독(기숙사)
    hopeCampNameResult.innerHTML = `학생 단독(기숙사)`;
    result = classPrice(5300000, 5300000, classElement, people);
  } else if (attendType == 3) {
    //숙소제외(캠프만)
    hopeCampNameResult.innerHTML = `숙소제외(캠프만)`;
    result = classPrice(4000000, 4400000, classElement, people);
  }

  if (people != 2) {
    sudent1TotalPrice.innerHTML = `${SchoolNameFilter(
      student1AgeGroup
    )} ${student1Grade}`;
  } else if (people == 2) {
    sudent2TotalPrice.innerHTML = `${SchoolNameFilter(
      student2AgeGroup
    )} ${student2Grade}`;
  }

  return result;
}

function SchoolNameFilter(studentAgeGroup) {
  let filterName = ["유치부", "초등", "중등", "고등"];
  if (studentAgeGroup == "kindergarden") studentAgeGroup = filterName[0];
  else if (studentAgeGroup == "elementary") studentAgeGroup = filterName[1];
  else if (studentAgeGroup == "middle") studentAgeGroup = filterName[2];
  else if (studentAgeGroup == "high") studentAgeGroup = filterName[3];

  return studentAgeGroup;
}

//가격 천 단위마다 쉼표 삽입
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------

//상담신청 버튼 클릭 시 견적서 작성 필수값 체크(HJ)
const popupOpen = document.querySelector(".apply-popup-open");
if (popupOpen) {
  popupOpen.addEventListener("click", () => {
    const selectOptionList = document.querySelector(".select-option-list");
    selectOptionList.innerHTML = "";

    const attendTypeSelect = document.querySelector("select[name=attendType]");
    const attendPeriodChecked = document.querySelector(
      "input[name=attendPeriod]:checked"
    );
    const studentCountChecked = document.querySelector(
      "input[name='studentCount']:checked"
    );

    const student1AgeGroupSelect = document.querySelector(
      "select[name=student1AgeGroup]"
    );
    const student2AgeGroupSelect = document.querySelector(
      "select[name=student2AgeGroup]"
    );

    //팝업 오픈 시 인풋 초기화 변수
    const parentName = document.querySelector("input[name=parent_name]");
    const student1Name = document.querySelector("input[name=student1_name]");
    const stud1Woman = document.querySelector("#stud1Woman");
    const student2Name = document.querySelector("input[name=student2_name]");
    const stud2Woman = document.querySelector("#stud2Woman");
    const addr = document.querySelector("input[name=addr]");
    const tel1 = document.querySelector("input[name=tel1]");
    const tel2 = document.querySelector("input[name=tel2]");
    const tel3 = document.querySelector("input[name=tel3]");
    const email1 = document.querySelector("input[name=email1]");
    const email2 = document.querySelector("input[name=email2]");
    const remarks = document.querySelector("textarea[name=remarks]");
    const agreeYN = document.querySelector("input[name=agree_YN]");

    const contents = [
      hopeCampNameResult.innerHTML + ",",
      attendPeriodResult.innerHTML + ",",
      studentCountChecked
        ? studentCountChecked.value == 2
          ? "학생 2명,"
          : "학생 1명,"
        : "",
      etc == true ? "2가족 룸쉐어," : "",
      etc2 == true ? "엑스트라베드" : "",
    ];

    contents.forEach((content) => {
      const li = document.createElement("li");
      li.innerHTML = content;
      selectOptionList.appendChild(li);
    });

    let isValid = true;
    console.log("student1Name", student1Name);
    parentName.value = "";
    student1Name.value = "";
    stud1Woman.checked = true;
    student2Name.value = "";
    stud2Woman.checked = true;
    addr.value = "";
    tel1.value = "";
    tel2.value = "";
    tel3.value = "";
    email1.value = "";
    email2.value = "";
    remarks.value = "";
    agreeYN.checked = false;

    if (attendTypeSelect.value === "default" || !attendTypeSelect.value) {
      alert("참가형태를 선택해주세요.");
      isValid = false;
    } else if (!attendPeriodChecked) {
      alert("참가기간을 선택해주세요.");
      isValid = false;
    } else if (!studentCountChecked) {
      alert("학생수를 선택해주세요.");
      isValid = false;
    } else if (
      student1AgeGroupSelect.value === "default" ||
      !student1AgeGroupSelect.value
    ) {
      alert("학생1 연령대를 선택해주세요.");
      isValid = false;
    } else if (studentCountChecked) {
      const studentCount = studentCountChecked.value;
      if (
        (studentCount === "2" && student2AgeGroupSelect.value === "default") ||
        !student2AgeGroupSelect.value
      ) {
        alert("학생2 연령대를 선택해주세요.");
        isValid = false;
      }
    }

    if (isValid) {
      document.querySelector(".popup-wrap").classList.add("active");
    }
  });
}

// 상담신청
const campApplyForm = document.forms.campApplyForm;

validationForm(campApplyForm, "parent_name", 1);
validationForm(campApplyForm, "student1_name", 1);
validationForm(campApplyForm, "student2_name", 1);
validationForm(campApplyForm, "addr", 7);
validationForm(campApplyForm, "tel1", 6);
validationForm(campApplyForm, "tel2", 6);
validationForm(campApplyForm, "tel3", 6);
validationForm(campApplyForm, "email1", 3);
validationForm(campApplyForm, "email2", 4);
validationForm(campApplyForm, "remarks", 7);

campApplyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const hopeCampName = document.querySelector(
    "input[name=hopeCampName]:checked"
  ).value;
  const parentName = document.querySelector("input[name=parent_name]").value;
  const student1Name = document.querySelector(
    "input[name=student1_name]"
  ).value;

  const student1Sex = document.querySelector(
    "input[name=student1_sex]:checked"
  ).value;

  const student2Name = document.querySelector(
    "input[name=student2_name]"
  ).value;

  const student2Sex = document.querySelector(
    "input[name=student2_sex]:checked"
  ).value;

  const addr = document.querySelector("input[name=addr]").value;

  const tel1 = document.querySelector("input[name=tel1]").value;
  const tel2 = document.querySelector("input[name=tel2]").value;
  const tel3 = document.querySelector("input[name=tel3]").value;

  const email1 = document.querySelector("input[name=email1]").value;
  const email2 = document.querySelector("input[name=email2]").value;

  const remarks = document.querySelector("textarea[name=remarks]").value;

  const agreeYN = document.querySelector("input[name='agree_YN']:checked");

  const student1GradeSelect = document.querySelector(
    "select[name=student1Grade]"
  );
  const student1Grade =
    student1GradeSelect.options[student1GradeSelect.selectedIndex].text;

  const student2GradeSelect = document.querySelector(
    "select[name=student2Grade]"
  );
  const student2Grade =
    student2GradeSelect.options[student2GradeSelect.selectedIndex].text;

  const student1AgeGroupSelect = document.querySelector(
    "select[name=student1AgeGroup]"
  );
  const student1AgeGroup =
    student1AgeGroupSelect.options[student1AgeGroupSelect.selectedIndex].text;

  const student2AgeGroupSelect = document.querySelector(
    "select[name=student2AgeGroup]"
  );
  const student2AgeGroup =
    student2AgeGroupSelect.options[student2AgeGroupSelect.selectedIndex].text;

  let etcCheckboxValue = "";
  let etc2CheckboxValue = "";

  const etcCheckbox = document.querySelector("input[name=etc]");
  if (etcCheckbox.checked) {
    etcCheckboxValue = etcCheckbox.value;
  }

  const etc2Checkbox = document.querySelector("input[name=etc2]");
  if (etc2Checkbox.checked) {
    etc2CheckboxValue = etc2Checkbox.value;
  }

  const studentCountChecked = document.querySelector(
    "input[name='studentCount']:checked"
  );

  const sudent1HotelYn = document.querySelector(
    "input[name='sudent1_hotel_yn']:checked"
  );
  const sudent1HotelYnValue = sudent1HotelYn ? "Y" : "N";

  const sudent2HotelYn = document.querySelector(
    "input[name='sudent2_hotel_yn']:checked"
  );
  const sudent2HotelYnValue = sudent2HotelYn ? "Y" : "N";

  const attendType = document.querySelector(
    ".hope-camp-name-result"
  ).textContent;

  const agreeYNValue = agreeYN ? "Y" : "N";

  const today = new Date();

  if (parentName === "") {
    alert("부모님 성함을 입력해주세요.");
    return false;
  } else if (student1Name === "") {
    alert("(학생 1)이름을 입력해주세요.");
    return false;
  } else if (studentCountChecked.value == 2) {
    if (student2Name === "") {
      alert("(학생 2)이름을 입력해주세요.");
      return false;
    }
  } else if (addr === "") {
    alert("거주지를 입력해주세요.");
    return false;
  } else if (tel1 === "" || tel2 === "" || tel3 === "") {
    alert("연락처를 입력해주세요.");
    return false;
  } else if (email1 === "" || email2 === "") {
    alert("이메일을 입력해주세요.");
    return false;
  } else if (!email2.includes(".")) {
    alert("이메일 형식을 확인해주세요.");
    return false;
  } else if (agreeYNValue == "N") {
    alert("동의 항목을 체크해주세요.");
    return false;
  }

  let req = {
    hope_camp_id: hopeCampName,
    hope_camp_name:
      hopeCampName === "1" ? "킹슬리 국제학교" : "선웨이라군 호텔",
    attend_type: attendType,
    attend_period_percent: attendPeriodPercentResult.textContent,
    attend_period: attendPeriodResult.textContent,
    student_count: studentCountChecked.value,
    student1_age_group: student1AgeGroup,
    student1_grade: student1Grade,
    sudent1_hotel_yn: sudent1HotelYnValue,
    student2_age_group: student2AgeGroup,
    student2_grade: student2Grade,
    student2_hotel_yn: sudent2HotelYnValue,
    etc: etcCheckboxValue,
    etc2: etc2CheckboxValue,
    price_attend_type: attendPriceSave,
    price_etc: attendPeriodPrice,
    price_hotel_include: attendPriceSave + attendPeriodPrice,
    price_hotel_exc: attendPriceSave,
    price_total: total,
    parent_name: parentName,
    student1_name: student1Name,
    student2_name: student2Name,
    student1_sex: student1Sex,
    student2_sex: student2Sex,
    addr: addr,
    tel: tel1 + "-" + tel2 + "-" + tel3,
    email1: email1,
    email2: email2,
    remarks: remarks,
    agree_YN: "Y",
    reg_date: formatDate(today),
  };

  console.log(req);
  campApplyPostApi(req);
});

const campApplyPostApi = (reqData) => {
  FETCH.post(`/offer/insert`, reqData, (data) => {
    console.log(data);
    console.log("신청완료");
    alert("신청이 완료되었습니다.");
    document.querySelector(".popup-wrap").classList.remove("active");
  });
};

const applyPopupCancelBtn = document.querySelector(".apply-popup-close");
applyPopupCancelBtn.addEventListener("click", () => {
  if (confirm("상담신청을 취소하시겠습니까?")) {
    const student1Sex = document.querySelector(
      "input[name=student1_sex]:checked"
    ).value;

    const student2Sex = document.querySelector(
      "input[name=student2_sex]:checked"
    ).value;

    console.log("dasdadsdsadddsasdd", student1Sex);
    console.log("student2Sexstudent2Sexstudent2Sexstudent2Sex", student2Sex);

    document.querySelector(".popup-wrap").classList.remove("active");
  }
});
