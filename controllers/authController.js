require('dotenv').config()

module.exports.admin_login_get = (req, res) => {
  const isUrdu = req.session.lang;
  res.render('login', { isUrdu, isLogin: req.session.admin });
};

module.exports.admin_login_post = (req, res) => {
  const isUrdu = req.session.lang;
  if (req.body.email !== '' || req.body.password !== '') {
    if (req.body.email === process.env.ADMIN_LOGIN && req.body.password === process.env.ADMIN_PASSWORD) {
      req.session.admin = true;
      res.redirect('/');
    }
    else {
      res.render('login', { gError: true, email: req.body.email, isUrdu, isLogin: req.session.admin });
    }
  }
  else {
    res.render('login', { emptyError: true, isUrdu, isLogin: req.session.admin });
  }
};

module.exports.admin_logout = (req, res) => {
  req.session.admin = false;
  res.redirect('/');
}
