module.exports.isLogin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports.isLoginOk = (req, res, next) => {
  if (!req.session.admin) {
    next();
  } else {
    res.redirect('/');
  }
};
