/*
 * @Author: lip 
 * @Date: 2020-05-20 17:31:43 
 * @Last Modified by: lip
 * @Last Modified time: 2020-05-20 19:09:33
 */
const http = require("http");

const host = "127.0.0.1";
const port = 3000;

http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
    console.log(`访问路径：${req.url}`);
    if (req.url !== "/favicon.ico") {
      res.write("你好世界！\n");
      res.end("Helle World!");
    } else {
      console.log("访问/favicon.ico");
      res.end();
    }
  })
  .listen(port);

console.log(`服务器运行于：${host}:${port}`);
