const connection = require("../../config/db");
const { executeQuery } = require("../repository");
const fs = require("fs");

const communityService = {
  searchQna: async (req, res) => {
    try {
      if (!req.session.user) {
        res
          .status(401)
          .json({ code: 401, message: "로그인 정보가 존재하지 않습니다." });
        return;
      }
      const dto = req.body;
      const param = [];

      let sql = `SELECT c.content_id, c.reg_user, c.title, c.admin_state, a.mod_date, c.reg_date, c.category_id
        FROM tbl_commu c
        LEFT JOIN tbl_commu_answer a ON c.content_id = a.content_id `;

      let where = `where 
          (c.category_id = 1) AND
          (c.reg_date between ? AND ?)
          AND ((c.reg_user LIKE concat('%',?,'%')) OR (c.title LIKE concat('%',?,'%'))) `;

      param.push(
        dto.start_date,
        dto.end_date,
        dto.search_word,
        dto.search_word
      );

      let admin_state = "(";
      if (dto.admin_state.length != 0) {
        for (let i = 0; i < dto.admin_state.length; i++) {
          admin_state += `?`;
          param.push(dto.admin_state[i]);
          if (i != dto.admin_state.length - 1) {
            admin_state += `, `;
          } else {
            where += `AND c.admin_state in ${admin_state}) `;
          }
        }
      }

      const response = await executeQuery(
        sql + where + "ORDER BY reg_date DESC;",
        param
      );
      const [count] = await executeQuery(
        "SELECT COUNT(*) AS count FROM tbl_commu c " + where,
        param
      );

      res.status(200).json({
        code: 200,
        message: "묻고 답하기 검색에 성공하였습니다.",
        data: { response, count: count.count },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  searchPresentation: async (req, res) => {
    try {
      if (!req.session.user) {
        res
          .status(401)
          .json({ code: 401, message: "로그인 정보가 존재하지 않습니다." });
        return;
      }
      const dto = req.body;

      let sql = `SELECT c.content_id, c.reg_user, c.presentation_org_name, c.title, c.admin_state, a.mod_date, c.reg_date , c.presentation_hope_date, c.category_id
        FROM tbl_commu c 
        LEFT JOIN tbl_commu_answer a ON c.content_id = a.content_id `;

      let where = `where 
          (c.category_id = 2) AND
          (c.reg_date between '${dto.start_date}' AND '${dto.end_date}')
          AND ((c.reg_user LIKE '%${dto.search_word}%') OR (c.title LIKE '%${dto.search_word}%')) `;

      let admin_state = "(";
      if (dto.admin_state.length != 0) {
        for (let i = 0; i < dto.admin_state.length; i++) {
          admin_state += `'${dto.admin_state[i]}'`;
          if (i != dto.admin_state.length - 1) {
            admin_state += `, `;
          } else {
            where += `AND c.admin_state in ${admin_state}) `;
          }
        }
      }

      const response = await executeQuery(
        sql + where + "ORDER BY reg_date DESC;"
      );
      const [count] = await executeQuery(
        "SELECT COUNT(*) AS count FROM tbl_commu c " + where
      );

      res.status(200).json({
        code: 200,
        message: "설명회 요청 검색에 성공하였습니다.",
        data: { response, count: count.count },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  searchReview: async (req, res) => {
    try {
      if (!req.session.user) {
        res
          .status(401)
          .json({ code: 401, message: "로그인 정보가 존재하지 않습니다." });
        return;
      }
      const dto = req.body;

      let sql = `SELECT content_id, title, exposure_yn, reg_date, category_id
        FROM tbl_commu `;

      let where = `where 
          (category_id = 3) AND
          (reg_date between '${dto.start_date}' AND '${dto.end_date}')
          AND (title LIKE '%${dto.search_word}%') `;

      if (dto.exposure_yn == "Y") {
        where += `AND (exposure_yn = 'Y') `;
      } else if (dto.exposure_yn == "N") {
        where += `AND (exposure_yn = 'N') `;
      }

      const response = await executeQuery(
        sql + where + "ORDER BY reg_date DESC;"
      );
      const [count] = await executeQuery(
        "SELECT COUNT(*) AS count FROM tbl_commu " + where
      );

      res.status(200).json({
        code: 200,
        message: "묻고 답하기 검색에 성공하였습니다.",
        data: { response, count: count.count },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  admin_select: async (req, res) => {
    // 조회
    try {
      const { content_id } = req.params;

      if (req.session.user) {
        if (req.session.user == undefined) {
          message = "유저 세션이 존재하지 않습니다.";
        } else {
          message = "에러가 발생하였습니다.";
        }
      }

      let sql;

      if (content_id == null) {
        sql = `SELECT * FROM tbl_commu WHERE del_yn = 'N'`;
      } else {
        sql = `
              SELECT 
                  cm.*,
                  fl1.url AS file_main_id_url,
                  fl2.url AS file_1_id_url,
                  fl3.url AS file_2_id_url,
                  fl4.url AS file_3_id_url,
                  fl5.url AS file_4_id_url,
                  fl1.origin_name AS file_main_id_origin_name,
                  fl2.origin_name AS file_1_id_origin_name,
                  fl3.origin_name AS file_2_id_origin_name,
                  fl4.origin_name AS file_3_id_origin_name,
                  fl5.origin_name AS file_4_id_origin_name,
                  if(aw.answer_id IS NOT NULL, 'Y', 'N') AS answer_yn,
                  if(aw.answer_id IS NOT NULL, aw.reg_date, NULL) AS answer_date,
                  if(aw.answer_id IS NOT NULL, aw.mod_date, NULL) AS answer_mod_date,
                  aw.answer_id,
                  aw.answer_content AS answer_detail,
                  awfl1.url AS aw_file_main_id_url,
                  awfl2.url AS aw_file_1_id_url,
                  awfl3.url AS aw_file_2_id_url,
                  awfl4.url AS aw_file_3_id_url,
                  awfl5.url AS aw_file_4_id_url,
                  awfl1.origin_name AS file_main_id_origin_name,
                  awfl2.origin_name AS file_1_id_origin_name,
                  awfl3.origin_name AS file_2_id_origin_name,
                  awfl4.origin_name AS file_3_id_origin_name,
                  awfl5.origin_name AS file_4_id_origin_name
              FROM tbl_commu cm
              LEFT JOIN tbl_commu_answer aw ON aw.content_id = cm.content_id
              LEFT JOIN tbl_file awfl1 ON awfl1.file_id = aw.file_1_id AND awfl1.del_yn = 'N'
              LEFT JOIN tbl_file awfl2 ON awfl2.file_id = aw.file_2_id AND awfl2.del_yn = 'N'
              LEFT JOIN tbl_file awfl3 ON awfl3.file_id = aw.file_3_id AND awfl3.del_yn = 'N'
              LEFT JOIN tbl_file awfl4 ON awfl4.file_id = aw.file_4_id AND awfl4.del_yn = 'N'
              LEFT JOIN tbl_file awfl5 ON awfl5.file_id = aw.file_5_id AND awfl5.del_yn = 'N'
              LEFT JOIN tbl_file fl1 ON fl1.file_id = cm.file_1_id AND fl1.del_yn = 'N'
              LEFT JOIN tbl_file fl2 ON fl2.file_id = cm.file_2_id AND fl2.del_yn = 'N'
              LEFT JOIN tbl_file fl3 ON fl3.file_id = cm.file_3_id AND fl3.del_yn = 'N'
              LEFT JOIN tbl_file fl4 ON fl4.file_id = cm.file_4_id AND fl4.del_yn = 'N'
              LEFT JOIN tbl_file fl5 ON fl5.file_id = cm.file_5_id AND fl5.del_yn = 'N'
              WHERE cm.del_yn = 'N' AND cm.content_id = ?`;
      }

      const response = await executeQuery(sql, [content_id]);
      console.log(sql);
      res.status(200).json({
        code: 200,
        message: "컨텐츠 조회에 성공하였습니다.",
        data: response,
      });

      console.log(response);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  presentation_select: async (req, res) => {
    try {
      const { content_id } = req.params;

      let sql;

      if (content_id == null) {
        sql = `SELECT * FROM tbl_commu WHERE del_yn = 'N' and category_id = 2`;
      } else {
        sql = `
              SELECT 
                  cm.*,
                  fl1.url AS file_main_id_url,
                  fl2.url AS file_1_id_url,
                  fl3.url AS file_2_id_url,
                  fl1.origin_name AS file_main_id_origin_name,
                  fl2.origin_name AS file_1_id_origin_name,
                  fl3.origin_name AS file_2_id_origin_name
              FROM tbl_commu cm
              LEFT JOIN tbl_file fl1 ON fl1.file_id = cm.file_1_id AND fl1.del_yn = 'N'
              LEFT JOIN tbl_file fl2 ON fl2.file_id = cm.file_2_id AND fl2.del_yn = 'N'
              LEFT JOIN tbl_file fl3 ON fl3.file_id = cm.file_3_id AND fl3.del_yn = 'N'
              WHERE cm.del_yn = 'N' AND cm.content_id = ?`;
      }

      const response = await executeQuery(sql, [content_id]);
      console.log(sql);
      res.status(200).json({
        code: 200,
        message: "컨텐츠 조회에 성공하였습니다.",
        data: response,
      });

      console.log(response);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  ask_select: async (req, res) => {
    try {
      const { content_id } = req.params;

      let sql;

      if (content_id == null) {
        sql = `SELECT * FROM tbl_commu WHERE del_yn = 'N' and category_id = 1`;
      } else {
        sql = `
              SELECT 
                  cm.*,
                  fl1.url AS file_main_id_url,
                  fl2.url AS file_1_id_url,
                  fl3.url AS file_2_id_url
                  fl1.origin_name AS file_main_id_origin_name,
                  fl2.origin_name AS file_1_id_origin_name,
                  fl3.origin_name AS file_2_id_origin_name
              FROM tbl_commu cm
              LEFT JOIN tbl_file fl1 ON fl1.file_id = cm.file_1_id AND fl1.del_yn = 'N'
              LEFT JOIN tbl_file fl2 ON fl2.file_id = cm.file_2_id AND fl2.del_yn = 'N'
              LEFT JOIN tbl_file fl3 ON fl3.file_id = cm.file_3_id AND fl3.del_yn = 'N'
              WHERE cm.del_yn = 'N' AND cm.content_id = ?`;
      }

      const response = await executeQuery(sql, [content_id]);
      console.log(sql);
      res.status(200).json({
        code: 200,
        message: "컨텐츠 조회에 성공하였습니다.",
        data: response,
      });

      console.log(response);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  review_select: async (req, res) => {
    try {
      const { content_id } = req.params;

      let sql;

      if (content_id == null) {
        sql = `SELECT * FROM tbl_commu WHERE del_yn = 'N' and category_id = 3`;
      } else {
        sql = `
              SELECT 
                  cm.*,
                  fl1.url AS file_main_id_url,
                  fl2.url AS file_1_id_url,
                  fl3.url AS file_2_id_url,
                  fl4.url AS file_3_id_url,
                  fl5.url AS file_4_id_url,
                  fl1.origin_name AS file_main_id_origin_name,
                  fl2.origin_name AS file_1_id_origin_name,
                  fl3.origin_name AS file_2_id_origin_name,
                  fl4.origin_name AS file_3_id_origin_name,
                  fl5.origin_name AS file_4_id_origin_name
              FROM tbl_commu cm
              LEFT JOIN tbl_file fl1 ON fl1.file_id = cm.file_1_id AND fl1.del_yn = 'N'
              LEFT JOIN tbl_file fl2 ON fl2.file_id = cm.file_2_id AND fl2.del_yn = 'N'
              LEFT JOIN tbl_file fl3 ON fl3.file_id = cm.file_3_id AND fl3.del_yn = 'N'
              LEFT JOIN tbl_file fl4 ON fl4.file_id = cm.file_4_id AND fl4.del_yn = 'N'
              LEFT JOIN tbl_file fl5 ON fl5.file_id = cm.file_5_id AND fl5.del_yn = 'N'
              WHERE cm.del_yn = 'N' AND cm.content_id = ?`;
      }

      const response = await executeQuery(sql, [content_id]);
      console.log(sql);
      res.status(200).json({
        code: 200,
        message: "컨텐츠 조회에 성공하였습니다.",
        data: response,
      });

      console.log(response);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  insert_review: async (req, res) => {
    try {
      const data = {
        admin_id: req.session.user.id,
        category_id: 3,
        //category_name: "참가자 리뷰",
        title: req.body.title,
        reg_user: req.body.reg_user,
        content: req.body.content,
        review_link: req.body.review_link,
        //mod_date: req.body.mod_date,
        reg_date: req.body.reg_date,
        exposure_yn: req.body.exposure_yn,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        file_5_id: req.body.file_5_id,
        state: "",
        admin_state: "",
        answer_yn: "",
      };

      if (req.session.user == undefined) {
        message = "유저 세션이 존재하지 않습니다.";
      } else {
        message = "에러가 발생하였습니다.";
      }

      const sql = `INSERT INTO tbl_commu SET ?`;
      await executeQuery(sql, data);

      res.status(200).json({
        code: 200,
        message: "컨텐츠 등록에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
      let message;
      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },

  delete_review: async (req, res) => {
    try {
      const data = {
        admin_id: req.body.admin_id,
        content_id: req.body.content_id,
      };
      let sql = `UPDATE tbl_commu SET del_yn = 'Y' WHERE admin_id = ? and content_id = ? `;

      let response = await executeQuery(sql, [data.admin_id, data.content_id]);

      console.log(sql);
      sql = `UPDATE tbl_file fl LEFT JOIN tbl_commu cm ON cm.admin_id = ? and cm.content_id =?`;

      sql += `
         SET fl.del_yn = 'Y'
        WHERE fl.file_id IN (cm.file_1_id, cm.file_2_id, cm.file_3_id, cm.file_4_id ,cm.file_5_id)
      `;
      response = await executeQuery(sql, [data.admin_id, data.content_id]);

      sql = `
        SELECT 
          fl.file_id,
          fl.url
        FROM tbl_file fl 
        JOIN tbl_commu cm 
        ON cm.admin_id = 2
        AND cm.content_id IN (
      `;
      for (i = 0; i < data.content_id.length; i++) {
        sql += data.content_id[i];
        if (i + 1 < data.content_id.length) {
          sql += `, `;
        }
      }
      sql += `
        ) WHERE fl.file_id IN (cm.file_1_id, cm.file_2_id, cm.file_3_id, cm.file_4_id ,cm.file_5_id)
      `;
      response = await executeQuery(sql);
      console.log("Query Response:", response);

      let filePath;
      if (response[0]) {
        // 이미지 존재 여부 확인
        try {
          for (let i = 0; i < response.length; i++) {
            filePath = response[i].url;

            // 파일 삭제
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(err);
              }
            });
          }
          res.status(200).json({
            code: 200,
            message: "컨텐츠 삭제 성공",
            data: response,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            code: 500,
            message: "이미지 삭제 실패",
            data: err,
          });
        }
      } else {
        res.status(200).json({
          code: 200,
          message: "컨텐츠 삭제 성공",
          data: true,
        });
      }
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

  update_review: async (req, res) => {
    try {
      // 수정
      const data = {
        admin_id: req.session.user.id,
        category_id: 3,
        category_name: "참가자 리뷰",
        title: req.body.title,
        reg_user: req.body.reg_user,
        content: req.body.content,
        review_link: req.body.review_link,
        exposure_yn: req.body.exposure_yn,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        file_5_id: req.body.file_5_id,
        content_id: req.body.content_id,
        state: "",
        answer_yn: "",
      };

      let sql = `UPDATE tbl_commu SET category_id =  COALESCE(?, category_id), title = COALESCE(?, title),content = COALESCE(?, content)`;
      if (data.reg_date != null) {
        sql += `, reg_date = '${data.reg_date}' `;
      }
      if (data.exposure_yn != null) {
        sql += `, exposure_yn = '${data.exposure_yn}' `;
      }
      sql += ` 
        , file_1_id = COALESCE(?, file_1_id), file_2_id = COALESCE(?, file_2_id), file_3_id = COALESCE(?, file_3_id), file_4_id = COALESCE(?, file_4_id), file_5_id = COALESCE(?, file_5_id), mod_date =now()
        WHERE content_id = ? AND admin_id = ? AND del_yn = 'N'
      `;

      const saveAnswer = await executeQuery(sql, [
        data.category_id,
        data.title,
        data.content,
        data.file_main_id,
        data.file_1_id,
        data.file_2_id,
        data.file_3_id,
        data.file_4_id,
        data.content_id,
        data.admin_id,
      ]);

      res.status(200).json({
        code: 200,
        message: "컨텐츠 수정에 성공하였습니다.",
        data: saveAnswer,
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

  //일반 사용자

  select: async (req, res) => {
    // 조회
    try {
      const { content_id } = req.params;

      if (req.session.user) {
        if (req.session.user == undefined) {
          message = "유저 세션이 존재하지 않습니다.";
        } else {
          message = "에러가 발생하였습니다.";
        }
      }

      let sql;

      if (content_id == null) {
        sql = `SELECT * FROM tbl_commu WHERE del_yn = 'N'`;
      } else {
        sql = `
            SELECT 
                cm.*,
                fl1.url AS file_main_id_url,
                fl2.url AS file_1_id_url,
                fl3.url AS file_2_id_url,
                fl4.url AS file_3_id_url,
                fl5.url AS file_4_id_url,
                fl1.origin_name AS file_main_id_origin_name,
                fl2.origin_name AS file_1_id_origin_name,
                fl3.origin_name AS file_2_id_origin_name,
                fl4.origin_name AS file_3_id_origin_name,
                fl5.origin_name AS file_4_id_origin_name,
                if(aw.answer_id IS NOT NULL, 'Y', 'N') AS answer_yn,
                if(aw.answer_id IS NOT NULL, aw.reg_date, NULL) AS answer_date,
                if(aw.answer_id IS NOT NULL, aw.mod_date, NULL) AS answer_mod_date,
                aw.answer_id,
                aw.answer_content AS answer_detail,
                awfl1.url AS aw_file_main_id_url,
                awfl2.url AS aw_file_1_id_url,
                awfl3.url AS aw_file_2_id_url,
                awfl4.url AS aw_file_3_id_url,
                awfl5.url AS aw_file_4_id_url,
                awfl1.origin_name AS file_main_id_origin_name,
                awfl2.origin_name AS file_1_id_origin_name,
                awfl3.origin_name AS file_2_id_origin_name,
                awfl4.origin_name AS file_3_id_origin_name,
                awfl5.origin_name AS file_4_id_origin_name
            FROM tbl_commu cm
            LEFT JOIN tbl_commu_answer aw ON aw.content_id = cm.content_id
            LEFT JOIN tbl_file awfl1 ON awfl1.file_id = aw.file_1_id AND awfl1.del_yn = 'N'
            LEFT JOIN tbl_file awfl2 ON awfl2.file_id = aw.file_2_id AND awfl2.del_yn = 'N'
            LEFT JOIN tbl_file awfl3 ON awfl3.file_id = aw.file_3_id AND awfl3.del_yn = 'N'
            LEFT JOIN tbl_file awfl4 ON awfl4.file_id = aw.file_4_id AND awfl4.del_yn = 'N'
            LEFT JOIN tbl_file awfl5 ON awfl5.file_id = aw.file_5_id AND awfl5.del_yn = 'N'
            LEFT JOIN tbl_file fl1 ON fl1.file_id = cm.file_1_id AND fl1.del_yn = 'N'
            LEFT JOIN tbl_file fl2 ON fl2.file_id = cm.file_2_id AND fl2.del_yn = 'N'
            LEFT JOIN tbl_file fl3 ON fl3.file_id = cm.file_3_id AND fl3.del_yn = 'N'
            LEFT JOIN tbl_file fl4 ON fl4.file_id = cm.file_4_id AND fl4.del_yn = 'N'
            LEFT JOIN tbl_file fl5 ON fl5.file_id = cm.file_5_id AND fl5.del_yn = 'N'
            WHERE cm.del_yn = 'N' AND cm.content_id = ?`;
      }

      const response = await executeQuery(sql, [content_id]);
      console.log(sql);
      res.status(200).json({
        code: 200,
        message: "컨텐츠 조회에 성공하였습니다.",
        data: response,
      });

      console.log(response);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
  // 전체 조회 => category_id에 따라 필요한대로 response 내려줌
  findAll: async (req, res) => {
    try {
      const { category_id } = req.params;

      if (!category_id) {
        res.status(400).json({ message: `id가 없습니다.`, code: 400 });
        return;
      }

      let sql, response;

      if (category_id == 1) {
        sql = `
            SELECT c.content_id, c.title, c.reg_user, c.reg_date, c.state, c.password, a.mod_date
              FROM tbl_commu c
              LEFT JOIN tbl_commu_answer a ON c.content_id = a.content_id
              WHERE c.category_id = 1
              ORDER BY c.reg_date DESC;`;

        response = await executeQuery(sql);
      } else if (category_id == 2) {
        sql = `
            SELECT c.content_id, c.title, c.presentation_org_name, c.reg_date, c.state, c.password, a.mod_date
              FROM tbl_commu c
              LEFT JOIN tbl_commu_answer a ON c.content_id = a.content_id
              WHERE c.category_id = 2
              ORDER BY c.reg_date DESC;`;

        response = await executeQuery(sql);
      } else if (category_id == 3) {
        sql = `
            SELECT c.content_id, c.title, c.reg_user, c.reg_date 
              FROM tbl_commu c 
              WHERE c.category_id = 3 AND c.exposure_yn = 'Y'
              ORDER BY c.reg_date DESC;`;

        response = await executeQuery(sql);
      }

      const [count] = await executeQuery(
        `SELECT COUNT(*) as count FROM tbl_commu c WHERE c.category_id = ${category_id}`
      );

      res.status(200).json({
        code: 200,
        message: "컨텐츠 전체 조회에 성공하였습니다.",
        data: { response, count: count.count },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  // 묻고답하기 상세 조회
  findOneQna: async (req, res) => {
    try {
      const { content_id } = req.params;

      if (!content_id) {
        res.status(400).json({ message: `id가 없습니다.`, code: 400 });
        return;
      }

      let sql;

      sql = `SELECT c.content_id, c.reg_user, c.reg_date, c.title, c.content, c.category_id, c.state, c.password, c.admin_state
          FROM tbl_commu c
          WHERE c.content_id = ?`;

      const [response] = await executeQuery(sql, [content_id]);

      if (!response) {
        res
          .status(404)
          .json({ message: `해당 글을 찾을 수 없습니다.`, code: 404 });
        return;
      }

      if (response.category_id != 1) {
        res.status(400).json({ message: `묻고 답하기가 아닙니다.`, code: 400 });
        return;
      }

      sql = `SELECT c.file_1_id, c.file_2_id, c.file_3_id, c.file_4_id, c.file_5_id
        FROM tbl_commu c
        WHERE c.content_id = ?`;

      const [file_id] = await executeQuery(sql, [content_id]);
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
        code: 200,
        message: "묻고 답하기 상세 조회에 성공하였습니다.",
        data: { response, file },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  //  설명회 요청 조회
  findOneSeminar: async (req, res) => {
    try {
      const { content_id } = req.params;

      if (!content_id) {
        res.status(400).json({ message: `id가 없습니다.`, code: 400 });
        return;
      }

      let sql;

      sql = `SELECT c.content_id, c.title, c.reg_user, c.reg_date, c.content, c.state, c.password, c.admin_state,
                c.category_id, c.presentation_org_name, c.presentation_place,
                c.presentation_hope_date, c.presentation_email1
              FROM tbl_commu c
              WHERE c.content_id = ?`;

      const [response] = await executeQuery(sql, [content_id]);

      if (!response) {
        res
          .status(404)
          .json({ message: `해당 글을 찾을 수 없습니다.`, code: 404 });
        return;
      }

      if (response.category_id != 2) {
        res.status(400).json({ message: `설명회 요청이 아닙니다.`, code: 400 });
        return;
      }

      sql = `SELECT c.file_1_id, c.file_2_id, c.file_3_id, c.file_4_id, c.file_5_id
        FROM tbl_commu c
        WHERE c.content_id = ?`;

      const [file_id] = await executeQuery(sql, [content_id]);
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
        code: 200,
        message: "설명회 요청 상세 조회에 성공하였습니다.",
        data: { response, file },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },

  // 참가자 리뷰 조회
  findOneReview: async (req, res) => {
    try {
      const { content_id } = req.params;

      if (!content_id) {
        res.status(400).json({ message: `id가 없습니다.`, code: 400 });
        return;
      }

      let sql;

      sql = `SELECT c.content_id, c.title, c.reg_user, c.reg_date, c.content, c.review_link, c.category_id, c.exposure_yn, c.admin_state
              FROM tbl_commu c
              WHERE c.content_id = ?`;

      const [response] = await executeQuery(sql, [content_id]);

      if (!response) {
        res
          .status(404)
          .json({ message: `해당 글을 찾을 수 없습니다.`, code: 404 });
        return;
      }

      if (response.category_id != 3) {
        res.status(400).json({ message: `리뷰가 아닙니다.`, code: 400 });
        return;
      }

      sql = `SELECT c.file_1_id, c.file_2_id, c.file_3_id, c.file_4_id, c.file_5_id
        FROM tbl_commu c
        WHERE c.content_id = ?`;

      const [file_id] = await executeQuery(sql, [content_id]);
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
        code: 200,
        message: "리뷰 상세 조회에 성공하였습니다.",
        data: { response, file },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
  // ** 묻고 답하기 작성
  saveQna: async (req, res) => {
    try {
      const dto = req.body;

      const keys = Object.keys(dto);
      keys.forEach((key) => {
        if (typeof dto[key] == "string") {
          dto[key] = dto[key].includes("'")
            ? dto[key].replaceAll("'", "''")
            : dto[key];
        }
      });

      let sql, values;

      if (dto.category_id != 1) {
        res
          .status(400)
          .json({ message: "묻고 답하기 등록이가 아닙니다.", code: 400 });
        return;
      }

      sql = `INSERT INTO tbl_commu(category_id, reg_date, password, reg_user, title, content, state`;
      values = `VALUES (${dto.category_id}, NOW(), '${dto.password.trim()}', 
      '${dto.reg_user}', '${dto.title}', '${dto.content}', 'w'`;

      for (let i = 1; i <= dto.file.length; i++) {
        sql += `, file_${i}_id`;
        values += `, ${dto.file[i - 1]}`;
      }

      sql += `) `;
      values += `);`;
      await executeQuery(sql + values);

      res
        .status(200)
        .json({ message: "묻고 답하기 등록에 성공했습니다.", code: 200 });
    } catch (err) {
      let message;

      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },

  savePresentation: async (req, res) => {
    try {
      const dto = req.body;

      const keys = Object.keys(dto);
      keys.forEach((key) => {
        if (typeof dto[key] == "string") {
          dto[key] = dto[key].includes("'")
            ? dto[key].replaceAll("'", "''")
            : dto[key];
        }
      });

      let sql, values;

      if (dto.category_id != 2) {
        res
          .status(400)
          .json({ message: "설명회 요청 등록이 아닙니다.", code: 400 });
        return;
      }

      sql = `INSERT INTO tbl_commu(category_id, reg_date, password, presentation_org_name, presentation_place, presentation_hope_date, presentation_email1, title, content, state`;
      values = `VALUES (${dto.category_id}, NOW(), '${dto.password.trim()}', 
      '${dto.presentation_org_name}', '${dto.presentation_place}', 
      '${dto.presentation_hope_date}', '${dto.presentation_email}', 
      '${dto.title}', '${dto.content}', 'w'`;

      for (let i = 1; i <= dto.file.length; i++) {
        sql += `, file_${i}_id`;
        values += `, ${dto.file[i - 1]}`;
      }

      sql += `) `;
      values += `);`;
      await executeQuery(sql + values);

      res
        .status(200)
        .json({ message: "설명회 요청 등록에 성공했습니다.", code: 200 });
    } catch (err) {
      let message;

      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },

  saveReview: async (req, res) => {
    try {
      const dto = req.body;

      const keys = Object.keys(dto);
      keys.forEach((key) => {
        if (typeof dto[key] == "string") {
          dto[key] = dto[key].includes("'")
            ? dto[key].replaceAll("'", "''")
            : dto[key];
        }
      });

      let sql, values;

      if (dto.category_id != 3) {
        res.status(400).json({ message: "리뷰 등록이 아닙니다.", code: 400 });
        return;
      }

      sql = `INSERT INTO tbl_commu(category_id, reg_date, reg_user, title, content, review_link, exposure_yn`;
      values = `VALUES (${dto.category_id}, '${dto.reg_date}', '${dto.reg_user}', '${dto.title}', '${dto.content}', '${dto.review_link}', '${dto.exposure_yn}'`;

      for (let i = 1; i <= dto.file.length; i++) {
        sql += `, file_${i}_id`;
        values += `, ${dto.file[i - 1]}`;
      }
      ``;
      sql += `) `;
      values += `);`;
      await executeQuery(sql + values);

      res.status(200).json({ message: "리뷰 등록에 성공했습니다.", code: 200 });
    } catch (err) {
      let message;

      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },

  updateQna: async (req, res) => {
    try {
      const dto = req.body;

      const keys = Object.keys(dto);
      keys.forEach((key) => {
        if (typeof dto[key] == "string") {
          dto[key] = dto[key].includes("'")
            ? dto[key].replaceAll("'", "''")
            : dto[key];
        }
      });

      let sql;

      if (!dto.content_id) {
        res.status(400).json({ message: `id가 없습니다.`, code: 400 });
        return;
      }

      sql = `SELECT category_id from tbl_commu where content_id=${dto.content_id}`;

      const [findContent] = await executeQuery(sql);

      if (!findContent) {
        res.status(404).json({
          message: `해당 글을 찾을 수 없습니다.`,
          code: 404,
        });
        return;
      }

      if (findContent.category_id != 1) {
        res.status(400).json({
          message: `묻고 답하기가 아닙니다.`,
          code: 400,
        });
        return;
      }

      sql = `UPDATE tbl_commu SET password='${dto.password.trim()}', 
      reg_user='${dto.reg_user}', title='${dto.title}', 
      content='${dto.content}', mod_date=NOW()`;

      for (let i = 1; i <= dto.file.length; i++) {
        if (dto.file[i - 1] !== null) {
          // 파일이 존재하는 경우에만 SQL에 추가
          sql += `, file_${i}_id=${dto.file[i - 1]}`;
        } else {
          // 파일이 null인 경우 null로 추가
          sql += `, file_${i}_id=null`;
        }
      }

      sql += ` where content_id=${dto.content_id}`;

      await executeQuery(sql);

      res
        .status(200)
        .json({ message: "묻고 답하기 수정에 성공했습니다.", code: 200 });
    } catch (err) {
      let message;

      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },
  updatePresentaion: async (req, res) => {
    try {
      const dto = req.body;

      const keys = Object.keys(dto);
      keys.forEach((key) => {
        if (typeof dto[key] == "string") {
          dto[key] = dto[key].includes("'")
            ? dto[key].replaceAll("'", "''")
            : dto[key];
        }
      });

      let sql;

      if (!dto.content_id) {
        res.status(400).json({ message: `id가 없습니다.`, code: 400 });
        return;
      }

      sql = `SELECT category_id from tbl_commu where content_id=${dto.content_id}`;

      const [findContent] = await executeQuery(sql);

      if (!findContent) {
        res.status(404).json({
          message: `해당 글을 찾을 수 없습니다.`,
          code: 404,
        });
        return;
      }

      if (findContent.category_id != 2) {
        res.status(400).json({
          message: `설명회 요청이 아닙니다.`,
          code: 400,
        });
        return;
      }

      sql = `UPDATE tbl_commu SET
        password='${dto.password.trim()}', presentation_org_name='${
        dto.presentation_org_name
      }', 
      presentation_place='${dto.presentation_place}', presentation_hope_date='${
        dto.presentation_hope_date
      }', presentation_email1='${dto.presentation_email1}', title='${
        dto.title
      }', content='${dto.content}', mod_date=NOW()`;

      for (let i = 1; i <= dto.file.length; i++) {
        if (dto.file[i - 1] !== null) {
          // 파일이 존재하는 경우에만 SQL에 추가
          sql += `, file_${i}_id=${dto.file[i - 1]}`;
        } else {
          // 파일이 null인 경우 null로 추가
          sql += `, file_${i}_id=null`;
        }
      }

      sql += ` where content_id=${dto.content_id}`;

      await executeQuery(sql);

      res
        .status(200)
        .json({ message: "설명회 요청 수정에 성공했습니다.", code: 200 });
    } catch (err) {
      let message;

      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },

  updateReview: async (req, res) => {
    try {
      const dto = req.body;

      const keys = Object.keys(dto);
      keys.forEach((key) => {
        if (typeof dto[key] == "string") {
          dto[key] = dto[key].includes("'")
            ? dto[key].replaceAll("'", "''")
            : dto[key];
        }
      });

      let sql;

      if (!dto.content_id) {
        res.status(400).json({ message: `id가 없습니다.`, code: 400 });
        return;
      }

      sql = `SELECT category_id from tbl_commu where content_id=${dto.content_id}`;

      const [findContent] = await executeQuery(sql);

      if (!findContent) {
        res.status(404).json({
          message: `해당 글을 찾을 수 없습니다.`,
          code: 404,
        });
        return;
      }

      if (findContent.category_id != 3) {
        res.status(400).json({
          message: `리뷰가 아닙니다.`,
          code: 400,
        });
        return;
      }

      sql = `UPDATE tbl_commu SET reg_user='${dto.reg_user}', title='${dto.title}', content='${dto.content}', review_link='${dto.review_link}', exposure_yn='${dto.exposure_yn}', mod_date=NOW(), reg_date='${dto.reg_date}'`;

      for (let i = 1; i <= dto.file.length; i++) {
        sql += `, file_${i}_id=${dto.file[i - 1]}`;
      }

      sql += ` where content_id=${dto.content_id}`;

      await executeQuery(sql);

      res.status(200).json({ message: "리뷰 수정에 성공했습니다.", code: 200 });
    } catch (err) {
      let message;

      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },
  update: async (req, res) => {
    // 수정
    try {
      const category_id = req.body.category_id;
      const category_name = req.body.category_name;
      const data = {
        category_id: category_id,
        category_name: category_name,
        content_id: 1,
        reg_user: req.body.reg_user,
        secret_yn: req.body.secret_yn,
        title: req.body.title,
        password: req.body.password,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        file_5_id: req.body.file_5_id,
        content: req.body.content,
      };

      if (category_id === "2" || category_name === "설명회 요청") {
        (data.presentation_org_name = req.body.presentation_org_name),
          (data.presentation_hope_date = req.body.presentation_hope_date),
          (data.presentation_place = req.body.presentation_place),
          (data.presentation_email1 = req.body.presentation_email1),
          (data.presentation_email2 = req.body.presentation_email2);
      } else {
        delete data.presentation_org_name;
        delete data.presentation_hope_date;
        delete data.presentation_place;
        delete data.presentation_email1;
        delete data.presentation_email2;
      }

      let sql = `UPDATE tbl_commu SET category_id = COALESCE(?, category_id), category_name = COALESCE(?, category_name), password = COALESCE(?, password), title = COALESCE(?, title), content = COALESCE(?, content), reg_user = COALESCE(?, reg_user)`;
      if (data.reg_date != null) {
        sql += `, reg_date = '${data.reg_date}' `;
      }
      if (data.exposure_yn != null) {
        sql += `, exposure_yn = '${data.exposure_yn}' `;
      }
      sql += ` 
      , file_1_id = COALESCE(?, file_1_id), file_2_id = COALESCE(?, file_2_id), file_3_id = COALESCE(?, file_3_id), file_4_id = COALESCE(?, file_4_id), file_5_id = COALESCE(?, file_5_id), mod_date =now()
      WHERE content_id = ? AND del_yn = 'N'
    `;

      const saveAnswer = await executeQuery(sql, [
        data.category_id,
        data.category_name,
        data.password,
        data.title,
        data.content,
        data.reg_user,
        data.file_1_id,
        data.file_2_id,
        data.file_3_id,
        data.file_4_id,
        data.file_5_id,
        data.content_id,
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
  delete: async (req, res) => {
    // 삭제
    try {
      const { content_id } = req.params;
      /*
      let sql = `SELECT file_1_id, file_2_id, file_3_id, file_4_id, file_5_id FROM tbl_commu WHERE content_id = ?`;

      const [file_id] = await executeQuery(sql, [content_id]);
      const ids = Object.values(file_id);

      sql = `SELECT f.file_id, f.url
      FROM tbl_file f
      WHERE f.file_id IN (`;

      for (let i = 0; i < ids.length; i++) {
        if (i != ids.length - 1) {
          sql += `${ids[i]}, `;
        } else {
          sql += `${ids[i]})`;
        }
      }

      const url = await executeQuery(sql);

      for (let i = 0; i < url.length; i++) {
        filePath = url[i].url;
        // 파일 삭제
        fs.unlink(filePath, (err) => {
          if (err) {
            res
              .status(500)
              .json({ code: 500, message: "파일 삭제에 실패했습니다." });
            console.error(err);
          }
        });
      }
      */
      let sql = `Select content_id, state from tbl_commu where content_id = ?`;

      const [findContent] = await executeQuery(sql, [content_id]);

      if (!findContent) {
        res.state(404).json({
          code: 404,
          message: "해당 게시판을 찾을 수 없습니다.",
        });
      }

      connection.beginTransaction();

      if (findContent.state == "d") {
        sql = "delete from tbl_commu_answer WHERE content_id = ?";
        await executeQuery(sql, [content_id]);
      }

      sql = `delete from tbl_commu WHERE content_id = ? `;

      await executeQuery(sql, [content_id]);

      sql = `SELECT file_1_id, file_2_id, file_3_id, file_4_id, file_5_id FROM tbl_commu WHERE content_id = ?`;

      const [file_id] = await executeQuery(sql, [content_id]);

      if (file_id) {
        const ids = Object.values(file_id);

        sql = `delete from tbl_file WHERE file_id IN (`;

        for (let i = 0; i < ids.length; i++) {
          if (i != ids.length - 1) {
            sql += `${ids[i]}, `;
          } else {
            sql += `${ids[i]})`;
          }
        }
        await executeQuery(sql, [content_id]);
      }
      connection.commit();
      res.status(200).json({
        code: 200,
        message: "컨텐츠 삭제 성공",
      });
    } catch (err) {
      connection.rollback();
      let message;

      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },
  saveAnswer: async (req, res) => {
    try {
      if (!req.session.user) {
        res
          .status(401)
          .json({ code: 401, message: "로그인 정보가 존재하지 않습니다." });
        return;
      }

      const data = {
        admin_id: req.session.user.id,
        content_id: req.body.content_id,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        file_5_id: req.body.file_5_id,
        answer_content: req.body.answer_content,
      };

      let sql = `SELECT c.content_id, c.reg_user, c.reg_date, c.title, c.content, c.category_id, c.state, c.password
          FROM tbl_commu c
          WHERE c.content_id = ?`;

      let [response] = await executeQuery(sql, [data.content_id]);

      if (!response) {
        res
          .status(404)
          .json({ message: `해당 글을 찾을 수 없습니다.`, code: 404 });
        return;
      }

      connection.beginTransaction();

      sql = `INSERT INTO tbl_commu_answer SET 
              admin_id=${data.admin_id}, content_id=${data.content_id}, answer_content='${data.answer_content}', reg_date=NOW(),
              file_1_id=${data.file_1_id}, file_2_id=${data.file_2_id}, file_3_id=${data.file_3_id}, file_4_id=${data.file_4_id}, file_5_id=${data.file_5_id}`;
      response = await executeQuery(sql);

      let sql2 = `UPDATE tbl_commu SET admin_state = 'w' where content_id = ? `;
      response = await executeQuery(sql2, data.content_id);

      connection.commit();
      res.status(200).json({
        message: "답변등록에 성공했습니다.",
        code: 200,
      });
    } catch (err) {
      connection.rollback();
      let message;
      console.log(err);
      res.status(500).json({ message, code: 500 });
    }
  },
  uploadAnswer: async (req, res) => {
    try {
      if (!req.session.user) {
        res
          .status(401)
          .json({ code: 401, message: "로그인 정보가 존재하지 않습니다." });
        return;
      }

      const data = {
        admin_id: req.session.user.id,
        content_id: req.body.content_id,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        file_5_id: req.body.file_5_id,
        answer_content: req.body.answer_content,
      };

      let sql = `select * from tbl_commu where content_id = ${data.content_id}`;

      let [response] = await executeQuery(sql);

      // 견적서 문의 내용, 관련컨텐츠, 상담답변 이미지 가져오기
      sql = `
      SELECT
        cm.*,
        fl2.origin_name AS answer_origin_name,
        fl2.url AS answer_url
      FROM tbl_commu cm

      LEFT JOIN tbl_commu_answer aw 
      ON aw.admin_id = ?
      AND aw.answer_id = ?

      LEFT JOIN tbl_file fl2
      ON fl2.file_id = aw.file_1_id
      AND fl2.del_yn = 'N'
      WHERE cm.content_id = aw.content_id
    `;

      connection.beginTransaction();
      response = await executeQuery(sql, [data.admin_id, response.answer_id]);

      let sql2 = `UPDATE tbl_commu SET state = 'd' , answer_yn = 'Y', admin_state='d' where content_id = ? `;
      response = await executeQuery(sql2, data.content_id);

      await executeQuery(sql2, [data.content_id]);
      connection.commit();
      res.status(200).json({
        code: 200,
        message: "답변 업로드에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
      connection.rollback();
      let message;

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
        content_id: req.body.content_id,
        answer_id: req.body.answer_id,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        file_5_id: req.body.file_5_id,
        answer_content: req.body.answer_content,
      };
      let sql = `UPDATE tbl_commu_answer SET answer_content = COALESCE(?, answer_content)`;

      sql += ` 
    , file_1_id = ?,
    file_2_id = ?,
    file_3_id = ?,
     file_4_id = ?,
    file_5_id = ?,
    mod_date = now()
    WHERE content_id = ? AND answer_id = ?  AND admin_id = ? AND del_yn = 'N'
  `;

      const saveAnswer = await executeQuery(sql, [
        data.answer_content,
        data.file_1_id,
        data.file_2_id,
        data.file_3_id,
        data.file_4_id,
        data.file_5_id,
        data.content_id,
        data.answer_id,
        data.admin_id,
      ]);
      console.log(sql, data);
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
      let { content_id } = req.params;
      let sql = `SELECT a.answer_id, a.content_id, a.mod_date, d.name, a.answer_content
          FROM tbl_commu c 
          LEFT JOIN tbl_commu_answer a
            ON c.content_id = a.content_id
          LEFT JOIN tbl_admin d
            ON d.admin_id = a.admin_id
          WHERE c.content_id = ?`;

      const [response] = await executeQuery(sql, [content_id]);

      sql = `SELECT a.file_1_id, a.file_2_id, a.file_3_id, a.file_4_id, a.file_5_id
          FROM tbl_commu_answer a
          WHERE content_id = ?`;

      const [file_id] = await executeQuery(sql, [content_id]);

      let file = [];
      if (file_id) {
        const ids = Object.values(file_id);

        sql = `SELECT f.file_id, f.change_name, f.origin_name
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

module.exports = communityService;
