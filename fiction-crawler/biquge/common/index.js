// const fs = require('fs');
const cheerio = require("cheerio");

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
  for (let i = 0, il = searchResList.length; i < il; i++) {
      console.log(searchResList[i]);
    if (searchResList[i].text().replace(/\s+|\r|\n|\t/gi, "") === fictionName) {
      url = searchResList[i].find("a")[0].attr("href");
      return;
    }
  }
  return url;
};
