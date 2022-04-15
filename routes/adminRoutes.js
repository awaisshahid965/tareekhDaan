const { Router } = require('express');
const adminController = require('../controllers/adminController');
const updateBlogRoutes = require('../controllers/updateBlogRoutes');
const updateCatgRoutes = require('../controllers/updateCatgRoutes');
const adminCheck = require('../controllers/adminCheck');
const deleteBorC = require('../controllers/deleteBorC');

const route = Router();

route.get('/add_catg', adminCheck.isLogin, adminController.admin_add_catg_get);
route.post('/add_catg', adminCheck.isLogin, adminController.admin_add_catg_post);

route.get('/update_catg/:id', adminCheck.isLogin, updateCatgRoutes.updates_catg_get);
route.post('/update_catg/:id', adminCheck.isLogin, updateCatgRoutes.updates_catg_post);




route.get('/add_blog', adminCheck.isLogin, adminController.admin_add_blog_get);
route.post('/add_blog', adminCheck.isLogin, adminController.admin_add_blog_post);


route.get('/update_blog/:id', adminCheck.isLogin, updateBlogRoutes.updates_blog_get);
route.post('/update_blog/:id', adminCheck.isLogin, updateBlogRoutes.updates_blog_put);


route.get('/delete_blog/:id', adminCheck.isLogin, deleteBorC.delete_blog);
route.get('/delete_catg/:id', adminCheck.isLogin, deleteBorC.delete_catg);

module.exports = route;
