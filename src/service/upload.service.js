const { executeQuery } = require("../repository");
const fs = require("fs");

const uploadService = {
  uploadFile: async (req, res) => {
    // 등록
    try {
      const { originalname, filename, mimetype, path } = req.file;
      const data = {
        origin_name: Buffer.from(originalname, "latin1").toString("utf8"),
        change_name: filename,
        ext: mimetype,
        url: path,
      };

      const sql = `INSERT INTO tbl_file SET ?`;
      const saveAnswer = await executeQuery(sql, data);

      res.status(200).json({
        code: 200,
        message: "이미지 등록에 성공하였습니다.",
        data: { file_id: saveAnswer.insertId },
      });
    } catch (err) {
      let message;
      /*
      if(req.session.user == undefined) {
        message = '유저 세션이 존재하지 않습니다.'
      } else {
        message = '에러가 발생하였습니다.';
      }
*/
      console.error(err);
      res.status(500).json({ message: message, data: err, code: 500 });
    }
  },
  deleteFile: async (req, res) => {
    // 삭제
    try {
      const { file_id } = req.body;

      let sql = `UPDATE tbl_file SET del_yn = 'Y' WHERE file_id = ?`;
      let response = await executeQuery(sql, [file_id]);

      sql = `SELECT * FROM tbl_file WHERE file_id = ?`;
      response = await executeQuery(sql, [file_id]);

      // 업로드된 파일의 경로
      let filePath;
      if (response[0]) {
        filePath = response[0].url;

        // 파일 삭제
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({
              code: 500,
              message: "이미지 삭제 실패",
              data: err,
            });
          } else {
            res.status(200).json({
              code: 200,
              message: "이미지 삭제 성공",
              data: { filePath: filePath },
            });
          }
        });
      } else {
        res.status(200).json({
          code: 500,
          message: "해당 이미지 미존재",
        });
      }
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "이미지 삭제 실패", data: err, code: 500 });
    }
  },
};

module.exports = uploadService;
