const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
 
  shop_name: {
    type: String,
 required: true,
  },
  shop_address: {
    type: String,
    required: true,
    
  },
  shop_tp: {
    type: String,
    required: true,
  },
   shop_email: {
    type: String,
    required: true,
  }

 
});

module.exports = mongoose.model('Shopdetails', shopSchema);
