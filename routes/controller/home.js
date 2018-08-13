var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var getData = require('../../utils/getData'); // 导入router层控制函数

router.get('/', function (req, res) {
  //
  // res.sendFile(path.resolve(__dirname, '..', 'index.html'));

  res.render('home', {
    title: '首页'
  });
  res.end();
});

// 查询接口
router.post('/query', (req, res, next) => {
  getData().then(data => {
    res.json({
      code: 0,
      data: data,
      msg: ''
    });
  })
  // res.end();
});

module.exports = router;