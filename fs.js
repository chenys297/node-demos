/*
 * @Author: lip
 * @Date: 2020-05-21 10:58:48
 * @Last Modified by: lip
 * @Last Modified time: 2020-05-22 11:51:38
 */
const fs = require("fs");

/**
 * 异步删除文件
 *
 * @param {*} path
 */
export function unlink(path) {
  fs.unlink(path, (err) => {
    if (err) {
      throw err;
    }
    console.log(`${path}已成功删除`);
  });
}

/**
 * 删除文件 同步
 *
 * @param {*} path
 */
export function unlinkSync(path) {
  try {
    fs.unlinkSync(path);
    console.log(`${path}已成功删除`);
  } catch (err) {
    console.error(err);
  }
}

/**
 * 重命名文件
 *
 * @param {*} oldName
 * @param {*} newName
 */
export function rename(oldName, newName) {
  fs.rename(oldName, newName, (err) => {
    if (err) throw err;
    fs.stat(newName, (err, state) => {
      if (err) throw err;
      console.log(`文件属性：${JSON.stringify(state)}`);
    });
  });
}


/**
 * 创建目录
 *
 * @export
 * @param {*} path
 * @param {*} option
 */
export function mkdir(path, option) {
  fs.mkdir(path, option, (err) => {
    if (err) throw err;
  });
}

export function mkdtemp(prefix, option) {
  fs.mkdtemp(prefix, option, (err, directory) => {
    if (err) {
      throw err;
    }
    console.log(directory)
  })
}