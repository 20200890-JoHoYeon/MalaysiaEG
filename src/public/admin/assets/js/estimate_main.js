let DT = null;

//페이지네이션
let page = 1;
let allDataCount = 0;
const rangeSize = 5;
const pageSize = 10;
let curDataCount = 0;
let startIndex = 1;

//검색
let start_date = dayjs().subtract(1, "year").format("YYYY-MM-DD");
let end_date = dayjs().format("YYYY-MM-DD");
let search_word = "";
let admin_state = ""; //미작성, 작성완료, 전송완료
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
      { width: "10%" },
      { width: "20%" },
      { width: "20%" },
      { width: "20%" },
      { width: "10%" },
      { width: "10%" },
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

  $("#search_btn").click(onClickSearch);
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
  listInfoContainer.innerHTML = `Showing ${startIndex + 1} to ${
    startIndex + curDataCount - 1
  } of ${allDataCount} entries`;
};

//검색 버튼 이벤트
const onClickSearch = (event) => {
  event.preventDefault();
  const checkboxes = document.querySelectorAll(
    '.filter-purpose input[type="checkbox"]:checked:not(#check_all)'
  );
  admin_state = [];
  checkboxes.forEach(function (checkbox) {
    admin_state.push(offerMainDecode(parseInt(checkbox.value)));
  });

  admin_state =
    JSON.stringify(admin_state) === JSON.stringify(["n", "w", "s"])
      ? ""
      : admin_state;
  console.log("ebd", admin_state);
  search_word = document.getElementById("keyword").value;
  start_date = document.getElementById("start_date").value;
  end_date = document.getElementById("end_date").value;

  showListData();
};

function paginateData(data, pageSize, startIndex) {
  let array = sort == "DESC" ? data.reverse() : data;
  console.log("sort", sort);

  const endIndex = startIndex + pageSize;
  return array.slice(startIndex, endIndex);
}

//리스트 조회
const showListData = async () => {
  const requestBody = {
    start_date,
    end_date,
    search_word,
    admin_state,
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
    const response = await fetch(`${host}offer/search/`, requestOptions);
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

      $("#dataTable").on("click", "tr", function () {
        // 현재 클릭된 행의 데이터 가져오기
        let rowData = DT.row(this).data();

        if (Array.isArray(rowData)) {
          let no = rowData[0]; //행 번호
          let url = res[no - 1].admin_state;
          console.log("url", url);
          url =
            url == "n" ? "/admin/estimate_register" : "/admin/estimate_detail";

          let offer_id = res[no - 1].offer_id;

          console.log("선택한 행의 no:", no);
          console.log("선택한 행의 url:", url);
          console.log("선택한 행의 offer_id:", offer_id);
          const queryString = `?offer_id=${offer_id}`;

          window.location.href = url + queryString;
        }
      });
      console.log(paginateData);

      paginatedData.forEach(function (row, i) {
        DT.row
          .add([
            i + startIndex + 1,
            row.parent_name,
            row.addr,
            row.tel,
            row.email,
            purposeDecode(row.admin_state),
            row.answer_date == null
              ? "-"
              : dayjs(row.answer_date).format("YYYY-MM-DD"),
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
