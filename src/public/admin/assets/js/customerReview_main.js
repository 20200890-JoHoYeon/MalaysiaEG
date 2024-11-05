let DT = null;

//페이지네이션
let page = 1;
let allDataCount = 0;
const rangeSize = 5;
const pageSize = 10;
let curDataCount = 0;
let startIndex = 1;

//검색
let start_date = dayjs().subtract(1, "year").format("YYYY-MM-DD HH:mm:ss");
let end_date = dayjs().format("YYYY-MM-DD HH:mm:ss");
let search_word = "";
let admin_state = ""; //미작성, 작성완료, 전송완료
let exposure_yn = ["Y", "N"];
let category_id = [3];

let sort = "DESC";

$(document).ready(function () {
  document
    .getElementById("keyword")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();

        onClickSearch(event);
      }
    });
  $(".date-pick").datepicker({
    dateFormat: "yy-mm-dd",
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true,
    placement: "bottom",
    orientation: "auto bottom",
    templates: {
      leftArrow: '<i class="fa fa-angle-left"></i>',
      rightArrow: '<i class="fa fa-angle-right"></i>',
    },
    endDate: new Date(),
  });
  const today = dayjs();
  const formattedDate = today.format("YYYY-MM-DD");
  $("#start_date, #end_date").datepicker({
    dateFormat: "yyyy-mm-dd",
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true,
    placement: "bottom",
    orientation: "auto bottom",
  });
  $("#start_date, #end_date").datepicker("setDate", formattedDate);
  $("#start_date, #end_date").on("changeDate", function (event) {
    const startDate = new Date($("#start_date").val());
    const endDate = new Date($("#end_date").val());
    if (endDate < startDate) {
      $("#end_date").datepicker("setDate", startDate);
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
      { width: null },
      { width: "15%" },
      { width: "15%" },
    ],
  });
  showListData();

  $("#order_select").on("change", function () {
    sort = $(this).val();
    console.log(sort);
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
    const queryString = `?content_id=${checkboxValue}`;
    window.location.href = "/admin/customerReview_detail" + queryString;
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

  const exposure_yn_radio = document.querySelector(
    'input[name="exposure_yn"]:checked'
  ).value;
  exposure_yn = exposure_yn_radio == "all" ? ["Y", "N"] : [exposure_yn_radio];

  search_word = document.getElementById("keyword").value;
  start_date = document.getElementById("start_date").value;
  end_date = document.getElementById("end_date").value;
  page = 1;

  showListData();
};
function paginateData(data, pageSize, startIndex) {
  let array = sort == "DESC" ? data : data.reverse();
  console.log("sort", sort);

  const endIndex = startIndex + pageSize;
  return array.slice(startIndex, endIndex);
}

//리스트 조회
const showListData = async () => {
  start_date = dayjs(start_date).format("YYYY-MM-DD 00:00:00");
  end_date = dayjs(end_date).format("YYYY-MM-DD 23:59:59");
  const requestBody = {
    start_date,
    end_date,
    search_word,
    exposure_yn,
    category_id,
    admin_state,
  };

  const raw = JSON.stringify(requestBody);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${host}/community/review/search`,
      requestOptions
    );
    const { code, message, data } = await response.json();

    if (code === 200) {
      DT.clear().draw();
      startIndex = (page - 1) * pageSize;
      console.log(data);
      const res = data.response;
      allDataCount = data.count;
      console.log(data.count);
      curDataCount = res.length;
      console.log(res.length);

      const paginatedData = paginateData(res, pageSize, startIndex);
      console.log("페이지네이션", paginatedData);

      paginatedData.forEach(function (row, i) {
        const checkbox = $("<input>").attr({
          type: "checkbox",
          class: "content-ck table-ck",
          value: row.content_id,
          name: "idxArr[]",
          id: "checkbox" + i,
        });

        DT.row
          .add([
            checkbox[0].outerHTML,
            i + startIndex + 1,

            row.title,
            row.exposure_yn,
            dayjs(row.reg_date).format("YYYY-MM-DD"),
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
  const delContents = Array.from(checkboxes)
    .map((checkbox) => parseInt(checkbox.value, 10))
    .filter((contentId) => !isNaN(contentId) && contentId !== null);

  const result = window.confirm("삭제 하시겠습니까?");
  if (result) {
    try {
      const deletePromises = delContents.map(async (id) => {
        console.log("id", id);
        const response = await fetch(`${host}community/review/${id}`, {
          method: "DELETE",
        });
        const { code, message } = await response.json();
        if (code !== 200) {
          throw new Error(`API 요청이 실패했습니다. ${message}`);
        }
        return id;
      });

      await Promise.all(deletePromises);

      window.location.href = "/admin/customerReview_main";
    } catch (err) {
      alert("에러가 발생했습니다: " + err.message);
      console.error("에러", err);
    }
  }
};
