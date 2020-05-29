const common = require("./common");
const config = require("./config");
const fs = require("fs");

exports.start = async function start(fictionName) {
  try {
    const searchRes = await common.searchFiction(fictionName);
    if (searchRes.code && searchRes.code === 200) {
      const fictionUrl = common.getFictionHomeUrl(searchRes.data, fictionName);
      console.log("fiction url = " + fictionUrl);
      const chaptchUrls = await common.getAllChapters(fictionUrl);
      console.log("chaptchUrls.length=" + chaptchUrls.length);
      fs.stat("./temp/fictions/" + fictionName + "/chaptchs", (err, status) => {
        if (err) {
          console.log(`小说${fictionName}目录不存在`);
          console.log(`开始创建小说${fictionName}目录...`);
          fs.mkdir(
            "./temp/fictions/" + fictionName + "/chaptchs",
            { recursive: true },
            (error) => {
              if (error) {
                console.log(`创建小说${fictionName}目录失败.原因：${error}`);
                return;
              } else {
                console.log(`创建小说${fictionName}目录创建成功!`);
                //保存小说文件
                console.log(`开始爬取数据小说章节!`);
                for (let i = 0, il = chaptchUrls.length; i < il; i++) {
                  common.getChaptchContent(
                    config.BASE_HOST + chaptchUrls[i],
                    fictionName,
                    i
                  );
                  common.sleep(1000 + Math.random() * 1000);
                }
              }
            }
          );
        } else {
          if (status.isDirectory) {
            console.log(`小说${fictionName}目录已存在`);
            //保存小说文件
            console.log(`开始爬取数据小说章节!`);
            for (let i = 0, il = chaptchUrls.length; i < il; i++) {
              common.getChaptchContent(
                config.BASE_HOST + chaptchUrls[i],
                fictionName,
                i
              );
              common.sleep(1000 + Math.random() * 1000);
            }
          }
        }
      });
    }
  } catch (error) {
    console.error("[start]" + error);
  }
};
