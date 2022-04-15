const mongoose = require('mongoose');

const catgSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  isUrdu: {
    type: Boolean,
    required: true,
    default: false
  }
});

const Catg = mongoose.model('catagorie', catgSchema);
module.exports = Catg;
