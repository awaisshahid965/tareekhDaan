const Catg = require('../models/catagory');
const Blog = require('../models/blog');
const fs = require('fs');

module.exports.updates_catg_get = async (req, res) => {
  const isUrdu = req.session.lang;
  let { id } = req.params;
  let { e = 'nok' } = req.query;
  let { i = 'nok' } = req.query;
  e = e === 'nok' ? '' : 'Please Fill All Fields';
  i = i === 'nok' ? '' : 'Image Must bo of type JPG | JPEG | PNG';
  try {
    const catag = await Catg.findById(id);
    res.render('admin/update_catg', { isUrdu, catag, isLogin: req.session.admin, e, i });
  } catch (err) {
    res.render('reuseables/r_error', { isUrdu, errorCode: "404", errorType: "Catagory Not Found", errorMsg: "No Such Catagory Exists...", isLogin: req.session.admin });
  }
}

module.exports.updates_catg_post = (req, res) => {

  let { id } = req.params;
  if ( req.body.catagoryTitle === '' ) {
    let url = '/update_catg/' +req.params.id+ '?e=ok';
    res.redirect(url);
  } else {
    const isUrdu = req.session.lang;
    if ( req.files === null ) {
      Catg.findByIdAndUpdate(id, {title: req.body.catagoryTitle })
          .then(data => {
            res.redirect('/catagory');
          })
          .catch(() => {
            res.render('reuseables/r_error', { isUrdu, errorCode: "502", errorType: "Database Error...", errorMsg: "Can't store to db right now...", isLogin: req.session.admin });
          });
    } else {
      const fileType = req.files.imageFile.mimetype.split('/')[1];
      let fileName = req.body.imgName;
      let oldFileType = fileName.split('.')[1];
      if (fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'jpg') {
        let url = '/update_catg/' +req.params.id+ '?i=ok';
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
            Catg.findByIdAndUpdate(id, {title: req.body.catagoryTitle, imgSrc: fileName })
                .then(data => {
                  res.redirect('/catagory');
                })
                .catch(() => {
                  res.render('reuseables/r_error', { isUrdu, errorCode: "502", errorType: "Database Error...", errorMsg: "Can't store to db right now...", isLogin: req.session.admin });
                });
          }
      	});
      }
    }
  }
}
