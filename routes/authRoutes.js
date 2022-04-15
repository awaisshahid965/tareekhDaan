const { Router } = require('express');
const authController = require('../controllers/authController');
const adminCheck = require('../controllers/adminCheck');

const route = Router();

route.get('/myself_admin', adminCheck.isLoginOk, authController.admin_login_get);
route.post('/myself_admin', adminCheck.isLoginOk, authController.admin_login_post);

route.get('/logout', adminCheck.isLogin, authController.admin_logout);

module.exports = route;
