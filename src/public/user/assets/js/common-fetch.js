if (typeof FETCH === "undefined") FETCH = {};

(function (_context_) {
  const COMMON_FETCH = (url, header, successCallback) => {
    fetch(url, header)
      .then((res) => res.json())
      .then((data) => {
        //console.log("SUCCESS");
        if (isFunction(successCallback)) {
          successCallback(data);
        }
      });
  };

  //_context_.BASE_URL = "http://localhost:3000";
  _context_.BASE_URL = "http://14.63.220.194:3080";
  _context_.post = (url, data, successCallback) => {
    let headers = {};
    let body = data;

    if (!(data instanceof FormData)) {
      headers = { "Content-Type": "application/json" };
      body = isString(data) ? data : JSON.stringify(data);
    }

    COMMON_FETCH(
      `${_context_.BASE_URL}${url}`,
      {
        method: "POST",
        headers,
        body,
      },
      successCallback
    );
  };

  _context_.put = (url, data, successCallback) => {
    let headers = {};
    let body = data;

    if (!(data instanceof FormData)) {
      headers = { "Content-Type": "application/json" };
      body = isString(data) ? data : JSON.stringify(data);
    }

    COMMON_FETCH(
      `${_context_.BASE_URL}${url}`,
      {
        method: "PUT",
        headers,
        body,
      },
      successCallback
    );
  };

  _context_.get = (url, successCallback) => {
    COMMON_FETCH(
      `${_context_.BASE_URL}${url}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      successCallback
    );

    _context_.delete = (url, successCallback) => {
      COMMON_FETCH(
        `${_context_.BASE_URL}${url}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
        successCallback
      );
    };
  };

  const isString = (val) => {
    return Object.prototype.toString.call(val) === "[object String]";
  };

  const isFunction = (val) => {
    return Object.prototype.toString.call(val) === "[object Function]";
  };
})(FETCH);
