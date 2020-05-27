const common = require("./common");

exports.start = async function start(fictionName) {
  try {
    const searchRes = await common.searchFiction(fictionName);
    if (searchRes.code && searchRes.code === 200) {
      const fictionUrl = common.getFictionHomeUrl(searchRes.data, fictionName);
      console.log("fiction url = " + fictionUrl);
      const chaptchUrls = await common.getAllChapters(fictionUrl);
      console.log("chaptchUrls.length=" + chaptchUrls.length);
    }
  } catch (error) {
    console.error("[start]" + error);
  }
};
