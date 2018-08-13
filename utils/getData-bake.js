const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const cheerio = require('cheerio');


const url = 'https://sjz.fang.lianjia.com/loupan/'; // 目标地址
let total = 0; // 总页数


function getPageInfo(page) {
  const pageUrl = page === 1 ? url : `${url}pg${page}`;
  console.log('抓取中...' + pageUrl);
  return new Promise(function (resolve, reject) {
    superagent.get(pageUrl)
      .end(function (err, sres) {
        if (err) {
          console.log(`抓取错误，正在从失败页(${page})继续...`);
          throw err
        }
        if (sres) {
          const $ = cheerio.load(sres.text);
          const items = [];

          // console.log($('.house-lst .pic-panel a'));

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

          resolve(items);
        }
      });
  })
}

module.exports = function getPageCount() {
  console.log('抓取总页数...' + url);

  return new Promise(function (resolve, reject) {
    superagent.get(url)
      .end(function (err, sres) {
        if (err) {
          console.log(err);
          // getCount(1, total);
        }
        if (sres) {
          const $ = cheerio.load(sres.text);
          const initPage = 1
          total = $('.page-box').attr('data-total-count');
          console.log('页数:' + total);

          getPageInfo(initPage).then(function (pageInfo) {
            fs.writeFile(path.join(__dirname, 'sres.json'), JSON.stringify(pageInfo), 'utf8', function (err, text) {
              if (err) throw err
              console.log("done.");
            })
            resolve(pageInfo)
          }).catch(error => {
            console.log(error);
            reject(new error(error))
          })
        }
      });
  })



}