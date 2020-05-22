const http = require("http");
const configs = require("./config");



/**
 * 获取一下主页的html文件
 *
 */
function getHomePageHtml () {
  http
    .get(configs.HOME_PAGE_PATH, (res) => {
      console.log(res);
      const { statusCode } = res;
      if (statusCode === 200) {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", (chunck) => {
          rawData += chunck;
        });
        res.on("end", () => {});
      } else {
        console.error(`【getHomePageHtml】：${res}`);
        res.resume();
        return;
      }
    })
    .on("error", (e) => {
      console.error(`出错了${e.message}`);
    });
};
