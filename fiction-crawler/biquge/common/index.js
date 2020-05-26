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

/*
searchResList[i] = 
{
  type: 'tag',
  name: 'span',
  namespace: 'http://www.w3.org/1999/xhtml',
  attribs: [Object: null prototype] { class: 's2' },
  'x-attribsNamespace': [Object: null prototype] { class: undefined },
  'x-attribsPrefix': [Object: null prototype] { class: undefined },
  children: [
    {
      type: 'tag',
      name: 'b',
      namespace: 'http://www.w3.org/1999/xhtml',
      attribs: [Object: null prototype] {},
      'x-attribsNamespace': [Object: null prototype] {},
      'x-attribsPrefix': [Object: null prototype] {},
      children: [Array],
      parent: [Circular],
      prev: null,
      next: null
    }
  ],
  parent: {
    type: 'tag',
    name: 'li',
    namespace: 'http://www.w3.org/1999/xhtml',
    attribs: [Object: null prototype] {},
    'x-attribsNamespace': [Object: null prototype] {},
    'x-attribsPrefix': [Object: null prototype] {},
    children: [
      [Object],   [Object],
      [Circular], [Object],
      [Object],   [Object],
      [Object],   [Object],
      [Object],   [Object],
      [Object],   [Object],
      [Object],   [Object]
    ],
    parent: {
      type: 'tag',
      name: 'ul',
      namespace: 'http://www.w3.org/1999/xhtml',
      attribs: [Object: null prototype] {},
      'x-attribsNamespace': [Object: null prototype] {},
      'x-attribsPrefix': [Object: null prototype] {},
      children: [Array],
      parent: [Object],
      prev: [Object],
      next: [Object]
    },
    prev: {
      type: 'text',
      data: '\n                ',
      parent: [Object],
      prev: null,
      next: [Circular]
    },
    next: {
      type: 'text',
      data: '\n\n                                    ',
      parent: [Object],
      prev: [Circular],
      next: [Object]
    }
  },
  prev: {
    type: 'text',
    data: '\n                    ',
    parent: {
      type: 'tag',
      name: 'li',
      namespace: 'http://www.w3.org/1999/xhtml',
      attribs: [Object: null prototype] {},
      'x-attribsNamespace': [Object: null prototype] {},
      'x-attribsPrefix': [Object: null prototype] {},
      children: [Array],
      parent: [Object],
      prev: [Object],
      next: [Object]
    },
    prev: {
      type: 'tag',
      name: 'span',
      namespace: 'http://www.w3.org/1999/xhtml',
      attribs: [Object: null prototype],
      'x-attribsNamespace': [Object: null prototype],
      'x-attribsPrefix': [Object: null prototype],
      children: [Array],
      parent: [Object],
      prev: null,
      next: [Circular]
    },
    next: [Circular]
  },
  next: {
    type: 'text',
    data: '\n                    ',
    parent: {
      type: 'tag',
      name: 'li',
      namespace: 'http://www.w3.org/1999/xhtml',
      attribs: [Object: null prototype] {},
      'x-attribsNamespace': [Object: null prototype] {},
      'x-attribsPrefix': [Object: null prototype] {},
      children: [Array],
      parent: [Object],
      prev: [Object],
      next: [Object]
    },
    prev: [Circular],
    next: {
      type: 'tag',
      name: 'span',
      namespace: 'http://www.w3.org/1999/xhtml',
      attribs: [Object: null prototype],
      'x-attribsNamespace': [Object: null prototype],
      'x-attribsPrefix': [Object: null prototype],
      children: [Array],
      parent: [Object],
      prev: [Circular],
      next: [Object]
    }
  }
}
*/