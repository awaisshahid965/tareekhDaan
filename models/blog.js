const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  imgSrc: {
    type: 'String',
    required: true
  },
  catagory: {
    type: String,
    required: true
  },
  isUrdu: {
    type: Boolean,
    required: true
  }
});

const Blog = mongoose.model('blog', blogSchema);
module.exports = Blog;
