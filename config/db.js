//db설정

const maria = require("mysql");

// 데이터베이스 connection 객체 생성
const connection = maria.createConnection({
  host: '14.63.220.194',
  port: '3334',
  user: 'mals_user',
  password: 'duddjEG2023!@#',
  database: process.env.DB_DATABASE,
});
console.log("DB_PASS:", process.env.DB_PASSWORD);
// maria connection 실행
connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database. ");
});

module.exports = connection;
