let DT = null;

//페이지네이션
let page = 1;
let allDataCount = 0;
const rangeSize = 5;
const pageSize = 10;
let curDataCount = 0;
let startIndex = 1;

//검색
let from_date = null;
let to_date = null;
let search_word = "";

let exposure_yn = ["Y", "N"];
let type = "";
let category = [1, 2, 3]; //캠퍼스생활, 체육/특별활동, 현지라이프
let sort = "desc";
let gallery_category_name = ["캠퍼스생활", "체육/특별활동", "현지라이프"];

$(document).ready(function () {
  document
    .getElementById("keyword")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();

        onClickSearch(event);
      }
    });
  const today = dayjs();
  const formattedDate = today.format("YYYY-MM-DD");
  $("#from_date, #to_date").datepicker({
    dateFormat: "yyyy-mm-dd",
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true,
    placement: "bottom",
    orientation: "auto bottom",
  });
  $("#from_date, #to_date").datepicker("setDate", formattedDate);
  $("#from_date, #to_date").on("changeDate", function (event) {
    const startDate = new Date($("#from_date").val());
    const endDate = new Date($("#to_date").val());
    if (endDate < startDate) {
      $("#to_date").datepicker("setDate", startDate);
    }
  });

  DT = $("#dataTable").DataTable({
    info: false,
    language: lang,
    bFilter: false,
    ordering: false,
    lengthChange: false,
    paginate: false,
    columns: [
      { width: "10px" },
      { width: "10px" },
      { width: "15%" },
      { width: "15%" },
      null,
      { width: "15%" },
      { width: "10%" },
    ],
  });
  showListData();

  $("#order_select").on("change", function () {
    sort = $(this).val();
    showListData();
  });

  //전체 체크
  $("#check_all").change(function () {
    $(".ck").prop("checked", $(this).prop("checked"));
  });

  //나머지 체크
  $(".ck").change(function () {
    if ($(".ck:checked").length === $(".ck").length) {
      $("#check_all").prop("checked", true);
    } else {
      $("#check_all").prop("checked", false);
    }
  });

  //테이블 전체 체크
  $("input[name=table_ck_all]").change(function () {
    $(".table-ck").prop("checked", $(this).prop("checked"));
  });

  $("#dataTable tbody").on("click", "tr.content-list", function () {
    if ($(event.target).is('input[type="checkbox"]')) {
      if ($(".table-ck:checked").length === curDataCount) {
        $("input[name=table_ck_all]").prop("checked", true);
      } else {
        $("input[name=table_ck_all]").prop("checked", false);
      }
      return;
    }
    const checkboxValue = $(this).find(".table-ck").val();
    const queryString = `?gallery_id=${checkboxValue}`;
    window.location.href = "/admin/gallery_detail" + queryString;
  });

  $("#search_btn").click(onClickSearch);
  $("#delete_btn").click(onClickDeleteBtn);
});

const changePage = (i) => {
  page = i > 0 ? i : i > -1 ? page + 1 : page + i;
  showListData();
};

const paginate = () => {
  pageCount = Math.ceil((allDataCount * 1.0) / pageSize);
  rangeCount = Math.ceil((pageCount * 1.0) / rangeSize);
  curRange = Math.floor((page - 1) / rangeSize) + 1;
  startPage = (curRange - 1) * rangeSize + 1;
  endPage = startPage + rangeSize - 1;
  if (endPage > pageCount) endPage = pageCount;

  const paginationContainer = document.querySelector(
    "#pagination_container .pagination"
  );
  let paginationHTML = "";
  for (let i = startPage; i <= endPage; i++) {
    let pageItemClass = "paginate_button page-item";
    if (i === page) pageItemClass += " active";

    paginationHTML += `<li class="${pageItemClass}"><a href="#" class="page-link" onclick="changePage(${i})">${i}</a></li>`;
  }

  let prevPageLinkHTML = `
      <li class="paginate_button page-item previous ${
        page === 1 ? "disabled" : ""
      }" id="dataTable_previous">
        <a href="#" onclick="changePage(-1)"  class="page-link" >
          <i class="fa fa-chevron-left"></i>
        </a>
      </li>
    `;
  let nextPageLinkHTML = `
      <li class="paginate_button page-item next ${
        page === pageCount ? "disabled" : ""
      }" id="dataTable_next">
        <a href="#" onclick="changePage(0)" class="page-link">
          <i class="fa fa-chevron-right"></i>
        </a>
      </li>
    `;
  paginationContainer.innerHTML =
    prevPageLinkHTML + paginationHTML + nextPageLinkHTML;

  const listInfoContainer = document.getElementById("list_info");
  listInfoContainer.innerHTML = `Showing ${startIndex} to ${
    startIndex + curDataCount - 1
  } of ${allDataCount} entries`;
};

//검색 버튼 이벤트
const onClickSearch = (event) => {
  event.preventDefault();
  const checkboxes = document.querySelectorAll(
    '.filter-category input[type="checkbox"]:checked:not(#check_all)'
  );
  category = [];
  gallery_category_name = [];
  checkboxes.forEach(function (checkbox) {
    category.push(parseInt(checkbox.value));
    gallery_category_name.push(categoryDecode(parseInt(checkbox.value)));
  });
  const type_radio = document.querySelector('input[name="form"]:checked').value;
  type = type_radio == "all" ? "" : [type_radio == 1 ? "사진" : "동영상"];
  const exposure_yn_radio = document.querySelector(
    'input[name="exposure_yn"]:checked'
  ).value;
  exposure_yn = exposure_yn_radio == "all" ? ["Y", "N"] : [exposure_yn_radio];

  search_word = document.getElementById("keyword").value;
  from_date = document.getElementById("from_date").value;
  to_date = document.getElementById("to_date").value;
  sort = "desc";
  page = 1;

  showListData();
};

//리스트 조회
const showListData = async () => {
  const requestBody = {
    from_date,
    to_date,
    search_word,
    exposure_yn,
    type,
    page,
    pageSize,
    category,

    sort,
  };

  console.log(requestBody);

  const raw = JSON.stringify(requestBody);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${host}/gallery/search`, requestOptions);
    const { code, message, data } = await response.json();

    if (code === 200) {
      DT.clear().draw();
      startIndex = (page - 1) * pageSize + 1;
      console.log(data);
      allDataCount = data.count;
      console.log(data.count);
      curDataCount = data.gallery.length;

      console.log(data.gallery.length);

      data.gallery.forEach(function (row, i) {
        const checkbox = $("<input>").attr({
          type: "checkbox",
          class: "content-ck table-ck",
          value: row.gallery_id,
          name: "idxArr[]",
          id: "checkbox" + i,
        });

        DT.row
          .add([
            checkbox[0].outerHTML,
            i + startIndex,
            categoryDecode(row.category),

            row.type,
            row.title,
            dayjs(row.reg_date).format("YYYY-MM-DD"),
            row.exposure_yn,
          ])
          .node()
          .classList.add("content-list");

        DT.draw(false);
      });

      paginate();
      return;
    }
  } catch (err) {
    //console.log("Err:", err);
  }
};

//컨텐츠 선택삭제
const onClickDeleteBtn = async () => {
  const checkboxes = document.querySelectorAll(
    '.content-table input[type="checkbox"]:checked:not(#check_all)'
  );
  if (checkboxes.length === 0) {
    alert("삭제할 컨텐츠를 선택해주세요.");
    return;
  }
  const delContents = [];
  console.log(delContents);
  checkboxes.forEach(function (checkbox) {
    delContents.push(parseInt(checkbox.value, 10));
  });

  const contentRaw = JSON.stringify({
    gallery_id: delContents,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: contentRaw,
    redirect: "follow",
  };

  const result = window.confirm("삭제 하시겠습니까?");
  if (result) {
    try {
      const response = await fetch(
        `${host}/admin/gallery/delete`,
        requestOptions
      );
      const { code, message } = await response.json();
      if (code === 200) {
        window.location.href = "/admin/gallery_main";
      } else {
        alert(message || "에러가 발생했습니다.");
      }
    } catch (err) {
      alert("에러가 발생했습니다.");
      //console.log("Err", err);
    }
  }
};
