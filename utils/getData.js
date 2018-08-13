const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const cheerio = require('cheerio');

const url = 'https://sjz.fang.lianjia.com/loupan/'; // 目标地址
let total = 0; // 总页数
let sres = [] // 一次请求获取的数据


// 已经爬取过，则使用已爬取的json文件中数据
function isExitData() {
  return new Promise(resolve => {
    fs.readFile(path.resolve(__dirname, 'sres.json'), 'utf8', function (err, data) {
      if (err) console.log(err);
      if (data) {
        console.log('文件存在');
        resolve(JSON.parse(data))
      } else {
        console.log('文件不存在');
        resolve()
      }
    });
  })
};

async function getPageInfo(page) {
  const pageUrl = page === 1 ? url : `${url}pg${page}`;

  console.log('页码: ' + page);

  const $ = cheerio.load(sres.text);
  const items = [];

  $('.resblock-list-wrapper .resblock-list').each(function (index, element) {
    let tagArr = [];
    let typeArr = [];
    const $element = $(element);
    const $info_1 = $($('.resblock-list-wrapper .resblock-list .resblock-img-wrapper')[index]);
    const $info_2 = $($('.resblock-list-wrapper .resblock-list .resblock-desc-wrapper')[index]);

    if (index > 10) {
      return false
    }

    $info_2.find('.resblock-name span').each(function (i, item) {
      tagArr[i] = $(item).text().replace(/(\t)|(\n)|(\s+)/g, '');
    });

    $info_2.find('.resblock-type').each(function (i, item) {
      typeArr[i] = $(item).text().replace(/(\t)|(\n)|(\s+)/g, '');
    });

    const $eleInfo = {
      src: $info_1.find("img").attr('data-original'),
      price: $info_2.find(".resblock-price .main-price .number").text().replace(/(\t)|(\n)|(\s+)/g, ''),
      name: $info_1.attr("title"),
      discount: $info_1.find('.icon-wrapper .discount').text(),
      where: $info_2.find('.resblock-location .a').text(),
      area: $info_2.find('.resblock-location span').text().replace(/(\t)|(\n)|(\s+)/g, ''),
      tags: tagArr,
      types: typeArr,
      href: $info_1.attr('href').split('/')[2]
    }
    items.push($eleInfo);
  })

  return items

}

// 获取总数据
async function formatPageCount() {
  sres = await fetchData()
  const $ = cheerio.load(sres.text);
  total = $('.page-box').attr('data-total-count');

  console.log('页数:' + total);

  var pageInfo = await getPageInfo(1)

  writeFile()

  return pageInfo
}

// 写入数据到文件中
function writeFile(pageInfo) {
  fs.writeFile(path.join(__dirname, 'sres.json'), JSON.stringify(pageInfo), 'utf8', function (err, text) {
    if (err) throw err
    console.log("done.");
  })
}

// 获取远程数据
function fetchData() {
  return new Promise(function (resolve, reject) {
    console.log('抓取数据中： ' + url);
    superagent.get(url)
      .end(function (err, sres) {
        if (err) {
          console.log(err);
        }
        if (sres) {
          resolve(sres)
        } else {
          reject()
        }
      });
  })
}
async function getPageData() {
  var result = await isExitData();

  if (!result) {
    result = await formatPageCount()
  }
  return result
}

module.exports = getPageData