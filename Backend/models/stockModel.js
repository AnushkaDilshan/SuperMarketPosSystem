const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId, // ideally reference the User collection
    required: true,
    ref: 'User' // assuming you have a User model
  },
  item_code: {
    type: String,
    required: true,
    trim: true
  },
  item_name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: ''
  },
  qty: {
    type: Number,
    default: 0
  },
  qty_type: {
    type: String,
    default: 'pcs',
    trim: true
  },
  bind_price: {
    type: Number,
    default: 0
  },
  seling_price: {
    type: Number,
    default: 0
  },
  discount: {
    type: [String],  // Array of strings is fine if you expect multiple discounts or notes
    default: []
  },
  Date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Stock', stockSchema);
