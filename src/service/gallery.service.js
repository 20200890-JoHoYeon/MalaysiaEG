const { executeQuery } = require("../repository");
const fs = require("fs");

const galleryService = {
  search: async (req, res) => {
    // 검색
    try {
      const { category, search_word, sort, type, exposure_yn, page, pageSize } =
        req.body;
      let { from_date, to_date } = req.body;
      const offset = (page - 1) * pageSize;
      let sql, sql2;
      sql2 = `SELECT COUNT(*) AS count FROM (`;
      sql = `
        SELECT 
          gy.*
        FROM tbl_gallery gy
        WHERE gy.del_yn = 'N'
      `;

      if (from_date != null && to_date != null) {
        from_date += " 00:00:00";
        to_date += " 23:59:59";
        sql += `AND gy.reg_date BETWEEN '${from_date}' AND '${to_date}' `;
      }

      if (category != null) {
        if (category.length === 1 && category[0] === 0) {
          // 만약 카테고리가 [0]이라면 전체 조회
        } else {
          sql += `AND gy.category IN (`;
          for (let i = 0; i < category.length; i++) {
            sql += category[i];
            if (i + 1 < category.length) {
              sql += `, `;
            }
          }
          sql += `) `;
        }
      }

      if (search_word != null) {
        sql += `AND gy.title LIKE '%${search_word}%' `;
      }

      if (type != null) {
        sql += `AND gy.type LIKE '%${type}%' `;
      }

      if (exposure_yn != null) {
        sql += `AND gy.exposure_yn IN (`;
        for (i = 0; i < exposure_yn.length; i++) {
          sql += `'` + exposure_yn[i];
          if (i + 1 < exposure_yn.length) {
            sql += `', `;
          }
        }
        sql += `') `;
      }

      sql += `ORDER BY gy.reg_date ${sort || "DESC"}, gy.gallery_id DESC `;
      sql2 += sql + `) a`;
      sql += `LIMIT ${pageSize} OFFSET ${offset}`;

      const response = await executeQuery(sql);
      const count = await executeQuery(sql2);
      let result = { gallery: response, count: count[0].count };

      res.status(200).json({
        code: 200,
        message: "컨텐츠 검색에 성공하였습니다.",
        data: result,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
  select: async (req, res) => {
    // 단일 조회
    try {
      const { gallery_id } = req.params;

      let sql;

      if (gallery_id == null) {
        throw new Error();
      } else {
        sql = `
            select 
              gallery_id,
              category, title, type, video_url, note, 
              reg_date, mod_date, 
              exposure_yn
            from tbl_gallery
            where gallery_id = ?`;
      }

      const [response] = await executeQuery(sql, [gallery_id]);

      let file = [];

      if (response.type == "사진") {
        sql = `SELECT f.file_id, f.change_name
          FROM tbl_gallery g
          LEFT JOIN tbl_file f
          ON f.file_id = g.file_main_id
          WHERE g.gallery_id = ?`;
        const [file_main] = await executeQuery(sql, [gallery_id]);
        file.push(file_main);

        sql = `SELECT g.file_1_id, g.file_2_id, g.file_3_id, g.file_4_id 
          FROM tbl_gallery g
          WHERE g.gallery_id = ?`;
        const [file_id] = await executeQuery(sql, [gallery_id]);

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

          file.push(...(await executeQuery(sql)));
        }
      }

      const result = { response, file };

      res.status(200).json({
        code: 200,
        message: "컨텐츠 조회에 성공하였습니다.",
        data: result,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
  insert: async (req, res) => {
    // 등록
    try {
      const data = {
        admin_id: req.session.user.id,
        file_main_id: req.body.file_main_id,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        video_url: req.body.video_url,
        category: req.body.category,
        gallery_category_name: req.body.gallery_category_name,
        title: req.body.title,
        note: req.body.note,
        type: req.body.type,
        exposure_yn: req.body.exposure_yn,
      };

      if (
        req.body.reg_date != undefined &&
        req.body.reg_date != "" &&
        req.body.reg_date != null
      ) {
        data.reg_date = req.body.reg_date;
      }

      const sql = `INSERT INTO tbl_gallery SET ?`;
      const saveAnswer = await executeQuery(sql, data);

      res.status(200).json({
        code: 200,
        message: "컨텐츠 등록에 성공하였습니다.",
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
  update: async (req, res) => {
    // 수정
    try {
      // 수정
      const data = {
        admin_id: req.session.user.id,
        gallery_id: req.body.gallery_id,
        file_main_id: req.body.file_main_id,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        video_url: req.body.video_url,
        category: req.body.category,
        gallery_category_name: req.body.gallery_category_name,
        title: req.body.title,
        note: req.body.note,
        type: req.body.type,
        exposure_yn: req.body.exposure_yn,
        reg_date: req.body.reg_date,
      };

      let sql = `UPDATE tbl_gallery SET category = COALESCE(?, category), title = COALESCE(?, title), note = COALESCE(?, note), type = COALESCE(?, type)`;
      if (data.reg_date != null) {
        sql += `, reg_date = '${data.reg_date}' `;
      }
      if (data.exposure_yn != null) {
        sql += `, exposure_yn = '${data.exposure_yn}' `;
      }
      sql += ` 
        , file_main_id = COALESCE(?, file_main_id), file_1_id = ? , file_2_id = ?, file_3_id = ?, file_4_id = ?, video_url = COALESCE(?, video_url), mod_date = now()
        WHERE gallery_id = ? AND admin_id = ? AND del_yn = 'N'
      `;

      const saveAnswer = await executeQuery(sql, [
        data.category,
        data.title,
        data.note,
        data.type,
        data.file_main_id,
        data.file_1_id,
        data.file_2_id,
        data.file_3_id,
        data.file_4_id,
        data.video_url,
        data.gallery_id,
        data.admin_id,
        data.reg_date,
        data.mod_date,
      ]);

      res.status(200).json({
        code: 200,
        message: "컨텐츠 수정에 성공하였습니다.",
        data: saveAnswer,
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
  delete: async (req, res) => {
    // 삭제
    try {
      const data = {
        admin_id: req.session.user.id,
        // admin_id: req.body.admin_id,
        gallery_id: req.body.gallery_id || [],
      };
      let sql = `
      UPDATE tbl_gallery 
      SET del_yn = 'Y'
      WHERE admin_id = ? 
        AND gallery_id IN (?)
    `;
      let response = await executeQuery(sql, [data.admin_id, data.gallery_id]);
      /*
      console.log(sql);
      sql = `UPDATE tbl_file fl LEFT JOIN tbl_gallery gy ON gy.admin_id = ? AND gy.gallery_id = ?`;
      sql += `
        SET fl.del_yn = 'Y'
        WHERE fl.file_id IN (gy.file_main_id, gy.file_1_id, gy.file_2_id, gy.file_3_id, gy.file_4_id)
      `;
      response = await executeQuery(sql, [data.admin_id, data.gallery_id]);

      sql = `
        SELECT 
          fl.file_id,
          fl.url
        FROM tbl_file fl 
        JOIN tbl_gallery gy 
        ON gy.admin_id = ?
        AND gy.gallery_id IN (
      `;
      for (i = 0; i < data.gallery_id.length; i++) {
        sql += data.gallery_id[i];
        if (i + 1 < data.gallery_id.length) {
          sql += `, `;
        }
      }
      sql += `
        ) WHERE fl.file_id IN (gy.file_main_id, gy.file_1_id, gy.file_2_id, gy.file_3_id, gy.file_4_id)
      `;
      response = await executeQuery(sql, data.admin_id);
      console.log("Query Response:", response);
*/
      sql = `
  UPDATE tbl_file fl
  LEFT JOIN tbl_gallery gy ON gy.admin_id = ? AND gy.gallery_id IN (?)
  SET fl.del_yn = 'Y'
  WHERE fl.file_id IN (gy.file_main_id, gy.file_1_id, gy.file_2_id, gy.file_3_id, gy.file_4_id)
`;
      response = await executeQuery(sql, [data.admin_id, data.gallery_id]);

      sql = `UPDATE tbl_`;
      sql = `
        SELECT 
          fl.file_id,
          fl.url
        FROM tbl_file fl 
        JOIN tbl_gallery gy 
        ON gy.admin_id = ?
        AND gy.gallery_id IN (
      `;
      for (i = 0; i < data.gallery_id.length; i++) {
        sql += data.gallery_id[i];
        if (i + 1 < data.gallery_id.length) {
          sql += `, `;
        }
      }
      sql += `
        ) WHERE fl.file_id IN (gy.file_main_id, gy.file_1_id, gy.file_2_id, gy.file_3_id, gy.file_4_id)
      `;
      response = await executeQuery(sql, data.admin_id);

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
  findGallery: async (req, res) => {
    try {
      const { page, pageSize, category, type_id } = req.body;
      const offset = (page - 1) * pageSize; // OFFSET 값 계산

      let sql = `
        SELECT 
          gy.gallery_id, 
          gy.title, 
          gy.category,
          gy.gallery_category_name,
          gy.type,
          IF(gy.type = '동영상', gy.video_url, fl1.url) AS file_main_id_url,
          gy.reg_date AS display_date
        FROM tbl_gallery gy
        LEFT JOIN tbl_file fl1 ON fl1.file_id = gy.file_main_id AND fl1.del_yn = 'N'
        WHERE gy.del_yn = 'N'
        AND gy.exposure_yn = 'Y'
      `;
      if (category != null) {
        if (category.length === 1 && category[0] === 0) {
          // 만약 카테고리가 [0]이라면 전체 조회
        } else {
          sql += `AND gy.category IN (`;
          for (let i = 0; i < category.length; i++) {
            sql += category[i];
            if (i + 1 < category.length) {
              sql += `, `;
            }
          }
          sql += `) `;
        }
      }
      if (type_id != null && type_id[0] === 1) {
        sql += `AND gy.type LIKE '%사진%' `;
      } else if (type_id[1] === 2) {
        sql += `AND gy.type LIKE '%동영상%' `;
      }
      console.log(type_id);
      sql += `ORDER BY gy.reg_date desc `;
      if (pageSize != null && page != null) {
        sql += `LIMIT ${pageSize} OFFSET ${offset};`;
      }

      const response = await executeQuery(sql);
      console.log(sql);
      res.status(200).json({
        code: 200,
        message: "조회에 성공하였습니다.",
        pageSize: pageSize !== null ? 1 : offset + 1,
        page: page !== null ? page : limit,
        data: response,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
};

module.exports = galleryService;
