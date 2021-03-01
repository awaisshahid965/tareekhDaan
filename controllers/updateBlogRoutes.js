const Catg = require('../models/catagory');
const Blog = require('../models/blog');
const fs = require('fs');

module.exports.updates_blog_get = async (req, res) => {
  const isUrdu = req.session.lang;
  let { id } = req.params;
  let { e = 'nok' } = req.query;
  let { i = 'nok' } = req.query;
  e = e === 'nok' ? '' : 'Please Fill All Fields';
  i = i === 'nok' ? '' : 'Image Must bo of type JPG | JPEG | PNG';
  try {
    const catag = await Catg.find({ isUrdu }, {title: 1, _id: 0});
    const blogg = await Blog.findById(id);
    res.render('admin/update_blog', { isUrdu, catag, blogg, isLogin: req.session.admin, e, i });
  } catch (err) {
    res.render('reuseables/r_error', { isUrdu, errorCode: "404", errorType: "Blog Not Found", errorMsg: "No Such Blog Exists...", isLogin: req.session.admin });
  }
}

module.exports.updates_blog_put = (req, res) => {

  let { id } = req.params;
  if ( req.body.catagoryTitle === '' || req.body.catagoryDesc === '' ) {
    let url = '/update_blog/' +req.params.id+ '?e=ok';
    res.redirect(url);
  } else {
    const isUrdu = req.session.lang;
    if ( req.files === null ) {
      Blog.findByIdAndUpdate(id, {title: req.body.catagoryTitle, desc: req.body.catagoryDesc, catagory: req.body.catagoryOptions })
          .then(data => {
            let url = '/blog/' +id;
            res.redirect(url);
          })
          .catch(() => {
            res.render('reuseables/r_error', { isUrdu, errorCode: "502", errorType: "Database Error...", errorMsg: "Can't store to db right now...", isLogin: req.session.admin });
          });
    } else {
      const fileType = req.files.imageFile.mimetype.split('/')[1];
      let fileName = req.body.imgName;
      let oldFileType = fileName.split('.')[1];
      if (fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'jpg') {
        let url = '/update_blog/' +req.params.id+ '?i=ok';
        res.redirect(url);
      } else {
        if (oldFileType !== fileType) {
          fs.unlink('public' +fileName, err => {});
          fileName = fileName.replace(oldFileType, fileType);
        }
        fs.writeFile('public' +fileName, req.files.imageFile.data, function (err, file) {
      	  if (err) {
            return res.render('reuseables/r_error', { isUrdu, errorCode: "500", errorType: "Internal Server Error", errorMsg: "There is problem writing file, try again...", isLogin: req.session.admin });
          } else {
            Blog.findByIdAndUpdate(id, {title: req.body.catagoryTitle, desc: req.body.catagoryDesc, catagory: req.body.catagoryOptions, imgSrc: fileName })
                .then(data => {
                  let url = '/blog/' +id;
                  res.redirect(url);
                })
                .catch(() => {
                  res.render('reuseables/r_error', {isUrdu,  errorCode: "502", errorType: "Database Error...", errorMsg: "Can't store to db right now...", isLogin: req.session.admin });
                });
          }
      	});
      }
    }
  }
}
