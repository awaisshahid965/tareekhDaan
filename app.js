require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const efu = require('express-fileupload');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const basicRoutes = require('./routes/basicRoutes');
const catagoryRoutes = require('./routes/catagoryRoutes');
const blogRoutes = require('./routes/blogRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

// test
// database connection
mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false })
  .then((conn) => {
    app.listen(process.env.PORT || 3000);
    console.log('connection success');
  })
  .catch((err) => console.log(err));

// middleware
app.use(express.static('public'));
app.use(efu());
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: process.env.HASH,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' }),
  cookie: { maxAge: 1000 * 3600 * 2 }
}));

// view engine
app.set('view engine', 'ejs');
app.set('views', 'screens');

// routes
app.use('*', (req, res, next) => {
  if (typeof req.session.admin === 'undefined')
    req.session.admin = false;
    if (typeof req.session.lang === 'undefined') {
      req.session.lang = false;
    }
  next();
});


app.use(basicRoutes);
app.use(catagoryRoutes);
app.use(blogRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use('*', (req, res) => {
  res.redirect('/');
});
