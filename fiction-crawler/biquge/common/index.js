// const fs = require('fs');
const cheerio = require("cheerio");
const https = require("https");
const configs = require("../config");

/**
 * 获取页面的html字符串
 *
 * @param {*} url
 * @returns
 */
function getHtmlStr(url) {
  return new Promise((resolve, reject) => {
    try {
      https
        .get(url, { rejectUnauthorized: false }, (res) => {
          const { statusCode } = res;
          if (statusCode === 200) {
            res.setEncoding("utf8");
            let rowData = "";
            res.on("data", (chunk) => {
              rowData += chunk;
            });
            res.on("end", () => {
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
        chaptchUrls.push($(elem).attr("href"));
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
