module.exports = function (app) {

  app.get('/', function (req, res) {
    res.redirect('/home');
  });

  app.use('/home', require('./controller/home')); // 博客首页

};