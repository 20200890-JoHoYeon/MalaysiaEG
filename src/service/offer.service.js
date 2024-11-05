const sendMail = require("../utils/mail");
const { executeQuery } = require("../repository");
const connection = require("../../config/db");

const offerService = {
  select: async (req, res) => {
    // 조회, 검색
    try {
      const { offer_id } = req.params;
      const { search_word, sort, page, pageSize, admin_state } = req.body;
      let { from_date, to_date } = req.body;
      const offset = (page - 1) * pageSize || 0;
      const limit = pageSize || 10;

      let sql, sql2;

      let response;
      let result;
      if (offer_id == null) {
        sql2 = `SELECT COUNT(*) AS count FROM (`;
        sql = `
          SELECT 
            of.*,
            IF(aw.answer_id IS NOT NULL, aw.reg_date, NULL) AS answer_date
          FROM tbl_camp_offer of
          LEFT JOIN tbl_offer_answer aw
          ON aw.offer_id = of.offer_id
        `;

        if (admin_state != null) {
          sql += `WHERE of.admin_state LIKE '%${admin_state}%' `;
        }

        if (from_date != null && to_date != null) {
          from_date += " 00:00:00";
          to_date += " 23:59:59";
          sql += `AND of.reg_date BETWEEN '${from_date}' AND '${to_date}' `;
        }

        if (search_word != null) {
          sql += `AND (of.parent_name LIKE '%${search_word}%' `;
          sql += `OR (of.tel LIKE '%${search_word}%') `;
          sql += `OR CONCAT(of.email1, '@', of.email2) LIKE '%${search_word}%') `;
        }
        sql += `ORDER BY of.reg_date ${sort}`;
        sql2 += sql + `) a`;
        sql += ` LIMIT ${limit} OFFSET ${offset} `;

        response = await executeQuery(sql);
        const count = await executeQuery(sql2);
        result = { answer: response, count: count[0].count };
      } else if (offer_id) {
        sql = `
        SELECT *,  CONCAT(email1, '@', email2) AS email
          FROM tbl_camp_offer
          where offer_id = ?`;
        console.log(offer_id);
        [result] = await executeQuery(sql, [offer_id]);
        console.log(sql);
      }

      res.status(200).json({
        code: 200,
        message: "상담 조회에 성공하였습니다.",
        data: result,
      });
    } catch (err) {
      let message;
      /*
      if(req.session.user == undefined) {
        message = "유저 세션이 존재하지 않습니다."
      } else {
        message = "에러가 발생하였습니다.";
      }
*/
      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },

  search: async (req, res) => {
    try {
      const dto = req.body;

      let sql = `SELECT offer_id, parent_name, addr, tel, admin_state, send_date, reg_date, CONCAT(email1, '@', email2) AS email, send_date
        FROM tbl_camp_offer `;

      let where = `where 
          (reg_date between '${dto.start_date}' AND '${dto.end_date}')
          AND ((parent_name LIKE '%${dto.search_word}%') OR (tel LIKE '%${dto.search_word}%') OR (CONCAT(email1, '@', email2) LIKE '%${dto.search_word}%'))`;

      let admin_state = "(";
      if (dto.admin_state.length != 0) {
        for (let i = 0; i < dto.admin_state.length; i++) {
          admin_state += `'${dto.admin_state[i]}'`;
          if (i != dto.admin_state.length - 1) {
            admin_state += `, `;
          } else {
            where += `AND admin_state in ${admin_state}) `;
          }
        }
      }

      const response = await executeQuery(
        sql + where + "ORDER BY reg_date ASC;"
      );
      const [count] = await executeQuery(
        "SELECT COUNT(*) AS count FROM tbl_camp_offer " + where
      );

      res.status(200).json({
        code: 200,
        message: "상담 검색에 성공하였습니다.",
        data: { response, count: count.count },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  findOne: async (req, res) => {},

  insertOffer: async (req, res) => {
    // 등록
    try {
      const data = {
        hope_camp_id: req.body.hope_camp_id,
        hope_camp_name: req.body.hope_camp_name,
        attend_type: req.body.attend_type,
        attend_period: req.body.attend_period,
        attend_period_percent: req.body.attend_period_percent,
        student_count: req.body.student_count,
        student1_age_group: req.body.student1_age_group,
        student1_grade: req.body.student1_grade,
        sudent1_hotel_yn: req.body.sudent1_hotel_yn,
        student2_age_group: req.body.student2_age_group,
        student2_grade: req.body.student2_grade,
        student2_hotel_yn: req.body.student2_hotel_yn,
        etc: req.body.etc,
        etc2: req.body.etc2,
        price_attend_type: req.body.price_attend_type,
        price_etc: req.body.price_etc,
        price_hotel_include: req.body.price_hotel_include,
        price_hotel_exc: req.body.price_hotel_exc,
        price_total: req.body.price_total,
        parent_name: req.body.parent_name,
        student1_name: req.body.student1_name,
        student2_name: req.body.student2_name,
        student1_sex: req.body.student1_sex,
        student2_sex: req.body.student2_sex,
        addr: req.body.addr,
        tel: req.body.tel,
        email1: req.body.email1,
        email2: req.body.email2,
        remarks: req.body.remarks,
        agree_YN: req.body.agree_YN,
        reg_date: req.body.reg_date,
        offer_answer_YN: "N",
        admin_state: "n",
      };

      if (
        req.body.offer_id != undefined &&
        req.body.offer_id != "" &&
        req.body.offer_id != null
      ) {
        data.offer_id = req.body.offer_id;
      }

      let sql = "INSERT INTO tbl_camp_offer SET ?";
      let response = await executeQuery(sql, data);

      res.status(200).json({
        code: 200,
        message: "견적서 등록에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
  insertAnswer: async (req, res) => {
    try {
      let answer_content = req.body.answer_content;
      if (answer_content && typeof answer_content === "string") {
        if (answer_content.includes("'") == true) {
          answer_content = req.body.answer_content.replace("'", "''");
        }
      }
      const data = {
        admin_id: req.session.user.id,
        offer_id: req.body.offer_id,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        file_5_id: req.body.file_5_id,
        answer_content: answer_content,
      };

      connection.beginTransaction();
      let sql = `INSERT INTO tbl_offer_answer SET ?`;
      let response = await executeQuery(sql, data);

      let sql2 = `UPDATE tbl_camp_offer SET offer_answer_yn = 'Y', admin_state = 'w' WHERE offer_id = ?`;
      await executeQuery(sql2, [data.offer_id]);
      connection.commit();
      res.status(200).json({
        code: 200,
        message: "견적서 답변 등록에 성공하였습니다.",
      });
    } catch (error) {
      connection.rollback();
      let message;

      if (req.session.user == undefined) {
        message = "유저 세션이 존재하지 않습니다.";
      } else {
        message = "에러가 발생하였습니다.";
      }
      console.log(error);
      res.status(500).json({ message: message, data: error, code: 500 });
    }
  },
  sendAnswer: async (req, res) => {
    try {
      let answer_content = req.body.answer_content;
      if (answer_content && typeof answer_content === "string") {
        if (answer_content.includes("'") == true) {
          answer_content = req.body.answer_content.replace("'", "''");
        }
      }
      const data = {
        admin_id: req.session.user.id,
        offer_id: req.body.offer_id,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        file_5_id: req.body.file_5_id,
        answer_content: answer_content,
      };

      let sql = `select * from tbl_offer_answer where offer_id = ${data.offer_id}`;

      let [findOffer] = await executeQuery(sql);

      // 견적서 문의 내용, 관련컨텐츠, 상담답변 이미지 가져오기
      sql = `
      SELECT
        of.*,
        CONCAT(of.email1, '@', of.email2) AS email,
        aw.answer_content,
        fl1.origin_name AS answer_origin_name1, 
        fl1.url AS answer_url1,
        fl2.origin_name AS answer_origin_name2,
        fl2.url AS answer_url2,
        fl3.origin_name AS answer_origin_name3,
        fl3.url AS answer_url3,
        fl4.origin_name AS answer_origin_name4,
        fl4.url AS answer_url4,
        fl5.origin_name AS answer_origin_name5,
        fl5.url AS answer_url5
      FROM tbl_camp_offer of

      LEFT JOIN tbl_offer_answer aw 
      ON aw.admin_id = ?
      AND aw.answer_id = ?

      LEFT JOIN tbl_file fl1 ON fl1.file_id = aw.file_1_id
      AND fl1.del_yn = 'N'
      LEFT JOIN tbl_file fl2 ON fl2.file_id = aw.file_2_id
      AND fl2.del_yn = 'N'
      LEFT JOIN tbl_file fl3 ON fl3.file_id = aw.file_3_id
      AND fl3.del_yn = 'N'
      LEFT JOIN tbl_file fl4 ON fl4.file_id = aw.file_4_id
      AND fl4.del_yn = 'N'
      LEFT JOIN tbl_file fl5 ON fl5.file_id = aw.file_5_id   
      AND fl5.del_yn = 'N'

      WHERE of.offer_id = aw.offer_id 
    `;

      response = await executeQuery(sql, [data.admin_id, findOffer.answer_id]);

      const { title, origin_name, answer_origin_name1, answer_url1 } =
        response[0];
      let { url } = response[0];
      let cid;
      let attachments = [];

      let setDirname = __dirname.replace(/\\/g, "/");
      setDirname = setDirname.replace("src/service", "");

      if (url != undefined && url != "" && url != null) {
        url = url.replace(/\\/g, "/");
      }

      let setDetail =
        '<div style="color: black;">견적 정보 - ' +
        Number(response[0].price_total).toLocaleString();
      setDetail +=
        "<br><br> 1. 희망캠프 : [말레EG]" + response[0].hope_camp_name;
      setDetail += "<br><br> 2. 참가형태 : " + response[0].attend_type;
      setDetail += "<br><br> 3. 참가 기간 : " + response[0].attend_period;
      setDetail +=
        "<br><br> 4. 참가 인원 : " + response[0].student_count + "명";
      setDetail +=
        "<br><br> -학생 1(" +
        response[0].student1_name +
        "-" +
        response[0].student1_age_group +
        response[0].student1_grade +
        ")";
      if (response[0].student2_name) {
        setDetail +=
          "<br><br> -학생 2(" +
          response[0].student2_name +
          "-" +
          response[0].student2_age_group +
          response[0].student2_grade +
          ")";
      }
      if (response[0].etc2) {
        setDetail +=
          "<br><br> 5.기타 : " + response[0].etc + " " + response[0].etc2;
      } else {
        setDetail += "<br><br> 5.기타 : " + response[0].etc;
      }

      if (title != null) {
        // 컨텐츠 존재

        cid = "unique@nodemailer.com";
        setDetail +=
          '<br><br><img src="cid:unique@nodemailer.com" style="height: 300px" />';
        setDetail += "<br><br>관련컨텐츠 : " + title;
        attachments[0] = {
          path: setDirname + url,
          filename: origin_name,
          cid: cid,
        };
      } else {
        // 컨텐츠 미존재
        setDetail += "<br><br>";
      }

      setDetail += "<br><br><br>[답변 내용]";
      setDetail += "<br><br>" + response[0].answer_content + "</div>";
      setDetail += "<br><br><br>[첨부]      ";

      if (answer_url1 != null && answer_origin_name1 != null) {
        for (let i = 1; i <= 5; i++) {
          const fileOriginName = response[0][`answer_origin_name${i}`];
          const fileUrl = response[0][`answer_url${i}`];

          if (fileOriginName && fileUrl) {
            setDetail += ` ${fileOriginName}` + "<br>  ";
            const attachment = {
              path: `${setDirname}${fileUrl}`,
              filename: fileOriginName,
            };

            attachments.push(attachment);
          }
        }
      }

      await sendMail(
        response[0].email,
        "[말레EG] 안녕하세요! 견적문의 주셔서 감사합니다.",
        setDetail,
        attachments
      );
      let sql3 = `UPDATE tbl_camp_offer SET send_date = now(), admin_state = 's' where offer_id = ?`;
      response = await executeQuery(sql3, response[0].offer_id);

      res.status(200).json({
        code: 200,
        message: "답변 등록에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
      let message;

      if (req.session.user == undefined) {
        message = "유저 세션이 존재하지 않습니다.";
      } else {
        message = "에러가 발생하였습니다.";
      }

      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },
  updateAnswer: async (req, res) => {
    // 수정
    try {
      // 수정
      const data = {
        admin_id: req.session.user.id,
        offer_id: req.body.offer_id,
        answer_id: req.body.answer_id,
        file: req.body.file,
        // file_1_id: req.body.file_1_id,
        // file_2_id: req.body.file_2_id,
        // file_3_id: req.body.file_3_id,
        // file_4_id: req.body.file_4_id,
        // file_5_id: req.body.file_5_id,
        answer_content: req.body.answer_content,
      };
      let sql = `UPDATE tbl_offer_answer SET answer_content = COALESCE(?, answer_content), reg_date = now()`;
      if (data.reg_date != null) {
        sql += `, reg_date = '${data.reg_date}' `;
      }
      if (data.exposure_yn != null) {
        sql += `, exposure_yn = '${data.exposure_yn}' `;
      }

      if (data.file) {
        for (let i = 1; i <= data.file.length; i++) {
          if (data.file[i - 1] !== null) {
            // 파일이 존재하는 경우에만 SQL에 추가
            sql += `, file_${i}_id=${data.file[i - 1]}`;
          } else {
            // 파일이 null인 경우 null로 추가
            sql += `, file_${i}_id=null`;
          }
        }
      }

      sql += ` WHERE offer_id = ? AND answer_id = ? AND del_yn = 'N' AND admin_id = ?`;

      const saveAnswer = await executeQuery(sql, [
        data.answer_content,
        data.offer_id,
        data.answer_id,
        data.admin_id,
      ]);

      res.status(200).json({
        code: 200,
        message: "컨텐츠 수정에 성공하였습니다.",
        data: saveAnswer,
      });
    } catch (err) {
      let message;

      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },
  answer: async (req, res) => {
    try {
      let { offer_id } = req.params;

      if (!offer_id) {
        res.status(400).json({ code: 400, message: "견적내역 id가 없습니다." });
        return;
      }

      console.log(offer_id);

      let sql = `SELECT answer_id, answer_content 
                  FROM tbl_offer_answer
                  WHERE offer_id = ?`;

      const [response] = await executeQuery(sql, [offer_id]);

      if (!response) {
        res.status(404).json({
          code: 404,
          message: "견적내역에 대한 답변을 찾을 수 없습니다.",
        });
        return;
      }

      sql = `SELECT file_1_id, file_2_id, file_3_id, file_4_id, file_5_id
          FROM tbl_offer_answer
          WHERE offer_id = ?`;

      const [file_id] = await executeQuery(sql, [offer_id]);

      let file = [];
      if (file_id) {
        const ids = Object.values(file_id);

        sql = `SELECT f.file_id, f.change_name
              FROM tbl_file f
              WHERE f.file_id IN (`;

        for (let i = 0; i < ids.length; i++) {
          if (i != ids.length - 1) {
            sql += `${ids[i]}, `;
          } else {
            sql += `${ids[i]})`;
          }
        }
        file = await executeQuery(sql);
      }

      res.status(200).json({
        message: "답변 조회에 성공했습니다.",
        data: { response, file },
      });
    } catch (err) {
      let message;

      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },
};

module.exports = offerService;
