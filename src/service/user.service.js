const bcrypt = require("bcrypt");
const { executeQuery } = require("../repository");
const sendMail = require("../utils/mail");

const userService = {
  logout: (req, res) => {
    req.session.destroy();
    res.clearCookie("eg");
    res.redirect("/admin/index");
  },
  login: async (req, res) => {
    try {
      const { id, pwd, isAuto } = req.body;

      const findUser = await executeQuery(
        "SELECT * FROM tbl_admin WHERE id = ?",
        id
      );

      if (findUser.length < 1) {
        res.status(400).json({
          code: 400,
          message: "유저를 찾을 수 없습니다.",
          data: false,
        });
        return;
      }

      const result = findUser[0].pwd;
      if (pwd !== result) {
        res.status(401).json({
          code: 401,
          message: "비밀번호가 일치하지 않습니다.",
          data: false,
        });
        return;
      }
      if (pwd === result) {
        req.session.user = {
          id: findUser[0].admin_id,
        };
      }

      req.session.user = {
        id: findUser[0].admin_id,
      };

      if (isAuto) {
        res.cookie("eg", findUser[0].admin_id, { maxAge: 60 * 60 * 24 * 14 });
      } else {
        req.session.cookie.expires = new Date(Date.now() + 60 * 60 * 1000); // 1시간
      }
      res.status(200).json({
        code: 200,
        message: "로그인 성공",
        data: {
          admin_id: findUser[0].admin_id,
          id: findUser[0].id,
          name: findUser[0].name,
        },
      });
      console.log(req.session.user);
      console.log("로그인성공");
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  find_user: async (req, res) => {
    try {
      const email = "yhy910910@naver.com";
      let attachments = [];
      let sql = `select id,pwd from tbl_admin where admin_id = 1`;
      const response = await executeQuery(sql);
      let setDetail = "아이디 - " + response[0].id;
      setDetail += "<br>비밀번호 - " + response[0].pwd;
      console.log(email);

      await sendMail(email, "관리자 페이지 계정 정보", setDetail, attachments);

      res.status(200).json({
        code: 200,
        message: "관리자 계정 찾기 메일 보내기 성공",
        data: true,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
};

module.exports = userService;
