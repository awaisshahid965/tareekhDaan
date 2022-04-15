const { Router } = require('express');
const Blog = require('../models/blog');
const Catg = require('../models/catagory');

const route = Router();

route.get('/blog', async (req, res) => {
  let { page = 1 } = req.query;
  const isUrdu = req.session.lang;
  page = parseInt(page);
  const limitResults = 5;
  const blogsCount = await Blog.countDocuments({ isUrdu });
  const blogs = await Blog.find({ isUrdu }).limit(limitResults).skip((page - 1) * limitResults).sort({$natural: -1});
  console.log(blogsCount);
  console.log(blogs);
  if (blogs.length > 0) {
    res.render('search', { isLogin: req.session.admin, blogs, title: "All Blogs", page, blogsCount, limitResults, route: '/blog', isUrdu});
  } else {
    res.render('reuseables/r_error', { errorCode: "404", errorType: "Blogs Not Found", errorMsg: "No data Exists to Show You Right Now", isLogin: req.session.admin, isUrdu });
  }
});

route.get('/blog/:id', async (req, res) => {
  const isUrdu = req.session.lang;
  const blog = await Blog.findById(req.params.id);
  if (blog.isUrdu !== isUrdu) {
    req.session.lang = !isUrdu;
    res.redirect('/blog/' +req.params.id);
  }
  const blogRecent = await Blog.find({ isUrdu }, {title: 1, imgSrc: 1}).limit(3).sort({$natural:-1});
  res.render('s_blog', { blog, isLogin: req.session.admin, blogRecent, isUrdu });
});

route.post('/search', async (req, res) => {
  const isUrdu = req.session.lang;
  let searchWord = req.body.search.trim();
  try {
    const sanitize = new RegExp('[<>/()\\\\]', 'g');
    searchWord = searchWord.replace(sanitize, '');
  } catch (err) {
    return res.render('reuseables/r_error', { isUrdu, errorCode: "500", errorType: "Internal Server Error", errorMsg: "Invalid Search query or keyword, try again...", isLogin: req.session.admin });
  }
  if(searchWord === '') {
    res.render('reuseables/r_error', { isUrdu, errorCode: "422", errorType: "Empty Search Field!!!", errorMsg: "Please Enter Some Keyword for Search Results.", isLogin: req.session.admin });
  } else {
    const blogs = await Blog.find( { isUrdu } );
    const sw = new RegExp(searchWord, 'gi');
    let id = [];
    blogs.forEach( blog => {
      if (sw.test(blog.desc) || sw.test(blog.title)) {
        id.push(blog._id);
      }
    });

    const results = await Blog.find({ _id: {$in: id} });
    if (results.length > 0) {
      res.render('search', { isUrdu, isLogin: req.session.admin, blogs: results, title: searchWord });
    } else {
      res.render('reuseables/r_error', { isUrdu, errorCode: "404", errorType: "Blogs Not Found", errorMsg: "No Such data or keyword Exists", isLogin: req.session.admin });
    }
  }
});

module.exports = route;
