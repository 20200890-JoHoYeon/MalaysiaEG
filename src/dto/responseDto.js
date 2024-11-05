const setResponseJson = (code, message, data) => {
  let result = {};
  if (data != "") {
    result = {
      code: code,
      message: message,
      data: data,
    };
  } else {
    result = {
      code: code,
      message: message,
    };
  }
  return result;
};

module.exports = setResponseJson;
