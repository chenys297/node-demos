const https = require("https");
const configs = require("./config");
const common = require("./common");

/**
 * 获取一下主页的html文件
 *
 */
function getHomePageHtml() {
  https
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
}

/**
 * 查询小说
 *
 * @param {*} fictionName
 */
function searchFiction(fictionName) {
  return new Promise((resolve, reject) => {
    try {
      https
        .get(configs.SEARCH_FICTION_RESULT + fictionName, { rejectUnauthorized: false }, (res) => {
          const { statusCode } = res;
          if (statusCode === 200) {
            res.setEncoding("utf8");
            let rowData = "";
            res.on("data", (chunk) => {
              rowData += chunk;
            });
            res.on("end", () => {
              console.log("读取结束");
              resolve({ code: 200, data: rowData });
            });
          } else {
            console.log("[searchFiction]:" + res);
            reject(res);
            res.resume();
            return;
          }
        })
        .on("error", (e) => {
          console.error(`[searchFiction]出错了：${e.message}`);
          reject(e);
        });
    } catch (error) {
      console.log("[searchFiction]" + error);
      reject(error);
    }
  });
}

exports.start = async function start(fictionName) {
  try {
    const searchRes = await searchFiction(fictionName);
    if (searchRes.code && searchRes.code === 200) {
      const fictionUrl = common.getFictionHomeUrl(searchRes.data, fictionName);
      console.log("fiction url = " + fictionUrl);
    }
  } catch (error) {
    console.error("[start]" + error);
  }
};

exports.biquge = {
  start: "hshsh",
};
