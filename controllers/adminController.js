const Catg = require('../models/catagory');
const Blog = require('../models/blog');
const fs = require('fs');

module.exports.admin_add_catg_get = (req, res) => {
  const isUrdu = req.session.lang;
  let { e = 'nok' } = req.query;
  let { i = 'nok' } = req.query;
  e = e === 'nok' ? '' : 'Please Fill All Fields';
  i = i === 'nok' ? '' : 'Image Must bo of type JPG | JPEG | PNG';
  res.render('admin/catg', { isLogin: req.session.admin, e, i, isUrdu });
};

module.exports.admin_add_catg_post = (req, res) => {

  if(req.files === null || req.body.catagoryTitle === '') {
    res.redirect('/add_catg?e=ok');
  }
  else {
    const isUrdu = req.session.lang;
    const fileType = req.files.imageFile.mimetype.split('/')[1];
    if(fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'jpg') {
      res.redirect('/add_catg?i=ok');
    } else {
      const date = new Date();
      let fileName = `/uploads/catg/IMG${Date.now()}${Math.round(Math.random() * 1E9)}${date.getDate()}${date.getMonth()}${date.getFullYear()}.${fileType}`;
      fs.writeFile('public' +fileName, req.files.imageFile.data, function (err, file) {
    	  if (err) {
          return res.render('reuseables/r_error', { isUrdu, errorCode: "500", errorType: "Internal Server Error", errorMsg: "There is problem writing file, try again...", isLogin: req.session.admin });
        } else {
          const catg = new Catg({
            title: req.body.catagoryTitle,
            imgSrc: fileName,
            isUrdu
          });
          catg.save()
              .then(data => { res.redirect('/catagory'); })
              .catch(err => {
                fs.unlink(fileName, err => {});
                res.render('reuseables/r_error', { isUrdu, errorCode: "502", errorType: "Database Error...", errorMsg: "Can't store to db right now...", isLogin: req.session.admin });
              });
        }
    	});
    }
  }
};

module.exports.admin_add_blog_get = async (req, res) => {
  const isUrdu = req.session.lang;
  let { e = 'nok' } = req.query;
  let { i = 'nok' } = req.query;
  e = e === 'nok' ? '' : 'Please Fill All Fields';
  i = i === 'nok' ? '' : 'Image Must bo of type JPG | JPEG | PNG';
  const catgg = await Catg.find({ isUrdu }, {title: 1, _id: 0});
  res.render('admin/blog', { isUrdu, catgg, isLogin: req.session.admin, e, i });
};


module.exports.admin_add_blog_post = (req, res) => {

  if(req.files === null || req.body.catagoryTitle === '' || req.body.catagoryDesc === '') {
    res.redirect('/add_blog?e=ok');
  }
  else {
    const isUrdu = req.session.lang;
    const fileType = req.files.imageFile.mimetype.split('/')[1];
    if(fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'jpg') {
      res.redirect('/add_blog?i=ok');
    } else {
      const date = new Date();
      let fileName = `/uploads/blogs/IMG${Date.now()}${Math.round(Math.random() * 1E9)}${date.getDate()}${date.getMonth()}${date.getFullYear()}.${fileType}`;
      fs.writeFile('public' +fileName, req.files.imageFile.data, function (err, file) {
    	  if (err) {
          res.render('reuseables/r_error', {isUrdu,  errorCode: "500", errorType: "Internal Server Error", errorMsg: "There is problem writing file, try again...", isLogin: req.session.admin });
        } else {
          const blog = new Blog({
            title: req.body.catagoryTitle,
            desc: req.body.catagoryDesc,
            catagory: req.body.catagoryOptions,
            imgSrc: fileName,
            isUrdu
          });
          blog.save()
              .then(data => { res.redirect('/blog/' +data._id); })
              .catch(err => {
                fs.unlink(fileName, err => {});
                res.render('reuseables/r_error', { isUrdu, errorCode: "502", errorType: "Database Error...", errorMsg: "Can't store to db right now...", isLogin: req.session.admin });
              });
        }
    	});
    }
  }
};
