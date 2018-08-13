// require('./database/mongodb.js'); // 连接数据库。 注释掉即可取消链接数据库
var express = require('express')
var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser'); // 解析 cookie
var config = require('./config');
var routes = require('./routes'); // 导入router层控制函数
var app = express();

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', '3.2.1');
  if (req.method == 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next();
  }
});

app.use(cookieParser());
app.set('port', config.port);
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(serveStatic(path.join(__dirname, 'public')));


app.locals = {
  // moment: moment,
  blog: config.blog
};

routes(app);

// 导出 app
if (module.parent) {
  module.exports = app;
} else {
  // 启动服务
  app.listen(config.port, function () {
    console.log(`\n Your application is running here: http://localhost:${config.port}\n`);
  });

}