const express = require("express");
const app = express();

// mongoose
const mongoose = require("mongoose");
// 連接到 MongoDB 伺服器
// 使用 Docker 啟動的 MongoDB 可以直接輸入那個服務的名稱，如下 mongodb。
const dbURI = "mongodb://mongodb:27017/exampleDB";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("成功連接到 MongoDB");
  })
  .catch((err) => {
    console.error("無法連接到 MongoDB:", err);
  });

app.use(express.static("public"));
// 設定應用程式的視圖引擎為 EJS
app.set("view engine", "ejs");
// 設定視圖目錄為 /home/views，使用 Docker 建議加上這一行，否則需要進入容器內部操作，較為繁瑣。
app.set("views", "/home/views");

app.use(express.json()); // 解析 JSON 格式的請求主體
app.use(express.urlencoded({ extended: true })); // 解析 URL 編碼格式的請求主體

// Routes
app.get("/", (req, res) => {
  return res.send("Hello");
});

// web server start
const port = 3000;
app.listen(port, () => {
  console.log(`伺服器運行在 http://localhost:${port}/`);
});
