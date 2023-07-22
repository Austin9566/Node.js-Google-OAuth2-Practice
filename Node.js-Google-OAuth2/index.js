const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/proflie-routes");
require("./config/passport");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
// 連接到 MongoDB 伺服器
// 使用 Docker 啟動的 MongoDB 可以直接輸入那個服務的名稱，如下 mongodb。
const dbURI = "mongodb://mongodb:27017/GoogleDB";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("成功連接到 MongoDB");
  })
  .catch((err) => {
    console.error("無法連接到 MongoDB:", err);
  });

// 設定 Middlewares和排版引擎
app.use(express.static("public"));
// 設定應用程式的視圖引擎為 EJS
app.set("view engine", "ejs");
// 設定視圖目錄為 /home/views，使用 Docker 建議加上這一行，否則需要進入容器內部操作，較為繁瑣。
app.set("views", "/home/views");

app.use(express.json()); // 解析 JSON 格式的請求主體
app.use(express.urlencoded({ extended: true })); // 解析 URL 編碼格式的請求主體
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// setting Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  return res.render("index", { user: req.user });
});

// web server start
const port = 3000;
app.listen(port, () => {
  console.log(`伺服器運行在 http://localhost:${port}/`);
});
