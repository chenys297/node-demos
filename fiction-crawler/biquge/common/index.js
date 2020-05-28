// const fs = require('fs');
const cheerio = require("cheerio");
const https = require("https");
const configs = require("../config");
const fs = require("fs");
const path = require("path");

/**
 * 获取页面的html字符串
 *
 * @param {*} url
 * @returns
 */
function getHtmlStr(url) {
  const startTime = new Date().getTime();
  console.log(`请求[${url}]开始时间：${startTime}`);
  return new Promise((resolve, reject) => {
    try {
      const agent = new https.Agent({
        keepAlive: true,
        maxSockets: 100,
        maxFreeSockets: 80,
        timeout: 60 * 1000,
        maxCachedSessions: 100,
      });
      https
        .get(url, { rejectUnauthorized: false, agent: agent }, (res) => {
          const { statusCode } = res;
          if (statusCode === 200) {
            res.setEncoding("utf8");
            let rowData = "";
            res.on("data", (chunk) => {
              rowData += chunk;
            });
            res.on("end", () => {
              const endTime = new Date().getTime();
              console.log(`请求[${url}]结束时间：${endTime}.耗时：${endTime - startTime}`);
              console.log("[getHtmlStr]:读取结束");
              resolve({ code: 200, data: rowData });
            });
          } else {
            console.log("[getHtmlStr]:" + res);
            reject(res);
            res.resume();
            return;
          }
        })
        .on("error", (e) => {
          console.error(`[getHtmlStr]出错了：${e.message}`);
          reject(e);
        });
    } catch (error) {
      console.log("[getHtmlStr]" + error);
      reject(error);
    }
  });
}

/**
 * 获取小说主页链接
 *
 * @export
 * @param {*} strSearchResHtml
 * @param {*} fictionName
 * @returns
 */
exports.getFictionHomeUrl = function (strSearchResHtml, fictionName) {
  const $ = cheerio.load(strSearchResHtml, { normalizeWhitespace: true });
  const searchResList = $("#search-main ul li .s2");
  let url = "";
  searchResList.each((idx, elem) => {
    if (
      $(elem)
        .text()
        .replace(/\s+|\r|\n|\t/gi, "") === fictionName
    ) {
      url =
        $(elem).find("a").length > 0
          ? $($(elem).find("a")[0]).attr("href")
          : "";
      return false;
    }
  });
  return url;
};

/**
 * 查询小说
 *
 * @param {*} fictionName
 */
exports.searchFiction = function (fictionName) {
  return new Promise((resolve, reject) => {
    try {
      https
        .get(
          configs.SEARCH_FICTION_RESULT + fictionName,
          { rejectUnauthorized: false },
          (res) => {
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
          }
        )
        .on("error", (e) => {
          console.error(`[searchFiction]出错了：${e.message}`);
          reject(e);
        });
    } catch (error) {
      console.log("[searchFiction]" + error);
      reject(error);
    }
  });
};

/**
 * 获取所有章节链接
 *
 * @param {*} fictionHomeUrl
 * @returns Array
 */
exports.getAllChapters = async function (fictionHomeUrl) {
  try {
    const { code, data } = await getHtmlStr(fictionHomeUrl);
    if (code && code === 200) {
      const $ = cheerio.load(data, { normalizeWhitespace: true });
      const aList = $("#list dd a[href^='/book'][style='']");
      let chaptchUrls = [];
      aList.each((idx, elem) => {
        if (
          $(elem)
            .text()
            .replace(/\s+|\r|\n|\t/gi, "")
            .startsWith("第")
        ) {
          chaptchUrls.push($(elem).attr("href"));
        }
      });
      return chaptchUrls;
    } else {
      console.log("[getAllChapters]" + error);
      return [];
    }
  } catch (error) {
    console.log("[getAllChapters]" + error);
  }
};

/**
 * 保存小说
 *
 * @param {*} chaptchName
 * @param {*} chaptchContent
 */
function saveFiction(chaptchName, chaptchContent, fictionName) {
  try {
    let data = "\n\t" + chaptchName + "\n" + chaptchContent;
    console.log(`${fictionName}:${chaptchName}开始写入...`);
    // fs.writeFile(
    //   path.join(
    //     __dirname,
    //     "../../temp/fictions/" +
    //       fictionName +
    //       "/chaptchs/" +
    //       chaptchName +
    //       ".txt"
    //   ),
    //   data,
    //   { encoding: "utf8" },
    //   (err) => {
    //     if (err) {
    //       throw err;
    //     }
    //     console.log(`${fictionName}:${chaptchName}写入完成`);
    //   }
    // );
    fs.appendFileSync(
      path.join(__dirname, '../../temp/fictions/' + fictionName + '/《' + fictionName + '》.txt'),
      data,
      { encoding: "utf8" }
    );
    console.log(`${fictionName}:${chaptchName}写入完成`);
  } catch (error) {
    console.log(
      `[saveFiction]:chaptchName=${chaptchName}&&chapchContent=${chaptchContent}&&fictionName=${fictionName}&&error=${error}`
    );
  }
}

/**
 * 获取小说章节详情内容
 *
 * @param {*} chaptchUrl
 * @param {*} fictionName
 */
exports.getChaptchContent = async function (chaptchUrl, fictionName) {
  try {
    console.log(`开始爬取章节${chaptchUrl}`);
    const { code, data } = await getHtmlStr(chaptchUrl);
    console.log(`爬取结果code=${code}`);
    if (code && code === 200) {
      const $ = cheerio.load(data, { normalizeWhitespace: true });
      const chaptchName = $(".bookname h1").first().text();
      const content = $("#content")
        .text()
        .replace(
          /\(看小说到\)16977小游戏每天更新好玩的小游戏，等你来发现！|章节错误,点此举报\(免注册\)5分钟内会处理.举报后请耐心等待,并刷新页面。/gi,
          ""
        );
      saveFiction(chaptchName, content, fictionName);
    } else {
      console.log("[getChaptchContent]出错了");
      throw new Error("[getChaptchContent]出错了");
    }
  } catch (error) {
    console.log("[getChaptchContent]" + error);
    throw new Error("[getChaptchContent]出错了." + error);
  }
};

/**
 * 睡眠
 *
 * @param {*} sleepTimes
 */
exports.sleep = function (sleepTimes) {
  const startTime = new Date().getTime();
  const endTime = startTime + sleepTimes;
  while (new Date().getTime() < endTime);
};
