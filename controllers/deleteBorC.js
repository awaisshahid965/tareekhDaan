const Catg = require('../models/catagory');
const Blog = require('../models/blog');
const fs = require('fs');

module.exports.delete_blog = async (req, res) => {
  let { id } = req.params;
  try {
    const response = await Blog.findByIdAndDelete(id);
    fs.unlink('public' +req.query.img, err => {});
    res.redirect('/');
  } catch (err) {
    res.render('reuseables/r_error', { errorCode: "502", errorType: "Database Error", errorMsg: "Can't delete blog right now...", isLogin: req.session.admin });
  }
}

module.exports.delete_catg = async (req, res) => {
  let { id } = req.params;
  let { name } = req.query;
  try {
    const response = await Catg.findByIdAndDelete(id);
    fs.unlink('public' +req.query.img, err => {});
    const blogs = await Blog.find({ catagory: name }, { _id: 1, imgSrc: 1 });
    blogs.forEach(async blog => {
      try {
        const response = await Blog.findByIdAndDelete(blog._id);
        fs.unlink('public' +blog.imgSrc, err => {});
      } catch (err) {
        res.render('reuseables/r_error', { errorCode: "500", errorType: "Internal Server Error", errorMsg: "There is problem deleting blogs, delete manually...", isLogin: req.session.admin });
      }
    });
    res.redirect('/');
  } catch (err) {
    res.render('reuseables/r_error', { errorCode: "502", errorType: "Database Error", errorMsg: "Can't delete blog right now...", isLogin: req.session.admin });
  }
}
