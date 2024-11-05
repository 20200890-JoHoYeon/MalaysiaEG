// Date format yyyy-mm-dd hh:mm:ss
const formatFullDate = (data) => {
  const dateObj = new Date(data);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const date = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};

// Date format yyyy-mm-dd hh:mm
const formatShortDate = (data) => {
  const dateObj = new Date(data);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const date = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${date} ${hours}:${minutes}`;
};

// Date format yyyy-mm-dd
const formatDate = (data) => {
  const dateObj = new Date(data);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const date = String(dateObj.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
};

// 유효성 체크
const validation = (Target, type) => {
  //type1: 한글, 영문
  if (type == 1) {
    const inputValue = Target.value;
    const isValid = /^[A-Za-zㄱ-ㅎㅏ-ㅣ가-힣\s]*$/g.test(inputValue);
    if (!isValid) {
      Target.value = inputValue.replace(/[^A-Za-zㄱ-ㅎㅏ-ㅣ가-힣\s]/g, "");
    }
  } else if (type == 2) {
    //type2: 한글, 영문, 특수문자
    const inputValue = Target.value;
    const isValid =
      /^[A-Za-zㄱ-ㅎㅏ-ㅣ가-힣!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/g.test(
        inputValue
      );
    if (!isValid) {
      Target.value = inputValue.replace(
        /[^A-Za-zㄱ-ㅎㅏ-ㅣ가-힣!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g,
        ""
      );
    }
  } else if (type === 3) {
    //type3: 영문, 숫자, 특수문자(ex. 이메일)
    const inputValue = Target.value;
    const isValid = /^[A-Za-z\d.!@#$%^&*()_+=~-]*$/g.test(inputValue);
    if (!isValid) {
      Target.value = inputValue.replace(/[^A-Za-z\d.!@#$%^&*()_+=~-]/g, "");
    }
  } else if (type === 4) {
    //type4: 영문, 숫자, 특수문자 . 허용(ex. 도메인)
    const inputValue = Target.value;
    const isValid = /^[A-Za-z\d.]*$/g.test(inputValue);
    if (!isValid) {
      Target.value = inputValue.replace(/[^A-Za-z\d.]/g, "");
    }
  } else if (type == 5) {
    //type4: ""
    const inputValue = Target.value;
    const isValid = /^[]*$/g.test(inputValue);
    if (!isValid) {
      Target.value = inputValue.replace(/[^]/g, "");
    }
  } else if (type == 6) {
    //type5: 숫자
    const inputValue = Target.value;
    const isValid = /^\d*$/g.test(inputValue);
    if (!isValid) {
      Target.value = inputValue.replace(/[^\d]/g, "");
    }
  } else if (type == 7) {
    //type5: 한글, 영문, 특수문자, 숫자
    const inputValue = Target.value;
    const isValid =
      /^[A-Za-zㄱ-ㅎㅏ-ㅣ가-힣\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? \s]*$/g.test(
        inputValue
      );
    if (!isValid) {
      Target.value = inputValue.replace(
        /[^\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? \s]/g,
        ""
      );
    }
  }
};

const validationForm = (form, name, type) => {
  form.querySelector(`[name=${name}]`).addEventListener("input", () => {
    validation(form.querySelector(`[name=${name}]`), type);
  });
};
