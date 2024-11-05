// express 인스턴스 생성 및 app에 저장
const express = require("express");

const app = express();
const morgan = require("morgan");
const expressSession = require("express-session");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
const swaggerSpecs = require("./src/utils/swagger");

require("dotenv").config({ path: '.env.dev' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

// 화면 엔진 ejs로 설정
app.set("view engine", "ejs");
app.set("views", "./src/views");
// app.use(morgan("combined"));

app.use("/img", express.static(`${__dirname}/src/public`));
app.use(express.static(`${__dirname}/src/public`));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/", require("./src/controller"));

module.exports = app;
