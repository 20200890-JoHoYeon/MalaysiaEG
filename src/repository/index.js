const maria = require("mysql");


const pool = maria.createPool({
  host: '14.63.220.194',
  port: '3334',
  user: 'mals_user',
  password: 'duddjEG2023!@#',
  database: 'mals_db',
  connectionLimit: 10,
  
});

const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(query, params, (error, results, fields) => {
        connection.release();

        if (error) {
          reject(error);
          return;
        }

        resolve(results);
      });
    });
  });
};

module.exports = { executeQuery };
