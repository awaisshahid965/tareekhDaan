const { Router } = require('express');
const Blog = require('../models/blog');
const Catg = require('../models/catagory');

const route = Router();

route.get('/catagory', async (req, res) => {
  const isUrdu = req.session.lang;
  const catg = await Catg.find({ isUrdu });
  res.render('catagory', { catagories: catg, isLogin: req.session.admin, isUrdu });
});

route.get('/result', async (req, res) => {
  res.render('reuseables/r_error', { errorCode: "404", errorType: "Catagory Not Found", errorMsg: "No Such Catagory Exists...", isLogin: req.session.admin });
});

route.get('/result/:catagory', async (req, res) => {
  const isUrdu = req.session.lang;
  let { page = 1 } = req.query;
  page = parseInt(page);
  const limitResults = 1;
  let catagory = req.params.catagory.trim();
  const blogsCount = await Blog.countDocuments({ catagory, isUrdu });
  const blogs = await Blog.find({ catagory, isUrdu }).limit(limitResults).skip((page - 1) * limitResults);
  if (blogs.length > 0) {
    res.render('search', { isUrdu, isLogin: req.session.admin, blogs, title: catagory, page, blogsCount, route: '/result/' +catagory});
  } else {
    res.render('reuseables/r_error', { isUrdu, errorCode: "404", errorType: "Blogs not found!", errorMsg: "No Blogs were Added to this catagory by Admin...", isLogin: req.session.admin });
  }
});

module.exports = route;
