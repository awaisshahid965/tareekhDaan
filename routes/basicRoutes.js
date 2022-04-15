const { Router } = require('express');
const Blog = require('../models/blog');
const Catg = require('../models/catagory');

const route = Router();

route.get('/', async (req, res) => {
  const isUrdu = req.session.lang;
  const blog = await Blog.find({ isUrdu }).limit(5).sort({$natural:-1});
  res.render('index', { data: blog, isLogin: req.session.admin, isUrdu: req.session.lang, isUrdu });
});

route.get('/language', async (req, res) => {
  const { lang } = req.query;
  if (lang === 'ur') {
    req.session.lang = true;
  } else {
    req.session.lang = false;
  }
  res.redirect('/');
});

route.get('/about', (req, res) => {
  const isUrdu = req.session.lang;
  res.render('about', { isLogin: req.session.admin, isUrdu: req.session.lang, isUrdu });
});

route.get('/blogs/:lang', async (req, res) => {
  let { page = 1 } = req.query;
  let { lang } = req.params;

  const isUrdu = req.session.lang;
  page = parseInt(page);
  const limitResults = 1;
  const blogsCount = await Blog.countDocuments({ isUrdu });
  const blogs = await Blog.find({ isUrdu }).limit(limitResults).skip((page - 1) * limitResults).sort({$natural: -1});
  if (blogs.length > 0) {
    const title = "All" +(isUrdu ? ' Urdu' : ' English')+ " Blogs";
    res.render('search', { isLogin: req.session.admin, blogs, title, page, blogsCount, route: '/blogs/' +isUrdu, isUrdu});
  } else {
    res.render('reuseables/r_error', { errorCode: "404", errorType: "Blogs Not Found", errorMsg: "No data Exists to Show You Right Now", isLogin: req.session.admin });
  }

  // if(lang !== null) {
  //
  // } else {
  //   res.redirect('/');
  // }
});

module.exports = route;
